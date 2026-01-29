import { useEffect } from "react";
import { LoginForm, RegisterForm } from "@features/auth";
import { EmployeeDashboard, AdminDashboard } from "@features/dashboard";
import { useAuth } from "@hooks/useApi";
import { useSocket } from "@hooks/useSocket";
import SocketStatus from "@components/SocketStatus";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import AdminEmployeeTasksPage from "./pages/AdminEmployeeTasksPage";

const App = () => {
  const { user, authLoading, login, logout, initAuth } = useAuth();

  // Initialize WebSocket connection when user is authenticated
  useSocket(user);

  useEffect(() => {
    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    return await login(email, password);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1c1c1c]">
        <div className="text-emerald-500 text-xl">Loading...</div>
      </div>
    );
  }

  const userRole = user?.role;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!user ? <LoginForm handleLogin={handleLogin} /> : ""}
              {userRole === "admin" ? (
                <AdminDashboard changeUser={logout} data={user} />
              ) : userRole === "employee" ? (
                <EmployeeDashboard changeUser={logout} data={user} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#1c1c1c] text-white">
                  <h1 className="text-2xl font-bold mb-4">Unknown Role</h1>
                  <p className="mb-4">Role detected: {String(userRole)}</p>
                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="px-6 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    Logout & Reset
                  </button>
                </div>
              )}
            </>
          }
        />
        <Route
          path="/tasks/:type"
          element={
            userRole === "employee" ? (
              <TaskPage changeUser={logout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/employee-tasks/:id"
          element={
            userRole === "admin" ? (
              <AdminEmployeeTasksPage changeUser={logout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>

      {/* WebSocket Connection Status Indicator */}
      {user && <SocketStatus />}
    </>
  );
};

export default App;
