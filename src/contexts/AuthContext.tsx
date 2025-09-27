import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signingOut: boolean;
  signUp: (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ) => Promise<{ error?: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error?: AuthError | null }>;
  signInWithGitHub: () => Promise<{ error?: AuthError | null }>;
  signOut: () => Promise<{ error?: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (session) {
        console.log("Auth session:", session);
        setSession(session);
      } else {
        setSession(null);
      }
    });
  }, []);

  const clearAuthStorage = () => {
    try {
      const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
          key.includes("supabase") ||
          key.includes("sb-") ||
          key.includes("auth-token") ||
          key.startsWith("supabase.auth.token") ||
          key.includes("gotrue")
      );

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Also clear any session storage
      const sessionKeysToRemove = Object.keys(sessionStorage).filter(
        (key) =>
          key.includes("supabase") ||
          key.includes("sb-") ||
          key.includes("auth-token") ||
          key.startsWith("supabase.auth.token") ||
          key.includes("gotrue")
      );

      sessionKeysToRemove.forEach((key) => {
        sessionStorage.removeItem(key);
      });
    } catch (storageError) {
      // Silently handle storage errors
    }
  };

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      // Try RPC function first for better reliability
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_user_credits_info",
        { user_uuid: userId }
      );

      if (!rpcError && rpcData) {
        // Convert RPC response to Profile format
        return {
          id: rpcData.profile_id,
          user_id: userId,
          display_name: rpcData.display_name,
          credits: rpcData.credits,
          created_at: rpcData.created_at,
        };
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, credits, created_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        // If profile doesn't exist, this is expected for new users
        if (error.code === "PGRST116") {
          return null;
        }
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  };

  // Create user profile in database
  const createProfile = async (
    user: User,
    userData?: { firstName: string; lastName: string }
  ): Promise<Profile | null> => {
    try {
      const profileData = {
        user_id: user.id,
        display_name: userData
          ? `${userData.firstName} ${userData.lastName}`
          : user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
        credits: 10,
      };

      // First try direct insert (should work with proper RLS policies)
      const { data: insertData, error: insertError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select("id, user_id, display_name, credits, created_at")
        .maybeSingle();

      if (!insertError && insertData) {
        return insertData;
      }

      // If direct insert fails, try RPC function as fallback
      const { error: rpcError } = await supabase.rpc("create_user_profile", {
        user_uuid: user.id,
        display_name_text: profileData.display_name,
        initial_credits: profileData.credits,
      });

      if (!rpcError) {
        // RPC succeeded, fetch the created profile
        return await fetchProfile(user.id);
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            first_name: userData.firstName,
            last_name: userData.lastName,
            is_new_signup: true,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setSigningOut(true);

      // Clear all storage first
      clearAuthStorage();

      // Clear local state immediately
      setUser(null);
      setProfile(null);
      setSession(null);

      // Try to sign out from Supabase with a short timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SignOut timeout")), 1000)
      );

      const signOutPromise = supabase.auth.signOut({ scope: "global" });

      try {
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (timeoutError) {
        // Continue even if timeout occurs
      }

      // Force clear storage again
      clearAuthStorage();

      setSigningOut(false);

      // Force navigation to signin page
      setTimeout(() => {
        window.location.href = "/signin";
      }, 100);

      return { error: null };
    } catch (error) {
      // Force clear everything even on error
      setUser(null);
      setProfile(null);
      setSession(null);
      clearAuthStorage();
      setSigningOut(false);

      // Force navigation even on error
      setTimeout(() => {
        window.location.href = "/signin";
      }, 100);

      return { error: null };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error("No user logged in") };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select("id, user_id, display_name, credits, created_at")
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Profile'ı manuel güncellemek için fonksiyon
  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signingOut,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      <>
        <div>
          {session && (
            <p className="text-white">Welcome back, {session.user?.email}</p>
          )}
        </div>
        {children}
      </>
    </AuthContext.Provider>
  );
};
