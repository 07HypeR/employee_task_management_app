import React, { createContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/LocalStorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Only initialize localStorage if it's empty (first time load)
    // This prevents overwriting user data on refresh
    const existingEmployees = localStorage.getItem("employees");
    const existingAdmin = localStorage.getItem("admin");

    if (!existingEmployees || !existingAdmin) {
      // First time - set initial data
      setLocalStorage();
    }

    // Load data from localStorage
    const { employees, admin } = getLocalStorage();
    setUserData({ employees, admin });
  }, []);

  const updateEmployees = (updatedEmployees) => {
    // Get the current admin from localStorage (not state, as it might be stale)
    const currentAdmin = JSON.parse(localStorage.getItem("admin")) || [];

    // Update state
    setUserData({ employees: updatedEmployees, admin: currentAdmin });

    // Also update localStorage to persist the changes
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    console.log("✅ Saved to localStorage:", updatedEmployees);
  };

  return (
    <div>
      <AuthContext.Provider value={{ ...userData, updateEmployees }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
