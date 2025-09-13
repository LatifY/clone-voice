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
      console.warn("Error clearing auth storage:", storageError);
    }
  };

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, credits, created_at")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log('Fetched profile data:', data);
      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  // Create user profile in database
  const createProfile = async (
    user: User,
    userData?: { firstName: string; lastName: string }
  ) => {
    try {
      const profileData = {
        id: user.id,
        display_name: userData
          ? `${userData.firstName} ${userData.lastName}`
          : user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
        credits: 10, // Free credits on signup
      };

      console.log('Creating profile with data:', profileData);

      const { data, error } = await supabase
        .from("profiles")
        .upsert([profileData], {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select("id, display_name, credits, created_at")
        .maybeSingle();

      if (error) {
        console.error("Error creating profile:", error);

        // If it's an RLS error, try to fetch existing profile instead
        if (
          error.code === "42501" ||
          error.message?.includes("row-level security")
        ) {
          console.log(
            "RLS prevented profile creation, trying to fetch existing profile..."
          );
          return await fetchProfile(user.id);
        }

        return null;
      }

      console.log('Created profile successfully:', data);
      return data;
    } catch (error) {
      console.error("Unexpected error creating profile:", error);
      // Try to fetch existing profile as fallback
      try {
        return await fetchProfile(user.id);
      } catch (fetchError) {
        console.error("Failed to fetch profile as fallback:", fetchError);
        return null;
      }
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('Initial auth - fetching profile for:', session.user.id);
            const profileData = await fetchProfile(session.user.id);
            console.log('Initial auth - profile data:', profileData);
            setProfile(profileData);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error initializing auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        console.log('Auth state change event:', event);
        console.log('Session user:', session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id);
          let profileData = await fetchProfile(session.user.id);
          console.log('Profile data after fetch:', profileData);

          // Only create profile if it doesn't exist AND it's a new signup
          // Check if user was created recently (within last 30 seconds) OR has signup flag
          if (!profileData && event === "SIGNED_IN") {
            const userCreatedAt = new Date(session.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const isRecentSignup = timeDiff < 30000; // 30 seconds
            const hasSignupFlag =
              session.user.user_metadata?.is_new_signup === true;

            console.log('Checking if should create profile:');
            console.log('- isRecentSignup:', isRecentSignup);
            console.log('- hasSignupFlag:', hasSignupFlag);
            console.log('- timeDiff:', timeDiff);

            if (isRecentSignup || hasSignupFlag) {
              // Extract user data from metadata for profile creation
              const userData =
                session.user.user_metadata?.first_name &&
                session.user.user_metadata?.last_name
                  ? {
                      firstName: session.user.user_metadata.first_name,
                      lastName: session.user.user_metadata.last_name,
                    }
                  : undefined;

              console.log('Creating profile with userData:', userData);
              profileData = await createProfile(session.user, userData);
              console.log('Profile created:', profileData);
            } else {
              // If profile doesn't exist for existing user, create one as fallback
              console.log('Creating fallback profile for existing user');
              profileData = await createProfile(session.user, undefined);
              console.log('Fallback profile created:', profileData);
            }
          }

          console.log('Setting profile:', profileData);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in auth state change:", error);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
            is_new_signup: true, // Flag to identify new signups
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (!error && data.user) {
        // Profile will be created automatically via auth state change listener for new signups
        console.log("User signed up successfully");
      }

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

      // Clear local state immediately for better UX
      setUser(null);
      setProfile(null);
      setSession(null);

      // Clear all authentication storage
      clearAuthStorage();

      // Try to sign out from Supabase with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SignOut timeout")), 2000)
      );

      const signOutPromise = supabase.auth.signOut({ scope: "global" });

      try {
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn("SignOut API call timed out, but local state cleared");
      }

      // Double-check that storage is cleared
      clearAuthStorage();

      setSigningOut(false);
      return { error: null };
    } catch (error) {
      console.warn("SignOut error (but local state cleared):", error);

      // Ensure local state is cleared even if there's an error
      setUser(null);
      setProfile(null);
      setSession(null);
      clearAuthStorage();

      setSigningOut(false);
      // Don't return the error to user, sign out was successful locally
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
        .eq("id", user.id)
        .select("id, display_name, credits, created_at")
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }

      return { error };
    } catch (error) {
      return { error };
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
