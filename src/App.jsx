import React, { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { AuthContext } from "./context/AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authData = useContext(AuthContext);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData.role);
      if (userData.role === "employee" && userData.data) {
        setLoggedInUser(userData.data);
      } else if (userData.role === "admin" && userData.data) {
        setLoggedInUser(userData.data);
      }
    }
    setLoading(false);
  }, []);

  // Sync logged-in user with context updates (when tasks are added/updated)
  useEffect(() => {
    if (!authData || !user) return;

    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);

    if (userData.role === "employee" && authData.employees) {
      const updatedEmployee = authData.employees.find(
        (emp) => emp.email === userData.data.email,
      );
      if (updatedEmployee) {
        setLoggedInUser(updatedEmployee);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "employee", data: updatedEmployee }),
        );
      }
    }
  }, [authData?.employees, user]);

  const handleLogin = (email, password) => {
    if (
      authData &&
      authData.admin &&
      authData.admin.find((a) => a.email === email && a.password === password)
    ) {
      const admin = authData.admin.find(
        (a) => a.email === email && a.password === password,
      );
      setUser("admin");
      setLoggedInUser(admin);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ role: "admin", data: admin }),
      );
      return true;
    } else if (authData && authData.employees) {
      const employee = authData.employees.find(
        (e) => e.email === email && e.password === password,
      );
      if (employee) {
        setUser("employee");
        setLoggedInUser(employee);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "employee", data: employee }),
        );
        return true;
      }
    }
    return false;
  };

  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            {!user ? <Login handleLogin={handleLogin} /> : ""}
            {user === "admin" ? (
              <AdminDashboard changeUser={setUser} data={loggedInUser} />
            ) : user == "employee" ? (
              <EmployeeDashboard changeUser={setUser} data={loggedInUser} />
            ) : null}
          </>
        }
      />
      <Route
        path="/tasks/:type"
        element={
          user === "employee" ? (
            <TaskPage changeUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default App;
