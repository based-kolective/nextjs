"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRegistration } from "../../providers/AccountProvider";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWallet: () => Promise<void>;
  walletAddress?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onCreateWallet,
  walletAddress
}) => {
  const { isRegistering, error } = useRegistration();

  if (!isOpen) return null;

  const handleCreateAccount = async () => {
    try {
      await onCreateWallet();
    } catch (error) {
      // Error is handled in AccountProvider
      console.error('Account creation error:', error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={!isRegistering ? onClose : undefined}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bricolage font-semibold text-xl text-white">
                Welcome to Kolective!
              </h2>
              {!isRegistering && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isRegistering 
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                  : error
                  ? 'bg-gradient-to-br from-red-500 to-red-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {isRegistering ? (
                  <motion.svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </motion.svg>
                ) : error ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              
              <h3 className="font-bricolage font-semibold text-lg text-white mb-2">
                {isRegistering 
                  ? 'Creating Your Account...' 
                  : error 
                  ? 'Registration Failed'
                  : "It looks like you're new here!"
                }
              </h3>
              
              <p className="text-gray-400 font-bricolage text-sm leading-relaxed mb-4">
                {isRegistering 
                  ? 'Please sign the message in your wallet to complete registration.'
                  : error 
                  ? 'There was an issue creating your account. Please try again.'
                  : "We've detected your wallet connection, but you haven't created your Kolective account yet."
                }
              </p>

              {error && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm font-bricolage">
                    {error}
                  </p>
                </div>
              )}

              {walletAddress && !isRegistering && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-xs font-bricolage mb-1">Connected Wallet:</p>
                  <p className="text-white font-mono text-sm break-all">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              )}
              
              {!isRegistering && !error && (
                <p className="text-gray-400 font-bricolage text-sm">
                  Create your account to get started with Kolective's features.
                </p>
              )}

              {isRegistering && (
                <p className="text-yellow-400 font-bricolage text-sm">
                  Check your wallet for the signature request...
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700/50 bg-gray-800/20">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                disabled={isRegistering}
                className={`flex-1 px-4 py-2 font-bricolage text-sm transition-colors border rounded-lg ${
                  isRegistering 
                    ? 'text-gray-500 border-gray-700/50 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white border-gray-600/50 hover:border-gray-500/50'
                }`
              }
              >
                {error ? 'Close' : 'Maybe Later'}
              </button>
              <motion.button
                onClick={handleCreateAccount}
                disabled={isRegistering}
                whileHover={!isRegistering ? { scale: 1.02 } : {}}
                whileTap={!isRegistering ? { scale: 0.98 } : {}}
                className={`flex-1 px-6 py-2 rounded-lg font-bricolage text-sm transition-all duration-300 ${
                  isRegistering
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : error
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                {isRegistering ? 'Signing...' : error ? 'Try Again' : 'Create Account'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
