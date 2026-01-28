import React, { createContext, useEffect, useState } from "react";
import { authAPI, tasksAPI, usersAPI } from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setUserData(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    setUserData(null);
  };

  const refreshUserData = async () => {
    try {
      const data = await authAPI.getProfile();
      localStorage.setItem("user", JSON.stringify(data));
      setUserData(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getAllEmployees = async () => {
    try {
      return await usersAPI.getEmployees();
    } catch (error) {
      throw error;
    }
  };

  const getUserTasks = async () => {
    try {
      return await tasksAPI.getAll();
    } catch (error) {
      throw error;
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksAPI.create(taskData);
      return { success: true, data: newTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTaskStatus = async (taskId, action) => {
    try {
      const updatedTask = await tasksAPI.updateStatus(taskId, action);
      await refreshUserData();
      return { success: true, data: updatedTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          user: userData,
          loading,
          login,
          register,
          logout,
          refreshUserData,
          getAllEmployees,
          getUserTasks,
          createTask,
          updateTaskStatus,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
