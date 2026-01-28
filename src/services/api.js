const API_BASE_URL = "https://task-management-backend-woep.onrender.com/api";

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiCall("/auth/profile"),
};

// Tasks API
export const tasksAPI = {
  getAll: (status = null) => {
    const endpoint = status ? `/tasks?status=${status}` : "/tasks";
    return apiCall(endpoint);
  },

  getById: (id) => apiCall(`/tasks/${id}`),

  create: (taskData) =>
    apiCall("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  update: (id, taskData) =>
    apiCall(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),

  updateStatus: (id, action) =>
    apiCall(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    }),

  delete: (id) =>
    apiCall(`/tasks/${id}`, {
      method: "DELETE",
    }),

  getByEmployee: (employeeId) => apiCall(`/tasks/employee/${employeeId}`),
};

// Users API
export const usersAPI = {
  getAll: () => apiCall("/users"),

  getEmployees: () => apiCall("/users/employees"),

  getById: (id) => apiCall(`/users/${id}`),

  getWithTasks: (id) => apiCall(`/users/${id}/with-tasks`),

  update: (id, userData) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  delete: (id) =>
    apiCall(`/users/${id}`, {
      method: "DELETE",
    }),
};
