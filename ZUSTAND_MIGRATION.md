# Zustand State Management - Migration Guide

## Overview

Your app now uses Zustand for state management, which provides:

- ✅ **Granular Re-renders**: Only components using specific state slices re-render
- ✅ **Optimistic Updates**: UI updates instantly while API calls process in background
- ✅ **Better Performance**: No more full app reloads on state changes
- ✅ **DevTools Support**: Inspect state changes in Redux DevTools

## File Structure

```
src/
├── store/
│   └── useStore.js           # Central Zustand store
├── hooks/
│   └── useApi.js             # API integration hooks
└── components/
    └── StoreInitializer.jsx  # Initialize store on app startup
```

## Setup in App.jsx

Wrap your app with StoreInitializer:

```jsx
import StoreInitializer from "./components/StoreInitializer";

function App() {
  return <StoreInitializer>{/* Your existing app content */}</StoreInitializer>;
}
```

## How to Use in Components

### 1. Authentication

**Old way (Context):**

```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const { user, login, logout } = useContext(AuthContext);
```

**New way (Zustand):**

```jsx
import { useAuth } from "../hooks/useApi";

const { user, login, logout, isAuthenticated } = useAuth();
```

### 2. Tasks Management

**Old way:**

```jsx
const authContext = useContext(AuthContext);
const [tasks, setTasks] = useState([]);

useEffect(() => {
  const fetchTasks = async () => {
    const tasksData = await authContext.getUserTasks();
    setTasks(tasksData);
  };
  fetchTasks();
}, []);
```

**New way:**

```jsx
import { useTasks } from "../hooks/useApi";

const {
  tasks, // All tasks
  tasksLoading, // Loading state
  fetchTasks, // Fetch function
  getTaskCounts, // Get task counts by status
  updateTaskStatus, // Update task with optimistic update
} = useTasks();

useEffect(() => {
  fetchTasks(); // Automatically updates Zustand store
}, []);
```

### 3. Employees (Admin)

**Old way:**

```jsx
const [employees, setEmployees] = useState([]);
const employeesData = await authContext.getAllEmployees();
setEmployees(employeesData);
```

**New way:**

```jsx
import { useEmployees } from "../hooks/useApi";

const { employees, employeesLoading, fetchEmployees } = useEmployees();

useEffect(() => {
  fetchEmployees();
}, []);
```

### 4. Direct Store Access (Advanced)

If you need direct access to the store (rarely needed):

```jsx
import useStore from "../store/useStore";

// Subscribe to specific state (component only re-renders when THIS changes)
const tasks = useStore((state) => state.tasks);
const user = useStore((state) => state.user);

// Get computed values
const taskCounts = useStore((state) => state.getTaskCounts());

// Call actions directly
const updateTask = useStore((state) => state.updateTask);
updateTask(taskId, { completed: true });
```

## Migration Checklist

### Components to Update:

- [x] EmployeeDashboard.jsx (DONE)
- [x] TaskCard.jsx (DONE)
- [ ] Login.jsx
- [ ] Register.jsx
- [ ] AdminDashboard.jsx
- [ ] CreatTask.jsx
- [ ] AllTask.jsx
- [ ] TaskList.jsx
- [ ] TaskHistory.jsx
- [ ] Header.jsx

### For Each Component:

1. **Remove Context imports:**

   ```jsx
   // Remove this:
   import { AuthContext } from "../../context/AuthProvider";
   const authContext = useContext(AuthContext);
   ```

2. **Add Zustand hooks:**

   ```jsx
   // Add this:
   import { useAuth, useTasks } from "../../hooks/useApi";
   const { user } = useAuth();
   const { tasks, fetchTasks } = useTasks();
   ```

3. **Remove local state that duplicates store:**

   ```jsx
   // Remove this:
   const [tasks, setTasks] = useState([]);
   ```

4. **Use store data directly:**
   ```jsx
   // tasks comes from useTasks() hook
   // It's already in Zustand store, no need for local state
   ```

## Key Benefits You'll See

### Before (Context):

```jsx
const updateTaskStatus = async (taskId, action) => {
  await api.updateStatus(taskId, action);
  await refreshUserData(); // Re-fetches ALL user data
  // Entire app re-renders
};
```

### After (Zustand):

```jsx
const updateTaskStatus = async (taskId, action) => {
  // UI updates instantly (optimistic)
  updateTask(taskId, { completed: true });

  // API call in background
  await api.updateStatus(taskId, action);

  // Only TaskCard re-renders, not entire app!
};
```

## Performance Comparison

**Context API:**

- User clicks "Complete Task"
- API Call → 500ms
- Re-fetch all user data → 300ms
- **Total wait: 800ms** ❌
- Entire dashboard re-renders

**Zustand with Optimistic Updates:**

- User clicks "Complete Task"
- UI updates instantly → **0ms** ✅
- API call in background → 500ms (user doesn't wait)
- Only TaskCard re-renders

## Debugging

Install Redux DevTools browser extension to inspect Zustand state:

- View current state
- See all state changes
- Time-travel debugging

## Questions?

- Store location: `src/store/useStore.js`
- Hooks location: `src/hooks/useApi.js`
- Example: See updated `EmployeeDashboard.jsx` and `TaskCard.jsx`
