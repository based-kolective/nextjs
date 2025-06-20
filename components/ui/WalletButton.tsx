"use client";

import { motion } from "framer-motion";
import {
  useWallet,
  useAuth,
  useWalletLogin,
  useUser,
  useAccountContext,
} from "../../providers/AccountProvider";

interface WalletButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "none";
  showAddress?: boolean;
  className?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const { showRegistrationModal } = useAccountContext();
  const { address, isConnected } = useWallet();
  const { isAuthenticated, isLoading } = useAuth();
  const { login } = useWalletLogin();
  const user = useUser();
  const acc = useAccountContext();

  const handleClick = async () => {
    console.log("WalletButton clicked");
    console.log(acc);
    if (isConnected && !isAuthenticated) {
      // handle login
      if (
        acc.state.isRegistered &&
        acc.state.type === "SET_REGISTRATION_STATUS"
      ) {
        try {
          await login();
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
      if (!acc.state.isRegistered) {
        try {
          showRegistrationModal();
          console.log("Opening registration modal");
        } catch (error) {
          console.error("Account creation failed:", error);
        }
      }
    }

    if (isConnected && isAuthenticated) {
      console.log("Wallet is already connected and authenticated");
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-8 py-3 text-base";
      default:
        return "px-6 py-2 text-sm";
    }
  };

  const getVariantClasses = () => {
    if (isLoading) {
      return "bg-gray-600 text-gray-400 cursor-not-allowed";
    }

    switch (variant) {
      case "secondary":
        return "bg-gray-800/50 border border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500/50";
      case "outline":
        return "border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500/50 bg-transparent";
      case "none":
        return "bg-transparent text-gray-300 hover:text-white";
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <motion.svg
          className={`${getIconSize()} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </motion.svg>
      );
    }

    return (
      <svg
        className={`${getIconSize()}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    );
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-lg font-bricolage transition-all duration-300 
        flex items-center space-x-2 relative overflow-hidden
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Background gradient animation for connected state */}
      {isConnected && isAuthenticated && variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative flex items-center space-x-2">{renderIcon()}</div>
    </motion.button>
  );
};

// Compact version for navigation bars
export const WalletIconButton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { address, isConnected } = useWallet();
  const { isAuthenticated, isLoading } = useAuth();
  const { login } = useWalletLogin();

  const handleClick = async () => {
    if (isConnected && !isAuthenticated) {
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading || (isConnected && isAuthenticated)}
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
      className={`
        p-2 rounded-lg bg-gray-800/50 border border-gray-600/50 
        hover:bg-gray-700/50 hover:border-gray-500/50 
        transition-all duration-300 relative
        disabled:cursor-not-allowed
        ${className}
      `}
      title={
        isConnected && isAuthenticated
          ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
          : "Connect Wallet"
      }
    >
      {isLoading ? (
        <motion.svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </motion.svg>
      ) : (
        <svg
          className={`w-5 h-5 ${isConnected && isAuthenticated ? "text-green-400" : "text-white"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )}

      {/* Status indicator */}
      {isConnected && (
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
            isAuthenticated ? "bg-green-400" : "bg-yellow-400"
          }`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
