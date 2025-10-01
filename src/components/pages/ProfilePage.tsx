import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Button, Card, PurchaseHistoryTable } from "../ui";
import { Navbar, Footer } from "../sections";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { supabase } from "../../lib/supabase";
import type { Purchase } from "../../lib/supabase";

const UserIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SaveIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const CreditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
  >
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
    }
  }, [profile]);

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      if (!user) {
        setLoadingPurchases(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;

        setPurchases(data || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoadingPurchases(false);
      }
    };

    fetchRecentPurchases();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setMessage({
        type: "error",
        text: "Display name cannot be empty"
      });
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      const { error } = await updateProfile({
        display_name: displayName.trim()
      });

      if (error) {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again."
        });
      } else {
        setMessage({
          type: "success",
          text: "Profile updated successfully!"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshCredits = async () => {
    setIsRefreshing(true);
    setMessage(null);

    try {
      await refreshProfile();
      setMessage({
        type: "success",
        text: "Credits refreshed successfully!"
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to refresh credits. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAuthProvider = () => {
    const providers = user?.app_metadata?.providers || [];
    if (providers.includes('google')) return { name: 'Google', icon: <GoogleIcon /> };
    if (providers.includes('github')) return { name: 'GitHub', icon: <GithubIcon /> };
    return null;
  };

  const authProvider = getAuthProvider();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen py-20">
          <Card className="max-w-md w-full mx-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon />
              </div>
              <h2 className="text-xl font-semibold text-white mt-4">
                Not Signed In
              </h2>
              <p className="text-gray-400 mt-2">
                Please sign in to view your profile.
              </p>
              <Link to="/signin" className="mt-6 inline-block">
                <Button variant="primary">Sign In</Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navbar />
      
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeftIcon />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {profile?.display_name || <LoadingSpinner />}
                    </h1>
                    <p className="text-gray-400 truncate text-sm flex items-center gap-2">
                      <MailIcon />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <CreditIcon />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Available Credits</p>
                        <p className="text-2xl font-bold text-white">
                          {profile?.credits ?? 0}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshCredits}
                      disabled={isRefreshing}
                      className="w-full gap-2 mt-2"
                    >
                      <RefreshIcon />
                      {isRefreshing ? "Refreshing..." : "Refresh Credits"}
                    </Button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon />
                      <span className="text-gray-400">Joined:</span>
                      <span className="text-white">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon />
                      <span className="text-gray-400">Last Sign In:</span>
                      <span className="text-white">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    {authProvider && (
                      <div className="flex items-center gap-2 text-sm pt-2 border-t border-white/10">
                        {authProvider.icon}
                        <span className="text-gray-400">Signed in with:</span>
                        <span className="text-white">{authProvider.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your display name"
                      maxLength={50}
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === "success"
                          ? "bg-green-500/20 border border-green-500/30 text-green-400"
                          : "bg-red-500/20 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isUpdating || !displayName.trim()}
                    className="w-full gap-2"
                  >
                    <SaveIcon />
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </form>
              </div>
            </Card>

            {purchases.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Purchases</h2>
                    <Link to="/purchase-history">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  <PurchaseHistoryTable purchases={purchases} loading={loadingPurchases} />
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};