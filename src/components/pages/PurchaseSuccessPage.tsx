import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar, Footer } from "../sections";
import { Button } from "../ui";

const CheckIcon = ({
  className = "w-16 h-16 text-green-400",
}: {
  className?: string;
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CreditIcon = () => (
  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979c.284.473.602 1.251.602 2.021 0 .967-.509 1.72-1.866 1.72S8.134 9.967 8.134 9c0-.77.318-1.548.602-2.021zM7.206 14c-.513 0-.862-.325-.862-.725 0-.617.492-1.754 1.146-2.463C7.776 10.52 8.326 10.5 10 10.5c1.674 0 2.224.02 2.51.312.654.709 1.146 1.846 1.146 2.463 0 .4-.349.725-.862.725H7.206z"
      clipRule="evenodd"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    className="w-6 h-6 text-yellow-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 1a1 1 0 01.894.553l2.991 5.982a.869.869 0 010 .928l-2.991 5.982A1 1 0 0112 15a1 1 0 01-.894-.553L8.115 8.465a.869.869 0 010-.928l2.991-5.982A1 1 0 0112 1z"
      clipRule="evenodd"
    />
  </svg>
);

export const PurchaseSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [credits, setCredits] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // URL parametrelerini al (sadece gösterim için)
    const creditsParam = searchParams.get("credits");
    const packageParam = searchParams.get("package");
    const userParam = searchParams.get("user");
    const transactionParam = searchParams.get("transaction_id") || searchParams.get("order_id");

    // State'leri güncelle (sadece gösterim için)
    if (creditsParam) setCredits(creditsParam);
    if (packageParam) setPackageName(packageParam);
    if (userParam) setUserId(userParam);
    if (transactionParam) setTransactionId(transactionParam);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navbar />

      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 space-y-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 animate-pulse">
                <SparkleIcon />
              </div>
              <div className="absolute top-20 right-16 animate-pulse delay-300">
                <SparkleIcon />
              </div>
              <div className="absolute bottom-16 left-20 animate-pulse delay-700">
                <SparkleIcon />
              </div>
              <div className="absolute bottom-10 right-10 animate-pulse delay-500">
                <SparkleIcon />
              </div>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center relative z-10">
              <div className="w-24 h-24 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center animate-bounce">
                <CheckIcon />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Purchase Successful! 🎉
                </h1>
                <p className="text-xl text-gray-300">
                  Your payment has been processed successfully.
                </p>
              </div>

              {/* Credits Info */}
              {credits && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <CreditIcon />
                    <h2 className="text-2xl font-bold text-white">
                      Credits Purchased Successfully!
                    </h2>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <p className="text-3xl font-bold text-green-400">
                      +{credits} AI Credits
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      Added to your account during purchase
                    </p>

                    <div className="mt-2 flex items-center justify-center text-green-400">
                      <CheckIcon className="w-5 h-5" />
                      <span className="ml-1 text-sm">Purchase Completed!</span>
                    </div>
                  </div>

                  {packageName && (
                    <p className="text-lg text-gray-300">
                      Package:{" "}
                      <span className="font-semibold text-white capitalize">
                        {packageName}
                      </span>
                    </p>
                  )}

                  {userId && (
                    <p className="text-xs text-gray-500">
                      User: {userId.substring(0, 8)}...
                    </p>
                  )}
                </div>
              )}

              {/* Transaction Info */}
              {transactionId && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {transactionId}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/dashboard">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Voice Cloning
                  </div>
                </Button>
              </Link>

              <Link to="/pricing">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <CreditIcon />
                    Buy More Credits
                  </div>
                </Button>
              </Link>

              <Link to="/">
                <Button variant="ghost" size="lg" className="min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Home
                  </div>
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="border-t border-white/10 pt-6 relative z-10">
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Credits added instantly</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Receipt sent to email</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Credits never expire</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              🚀 Quick Start Guide
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-400">1</span>
                </div>
                <h4 className="font-semibold text-white">Upload Audio</h4>
                <p className="text-sm text-gray-400">
                  Upload a clear audio sample of the voice you want to clone
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-400">2</span>
                </div>
                <h4 className="font-semibold text-white">AI Processing</h4>
                <p className="text-sm text-gray-400">
                  Our AI will analyze and create a voice model (5 credits)
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-400">3</span>
                </div>
                <h4 className="font-semibold text-white">Generate Speech</h4>
                <p className="text-sm text-gray-400">
                  Type any text and generate speech in the cloned voice
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
