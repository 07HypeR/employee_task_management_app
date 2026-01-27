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

    // Listen for changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "employees" || e.key === "admin") {
        const { employees, admin } = getLocalStorage();
        setUserData({ employees, admin });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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

  const registerUser = (userData) => {
    const { role, fname, lname, email, password } = userData;
    const { employees, admin } = getLocalStorage();

    if (role === "employee") {
      const newUser = {
        id: employees.length + 1,
        fname,
        lname,
        email,
        password,
        taskNumbers: { active: 0, newTask: 0, completed: 0, failed: 0 },
        tasks: [],
      };
      const updatedEmployees = [...employees, newUser];
      setUserData({ employees: updatedEmployees, admin });
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    } else if (role === "admin") {
      const newAdmin = {
        id: admin.length + 1,
        fname,
        lname,
        email,
        password,
      };
      const updatedAdmin = [...admin, newAdmin];
      setUserData({ employees, admin: updatedAdmin });
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    }
    return true;
  };

  const updateTaskStatus = (employeeEmail, taskTitle, newStatus) => {
    const { employees, admin } = getLocalStorage();
    const employeeIndex = employees.findIndex(
      (emp) => emp.email === employeeEmail,
    );

    if (employeeIndex !== -1) {
      const updatedEmployees = [...employees];
      const employee = { ...updatedEmployees[employeeIndex] };
      const taskIndex = employee.tasks.findIndex((t) => t.title === taskTitle);

      if (taskIndex !== -1) {
        const updatedTasks = [...employee.tasks];
        const task = { ...updatedTasks[taskIndex] };

        // Reset all status flags
        task.active = false;
        task.newTask = false;
        task.completed = false;
        task.failed = false;

        // Apply new status
        if (newStatus === "accepted") task.active = true;
        if (newStatus === "completed") task.completed = true;
        if (newStatus === "failed") task.failed = true;

        updatedTasks[taskIndex] = task;
        employee.tasks = updatedTasks;

        // Recalculate task numbers
        employee.taskNumbers = {
          active: updatedTasks.filter((t) => t.active).length,
          newTask: updatedTasks.filter((t) => t.newTask).length,
          completed: updatedTasks.filter((t) => t.completed).length,
          failed: updatedTasks.filter((t) => t.failed).length,
        };

        updatedEmployees[employeeIndex] = employee;
        setUserData({ employees: updatedEmployees, admin });
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));

        // Also update loggedInUser if it's the current user
        const loggedInUserStr = localStorage.getItem("loggedInUser");
        if (loggedInUserStr) {
          const loggedInUser = JSON.parse(loggedInUserStr);
          if (loggedInUser.data.email === employeeEmail) {
            localStorage.setItem(
              "loggedInUser",
              JSON.stringify({
                ...loggedInUser,
                data: employee,
              }),
            );
          }
        }
      }
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{ ...userData, updateEmployees, registerUser, updateTaskStatus }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
