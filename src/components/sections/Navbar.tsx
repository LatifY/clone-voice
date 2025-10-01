import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import { useAuth } from "../../contexts";
import logo from "../../assets/img/logo.png";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// SVG Icons
const MenuIcon = () => (
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UserIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ChevronDownIcon = () => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CreditIcon = () => (
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
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ShoppingCartIcon = () => (
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
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A1 1 0 006.8 19H19M9 19a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"
    />
  </svg>
);

const DashboardIcon = () => (
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
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const LogoutIcon = () => (
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);



export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing", isRoute: true },
    { label: "Examples", href: "#examples" },
    { label: "Contact", href: "#contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      // Handle error silently
    }
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md border-b border-white/10 z-50 relative">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">Clone Voice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => 
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-gray-300 hover:text-white transition-colors font-medium cursor-pointer"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Authenticated User Menu
              <div className="relative" ref={userMenuRef}>
                {/* Credits Display */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                    <CreditIcon />
                    <span className="text-sm font-medium text-white">
                      {profile?.credits !== undefined ? `${profile.credits}` : <LoadingSpinner />} 
                    </span>
                    <span className="text-sm font-medium text-white">credits</span>
                  </div>

                  {/* User Menu Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-white hidden lg:block">
                      {profile?.display_name ||
                        <LoadingSpinner></LoadingSpinner>}
                    </span>
                    <ChevronDownIcon />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">
                        {profile?.display_name ||
                          user?.user_metadata?.full_name ||
                          user?.user_metadata?.first_name ||
                          user?.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <DashboardIcon />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon />
                        Profile
                      </Link>

                      <Link
                        to="/purchase-history"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCartIcon />
                        Purchase History
                      </Link>

                      <Link
                        to="/pricing"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingCartIcon />
                        Buy Credits
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <LogoutIcon  />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Non-authenticated buttons
              <>
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-white text-black hover:bg-gray-100 rounded-full"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-4">
            {navItems.map((item) => 
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="block px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium cursor-pointer"
                >
                  {item.label}
                </a>
              )
            )}

            {/* Mobile Auth Section */}
            <div className="px-4 pt-4 border-t border-gray-800">
              {user ? (
                // Authenticated mobile menu
                <div className="space-y-3">
                  {/* Credits */}
                  <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                    <CreditIcon />
                    <span className="text-sm font-medium text-white">
                      {profile?.credits !== undefined ? `${profile.credits} credits` : <LoadingSpinner />}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {profile?.display_name ||
                          user?.user_metadata?.full_name ||
                          user?.user_metadata?.first_name ||
                          user?.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <DashboardIcon />
                        Dashboard
                      </Button>
                    </Link>

                    <Link
                      to="/profile"
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <UserIcon />
                        Profile
                      </Button>
                    </Link>

                    <Link
                      to="/purchase-history"
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <ShoppingCartIcon />
                        Purchase History
                      </Button>
                    </Link>

                    <Link
                      to="/pricing"
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <ShoppingCartIcon />
                        Buy Credits
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <LogoutIcon />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                // Non-authenticated mobile menu
                <div className="space-y-2">
                  <Link
                    to="/signin"
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-white text-black hover:bg-gray-100 rounded-full"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
