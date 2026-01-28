import { useEffect } from "react";
import { useAuth } from "../hooks/useApi";

/**
 * Component that initializes Zustand store with persisted auth data
 * Place this at the root of your app (in App.jsx)
 */
const StoreInitializer = ({ children }) => {
  const { initAuth } = useAuth();

  useEffect(() => {
    // Initialize auth state from localStorage on app mount
    initAuth();
  }, []);

  return children;
};

export default StoreInitializer;
