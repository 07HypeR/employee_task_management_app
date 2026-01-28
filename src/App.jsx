import React from "react";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { AuthContext } from "./context/AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import AdminEmployeeTasks from "./pages/AdminEmployeeTasks";

const App = () => {
  const authContext = React.useContext(AuthContext);

  const handleLogin = async (email, password) => {
    return await authContext.login(email, password);
  };

  if (authContext.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1c1c1c]">
        <div className="text-emerald-500 text-xl">Loading...</div>
      </div>
    );
  }

  const user = authContext.user;
  const userRole = user?.role;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {!user ? <Login handleLogin={handleLogin} /> : ""}
            {userRole === "admin" ? (
              <AdminDashboard changeUser={authContext.logout} data={user} />
            ) : userRole === "employee" ? (
              <EmployeeDashboard changeUser={authContext.logout} data={user} />
            ) : null}
          </>
        }
      />
      <Route
        path="/tasks/:type"
        element={
          userRole === "employee" ? (
            <TaskPage changeUser={authContext.logout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/employee-tasks/:id"
        element={
          userRole === "admin" ? (
            <AdminEmployeeTasks changeUser={authContext.logout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
