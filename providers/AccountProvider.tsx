import { s } from "framer-motion/dist/types.d-6pKw1mTI";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

// Types
export interface User {
  id: string;
  createdAt: string;
  lastLoginAt?: string;
  ownerAddress: string;
  walletAddress: string;
}

export interface AccountState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRegistered: boolean | null;
  showRegistrationModal: boolean;
  isRegistering: boolean;
  type?: string; // Optional type for debugging
}

type AccountAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REGISTRATION_STATUS"; payload: boolean }
  | { type: "CHECK_REGISTRATION_START" }
  | { type: "SHOW_REGISTRATION_MODAL" }
  | { type: "HIDE_REGISTRATION_MODAL" }
  | { type: "REGISTRATION_START" }
  | { type: "REGISTRATION_SUCCESS"; payload: any }
  | { type: "REGISTRATION_FAILURE"; payload: string };

interface AccountContextType {
  state: AccountState;
  login: () => Promise<void>; // Updated to remove email/password parameters
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  showRegistrationModal: () => void;
  hideRegistrationModal: () => void;
  createAccount: () => Promise<void>;
}

// Initial state
const initialState: AccountState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRegistered: null,
  showRegistrationModal: false,
  isRegistering: false,
};

// Reducer
function accountReducer(
  state: AccountState,
  action: AccountAction
): AccountState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        type: action.type,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        type: action.type,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        type: action.type,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "CHECK_REGISTRATION_START":
      return {
        ...state,
        type: action.type,
        isLoading: true,
        error: null,
      };
    case "SET_REGISTRATION_STATUS":
      return {
        ...state,
        type: action.type,
        isRegistered: action.payload,
        isLoading: false,
        showRegistrationModal: action.payload === false,
      };
    case "SHOW_REGISTRATION_MODAL":
      return {
        ...state,
        type: action.type,
        showRegistrationModal: true,
      };
    case "HIDE_REGISTRATION_MODAL":
      return {
        ...state,
        type: action.type,
        showRegistrationModal: false,
      };
    case "REGISTRATION_START":
      return {
        ...state,
        type: action.type,
        isRegistering: true,
        error: null,
      };
    case "REGISTRATION_SUCCESS":
      return {
        ...state,
        type: action.type,
        isRegistering: false,
        isRegistered: true,
        showRegistrationModal: false,
        error: null,
      };
    case "REGISTRATION_FAILURE":
      return {
        ...state,
        type: action.type,
        isRegistering: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        type: action.type,
        user: null,
        isAuthenticated: false,
        error: null,
        isRegistered: null,
        showRegistrationModal: false,
        isRegistering: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        type: action.type,

        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        type: action.type,

        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        type: action.type,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Context
const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Provider Props
interface AccountProviderProps {
  children: ReactNode;
}

// Provider Component
export function AccountProvider({ children }: AccountProviderProps) {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  // RainbowKit wallet connection detection
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Check for existing token on mount
  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Basic JWT structure validation (header.payload.signature)
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            // Decode payload to get user info
            const payload = JSON.parse(atob(tokenParts[1]));

            // Check if token is not expired
            if (payload.exp && payload.exp * 1000 > Date.now()) {
              console.log(
                "🔄 Restoring authentication from token:",
                payload.address || payload.sub
              );

              // Try to get stored user data first
              const storedUserData = localStorage.getItem("userData");
              let userData = null;

              if (storedUserData) {
                try {
                  userData = JSON.parse(storedUserData);
                  dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: {
                      id: userData?.id || payload.sub,
                      ownerAddress:
                        userData?.ownerAddress ||
                        payload.address ||
                        payload.sub,
                      walletAddress: userData?.walletAddress || "",
                      createdAt:
                        userData?.createdAt || new Date().toISOString(),
                      lastLoginAt: new Date().toISOString(),
                    },
                  });
                  return;
                } catch (error) {
                  console.warn("Failed to parse stored user data");
                  console.error("Error parsing user data:", error);
                }
              }
            } else {
              console.log("🔒 Token expired, removing from storage");
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
            }
          } else {
            console.log("🔒 Invalid token format, removing from storage");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
          }
        } catch (error) {
          console.error("🔒 Error parsing token:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
    };

    checkExistingToken();
  }, []); // Run once on mount

  // Generate registration message
  const generateRegistrationMessage = useCallback(
    (walletAddress: string): string => {
      const timestamp = new Date().toISOString();
      return `Welcome to Kolective!\n\nBy signing this message, you agree to register your wallet with Kolective.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\n\nThis signature will expire in 10 minutes.`;
    },
    []
  );

  // Register user with signed message
  const registerUser = useCallback(
    async (walletAddress: string, message: string, signature: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_AGENT_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_AGENT_URL is not configured");
      }

      const response = await fetch(`${apiUrl}/web3-account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Registration failed: ${response.statusText}`
        );
      }

      return response.json();
    },
    []
  );

  // Generate login message
  const generateLoginMessage = useCallback((walletAddress: string): string => {
    const timestamp = new Date().toISOString();
    return `Sign in to Kolective\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\n\nThis signature will expire in 10 minutes.`;
  }, []);

  // Login user with signed message
  const loginUser = useCallback(
    async (walletAddress: string, message: string, signature: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_AGENT_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_AGENT_URL is not configured");
      }

      const response = await fetch(`${apiUrl}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Login failed: ${response.statusText}`
        );
      }

      return response.json();
    },
    []
  );

  // Check registration status
  const checkRegistration = useCallback(async (walletAddress: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_AGENT_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_AGENT_URL is not configured");
      return;
    }

    try {
      dispatch({ type: "CHECK_REGISTRATION_START" });

      const response = await fetch(
        `${apiUrl}/web3-account/check-registration?address=${encodeURIComponent(walletAddress)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Registration check failed: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("📋 Registration Status:", {
        address: data.address,
        isRegistered: data.isRegistered,
        timestamp: new Date().toISOString(),
      });

      console.log(data);

      dispatch({
        type: "SET_REGISTRATION_STATUS",
        payload: data.isRegistered,
      });
      return data.isRegistered;
    } catch (error) {
      console.error("Failed to check registration:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload:
          error instanceof Error ? error.message : "Registration check failed",
      });
    }
  }, []);

  // Monitor wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      console.log("🔗 Wallet Connected:", {
        address,
        connector: connector?.name,
        timestamp: new Date().toISOString(),
      });

      // Check registration status when wallet connects
      checkRegistration(address);

      // Update user state when wallet connects (only if not already authenticated)
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (!state.isAuthenticated && userData) {
        dispatch({
          type: "UPDATE_USER",
          payload: {
            id: userData.id,
            ownerAddress: userData.ownerAddress || address,
            walletAddress: userData.walletAddress || address,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          },
        });
      }
    } else if (!isConnected && state.user?.id?.startsWith("0x")) {
      console.log("🔌 Wallet Disconnected:", {
        timestamp: new Date().toISOString(),
      });

      // Clear wallet-based user data when disconnected
      dispatch({ type: "LOGOUT" });
    }
  }, [
    isConnected,
    address,
    connector,
    checkRegistration,
    state.user?.id,
    state.isAuthenticated,
  ]);

  const login = useCallback(async (): Promise<void> => {
    if (!address) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "No wallet address found",
      });
      return;
    }

    try {
      dispatch({ type: "LOGIN_START" });

      console.log("🔐 Starting wallet login for:", address);

      // Generate message to sign
      const message = generateLoginMessage(address);

      console.log("📝 Generated login message for signing:", message);

      // Sign the message
      const signature = await signMessageAsync({ message });

      console.log("✍️ Login message signed successfully");

      // Login with backend
      const result = await loginUser(address, message, signature);

      console.log("✅ Login successful:", {
        userAddress: result.user.ownerAddress,
        walletAddress: result.user.walletAddress,
        timestamp: new Date().toISOString(),
      });

      // Store JWT token
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
      }

      console.log("result.user", result.user);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          id: result.user.id,
          ownerAddress: result.user.ownerAddress,
          walletAddress: result.user.walletAddress,
          createdAt: result.user.createdAt,
          lastLoginAt: new Date().toISOString(),
        },
      });

      // Mark as registered since login was successful
      dispatch({
        type: "SET_REGISTRATION_STATUS",
        payload: true,
      });
    } catch (error) {
      console.error("❌ Login failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });

      throw error;
    }
  }, [address, generateLoginMessage, signMessageAsync, loginUser]);

  const logout = useCallback(() => {
    // Clear stored tokens and user data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");

    // Disconnect wallet if connected
    if (isConnected) {
      disconnect();
    }

    // TODO: Call logout API endpoint if needed
    // fetch('/api/auth/logout', { method: 'POST' });

    dispatch({ type: "LOGOUT" });
  }, [isConnected, disconnect]);

  const updateUser = useCallback((userData: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const showRegistrationModal = useCallback(() => {
    dispatch({ type: "SHOW_REGISTRATION_MODAL" });
  }, []);

  const hideRegistrationModal = useCallback(() => {
    dispatch({ type: "HIDE_REGISTRATION_MODAL" });
  }, []);

  const createAccount = useCallback(async (): Promise<void> => {
    if (!address) {
      dispatch({
        type: "REGISTRATION_FAILURE",
        payload: "No wallet address found",
      });
      return;
    }

    try {
      dispatch({ type: "REGISTRATION_START" });

      console.log("🚀 Starting account creation for wallet:", address);

      // Generate message to sign
      const message = generateRegistrationMessage(address);

      console.log("📝 Generated message for signing:", message);

      // Sign the message
      const signature = await signMessageAsync({ message });

      console.log("✍️ Message signed successfully");

      // Register with backend
      const result = await registerUser(address, message, signature);

      console.log("✅ Registration successful:", {
        userAddress: result.userAddress,
        generatedWallet: result.generatedWallet,
        timestamp: new Date().toISOString(),
      });

      dispatch({
        type: "REGISTRATION_SUCCESS",
        payload: result,
      });

      // Update user data with registration info
      dispatch({
        type: "UPDATE_USER",
        payload: {
          id: result.user?.id || result.userAddress,
          ownerAddress: result.userAddress,
          walletAddress: result.generatedWallet || "",
          createdAt: result.user?.createdAt || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("❌ Registration failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";

      dispatch({
        type: "REGISTRATION_FAILURE",
        payload: errorMessage,
      });

      // Don't hide modal on error so user can retry
    }
  }, [address, generateRegistrationMessage, signMessageAsync, registerUser]);

  const value: AccountContextType = {
    state,
    login,
    logout,
    updateUser,
    clearError,
    showRegistrationModal,
    hideRegistrationModal,
    createAccount,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

// Custom Hook - Renamed to avoid conflict with wagmi's useAccount
export function useAccountContext(): AccountContextType {
  const context = useContext(AccountContext);

  if (context === undefined) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }

  return context;
}

// Convenience hooks
export function useUser(): User | null {
  const { state } = useAccountContext();
  return state.user;
}

export function useAuth(): { isAuthenticated: boolean; isLoading: boolean } {
  const { state } = useAccountContext();
  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  };
}

// Additional convenience hook for wallet data
export function useWallet(): {
  address: string | undefined;
  isConnected: boolean;
  connector: any;
} {
  const { address, isConnected, connector } = useAccount();
  return { address, isConnected, connector };
}

// Additional convenience hook for registration status with more details
export function useRegistration(): {
  isRegistered: boolean | null;
  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
} {
  const { state } = useAccountContext();
  return {
    isRegistered: state.isRegistered,
    isLoading: state.isLoading,
    isRegistering: state.isRegistering,
    error: state.error,
  };
}

// Add convenience hook for wallet login
export function useWalletLogin(): {
  login: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
} {
  const { login, state } = useAccountContext();
  return {
    login,
    isLoading: state.isLoading,
    error: state.error,
  };
}
