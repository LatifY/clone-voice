import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts";
import { Button, Card } from "../ui";

// SVG Icons
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

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
    }
  }, [profile]);

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

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    setMessage(null);

    try {
      await refreshProfile();
      setMessage({
        type: "success",
        text: "Profile refreshed successfully!"
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to refresh profile. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <div className="text-center py-8">
            <UserIcon />
            <h2 className="text-xl font-semibold text-white mt-4">
              Not Signed In
            </h2>
            <p className="text-gray-400 mt-2">
              Please sign in to view your profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Info Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {profile?.display_name || "User"}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Credits Display */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CreditIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Available Credits
                  </p>
                  <p className="text-xl font-bold text-white">
                    {profile?.credits ?? 0}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshProfile}
                    disabled={isRefreshing}
                    className="gap-2"
                  >
                    <RefreshIcon />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
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
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </div>
          </Card>

          {/* Account Info Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">User ID</span>
                  <span className="text-white font-mono text-sm">
                    {user.id.slice(0, 8)}...
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Account Created</span>
                  <span className="text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Last Sign In</span>
                  <span className="text-white">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Email Confirmed</span>
                  <span
                    className={`font-medium ${
                      user.email_confirmed_at
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {user.email_confirmed_at ? "Yes" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};