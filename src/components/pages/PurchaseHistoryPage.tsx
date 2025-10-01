import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Button, Card, PurchaseHistoryTable } from "../ui";
import { Navbar, Footer } from "../sections";
import { supabase } from "../../lib/supabase";
import type { Purchase } from "../../lib/supabase";

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ReceiptIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
  </svg>
);

export const PurchaseHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPurchases(data || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  // Pagination calculations
  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPurchases = purchases.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen py-20">
          <Card className="max-w-md w-full mx-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <ReceiptIcon />
              </div>
              <h2 className="text-xl font-semibold text-white mt-4">Not Signed In</h2>
              <p className="text-gray-400 mt-2">
                Please sign in to view your purchase history.
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeftIcon />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Purchase History</h1>
            <p className="text-gray-400">
              View and manage all your credit purchases
            </p>
          </div>

          <Card>
            <div className="p-6">
              <PurchaseHistoryTable purchases={currentPurchases} loading={loading} />
              
              {/* Pagination Controls */}
              {!loading && purchases.length > itemsPerPage && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, purchases.length)} of {purchases.length} purchases
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1;
                        
                        const showEllipsis = 
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span key={page} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
