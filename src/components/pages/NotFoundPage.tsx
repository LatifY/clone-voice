import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../sections";
import { Button } from "../ui";

const ErrorIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navbar />

      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gray-500/20 backdrop-blur-sm border border-gray-400/30 rounded-full flex items-center justify-center">
                <ErrorIcon />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white">404</h1>
              <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
              <p className="text-gray-300">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/">
                <Button variant="primary" size="lg" className="px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};