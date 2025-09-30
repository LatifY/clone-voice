import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  setPseudoCreditsProfile: (credits: number) => void;
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
  const initialLoadDone = useRef(false);

  useEffect(() => {
    console.log("Profile updated:", profile);
  }, [profile])
  

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession?.user) {
        setSession(initialSession);
        setUser(initialSession.user);
        
        let userProfile = await fetchProfile(initialSession.user.id);
        
        if (!userProfile) {
          userProfile = await createProfile(initialSession.user);
        }
        
        setProfile(userProfile);
      }
      
      setLoading(false);
      initialLoadDone.current = true;
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!initialLoadDone.current) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
    } catch (storageError) {}
  };

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, credits, created_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
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

      const { data: insertData, error: insertError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select("id, user_id, display_name, credits, created_at")
        .maybeSingle();

      if (!insertError && insertData) {
        return insertData;
      }

      const { error: rpcError } = await supabase.rpc("create_user_profile", {
        user_uuid: user.id,
        display_name_text: profileData.display_name,
        initial_credits: profileData.credits,
      });

      if (!rpcError) {
        return await fetchProfile(user.id);
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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

      if (data?.user && !error) {
        let userProfile = await fetchProfile(data.user.id);
        
        if (!userProfile) {
          userProfile = await createProfile(data.user, userData);
        }
        
        setProfile(userProfile);
      }

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data?.user && !error) {
        let userProfile = await fetchProfile(data.user.id);
        
        if (!userProfile) {
          userProfile = await createProfile(data.user);
        }
        
        setProfile(userProfile);
      }

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

      clearAuthStorage();

      setUser(null);
      setProfile(null);
      setSession(null);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SignOut timeout")), 1000)
      );

      const signOutPromise = supabase.auth.signOut({ scope: "global" });

      try {
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (timeoutError) {}

      clearAuthStorage();

      setSigningOut(false);

      setTimeout(() => {
        window.location.href = "/signin";
      }, 100);

      return { error: null };
    } catch (error) {
      setUser(null);
      setProfile(null);
      setSession(null);
      clearAuthStorage();
      setSigningOut(false);

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

  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  const setPseudoCreditsProfile = (credits: number) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        credits,
      };
    });
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
    setPseudoCreditsProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};