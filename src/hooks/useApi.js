import { authAPI, tasksAPI, usersAPI } from "../services/api";
import useStore from "../store/useStore";

// Auth hooks
export const useAuth = () => {
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const authLoading = useStore((state) => state.authLoading);
  const setUser = useStore((state) => state.setUser);
  const clearUser = useStore((state) => state.clearUser);
  const setAuthLoading = useStore((state) => state.setAuthLoading);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
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
    clearUser();
  };

  const refreshUserData = async () => {
    try {
      const data = await authAPI.getProfile();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const initAuth = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };

  return {
    user,
    isAuthenticated,
    authLoading,
    login,
    register,
    logout,
    refreshUserData,
    initAuth,
  };
};

// Tasks hooks
export const useTasks = () => {
  const tasks = useStore((state) => state.tasks);
  const tasksLoading = useStore((state) => state.tasksLoading);
  const tasksError = useStore((state) => state.tasksError);
  const setTasks = useStore((state) => state.setTasks);
  const setTasksLoading = useStore((state) => state.setTasksLoading);
  const setTasksError = useStore((state) => state.setTasksError);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  const removeTask = useStore((state) => state.removeTask);
  const getTaskById = useStore((state) => state.getTaskById);
  const getTasksByStatus = useStore((state) => state.getTasksByStatus);
  const getTaskCounts = useStore((state) => state.getTaskCounts);

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const data = await tasksAPI.getAll();
      setTasks(data);
      return data;
    } catch (error) {
      setTasksError(error.message);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksAPI.create(taskData);
      addTask(newTask);
      return { success: true, data: newTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTaskStatus = async (taskId, action) => {
    try {
      const updatedTask = await tasksAPI.updateStatus(taskId, action);
      updateTask(taskId, updatedTask);
      return { success: true, data: updatedTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    tasks,
    tasksLoading,
    tasksError,
    fetchTasks,
    createTask,
    updateTaskStatus,
    getTaskById,
    getTasksByStatus,
  };
};

// Employees hooks (for admin)
export const useEmployees = () => {
  const employees = useStore((state) => state.employees);
  const employeesLoading = useStore((state) => state.employeesLoading);
  const setEmployees = useStore((state) => state.setEmployees);
  const setEmployeesLoading = useStore((state) => state.setEmployeesLoading);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const data = await usersAPI.getEmployees();
      setEmployees(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setEmployeesLoading(false);
    }
  };

  return {
    employees,
    employeesLoading,
    fetchEmployees,
  };
};
