import React, { useState } from "react";
import type { Purchase } from "../../lib/supabase";

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

interface PurchaseHistoryTableProps {
  purchases: Purchase[];
  loading?: boolean;
}

type SortField = "created_at" | "amount" | "transaction_type";
type SortOrder = "asc" | "desc";

export const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({
  purchases,
  loading = false,
}) => {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Lock body scroll when modal is open

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedPurchases = purchases
    .filter((purchase) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        purchase.metadata.package_id?.toLowerCase().includes(searchLower) ||
        purchase.metadata.payment_method?.toLowerCase().includes(searchLower) ||
        purchase.transaction_type.toLowerCase().includes(searchLower) ||
        purchase.metadata.paddle_transaction_id?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      if (sortField === "created_at") {
        return multiplier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      
      if (sortField === "amount") {
        return multiplier * (a.amount - b.amount);
      }
      
      if (sortField === "transaction_type") {
        return multiplier * a.transaction_type.localeCompare(b.transaction_type);
      }
      
      return 0;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4">Loading purchases...</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
          <PackageIcon />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Purchase History</h3>
        <p className="text-gray-400 mb-6">
          You haven't made any purchases yet. Get started by buying credits!
        </p>
        <a href="/pricing">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
            View Pricing
          </button>
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 overflow-hidden">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by package, payment method, or transaction ID..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>

        <div className="overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Date <SortIcon field="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Credits <SortIcon field="amount" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAndSortedPurchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  onClick={() => setSelectedPurchase(purchase)}
                  className="hover:bg-white/5 cursor-pointer transition-all hover:scale-[1.01] duration-200 focus:outline-none"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPurchase(purchase);
                    }
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {new Date(purchase.created_at).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-500">
                      {new Date(purchase.created_at).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <PackageIcon />
                      <span className="text-white font-medium capitalize">
                        {purchase.metadata.package_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon />
                      <span className="text-gray-300 capitalize">
                        {purchase.metadata.payment_method}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="text-green-400 font-medium">+{purchase.amount}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedPurchases.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-400">No purchases match your search</p>
          </div>
        )}
      </div>

      {/* Full-screen modal overlay */}
      {selectedPurchase && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-9999"
          onClick={() => setSelectedPurchase(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 backdrop-blur-xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPurchase(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircleIcon />
              </div>
            </div>

            {/* Main Info */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Purchase Complete</h3>
              <p className="text-gray-400 text-sm">Transaction successful</p>
            </div>

            {/* Crucial Details - Compact Grid */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Credits</span>
                <span className="text-xl font-bold text-green-400">+{selectedPurchase.amount}</span>
              </div>

            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Paid amount</span>
                <span className="text-xl font-bold text-green-400">{selectedPurchase.metadata.amount_paid}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Package</span>
                <span className="text-sm font-semibold text-white capitalize">{selectedPurchase.metadata.package_id}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Payment</span>
                <span className="text-sm font-medium text-white capitalize">{selectedPurchase.metadata.payment_method}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">New Balance</span>
                <span className="text-sm font-semibold text-white">{selectedPurchase.new_balance} credits</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Date</span>
                <span className="text-sm text-white">{new Date(selectedPurchase.created_at).toLocaleDateString()}</span>
              </div>

              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-sm text-gray-400">Transaction ID</span>
                <span className="text-sm text-white">{selectedPurchase.metadata.paddle_transaction_id}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPurchase(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
