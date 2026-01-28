import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set, get) => ({
    // Auth State
    user: null,
    isAuthenticated: false,
    authLoading: false,

    // Tasks State
    tasks: [],
    tasksLoading: false,
    tasksError: null,

    // Employees State (for admins)
    employees: [],
    employeesLoading: false,

    // Actions: Auth
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
    setAuthLoading: (loading) => set({ authLoading: loading }),

    // Actions: Tasks
    setTasks: (tasks) => set({ tasks, tasksError: null }),
    setTasksLoading: (loading) => set({ tasksLoading: loading }),
    setTasksError: (error) => set({ tasksError: error }),

    // Add a single task
    addTask: (task) =>
      set((state) => ({
        tasks: [...state.tasks, task],
      })),

    // Update a specific task (optimistic update)
    updateTask: (taskId, updates) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? { ...task, ...updates } : task,
        ),
      })),

    // Remove a task
    removeTask: (taskId) =>
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      })),

    // Actions: Employees
    setEmployees: (employees) => set({ employees }),
    setEmployeesLoading: (loading) => set({ employeesLoading: loading }),

    // Computed values
    getTaskById: (taskId) => {
      const { tasks } = get();
      return tasks.find((task) => task._id === taskId);
    },

    getTasksByStatus: (status) => {
      const { tasks } = get();
      switch (status) {
        case "newTask":
          return tasks.filter((t) => t.newTask);
        case "active":
          return tasks.filter((t) => t.active);
        case "completed":
          return tasks.filter((t) => t.completed);
        case "failed":
          return tasks.filter((t) => t.failed);
        case "declined":
          return tasks.filter((t) => t.declined);
        default:
          return tasks;
      }
    },

    getTaskCounts: () => {
      const { tasks } = get();
      return {
        newTask: tasks.filter((t) => t.newTask).length,
        active: tasks.filter((t) => t.active).length,
        completed: tasks.filter((t) => t.completed).length,
        failed: tasks.filter((t) => t.failed).length,
        declined: tasks.filter((t) => t.declined).length,
      };
    },
  })),
);

export default useStore;
