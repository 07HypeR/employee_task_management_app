import React, { useState, useEffect, useContext } from "react";
import Header from "../other/Header";
import TasklistNumber from "../other/TasklistNumber";
import TaskList from "../TaskList/TaskList";
import { AuthContext } from "../../context/AuthProvider";

const EmployeeDashboard = ({ data, changeUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await authContext.getUserTasks();
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Calculate counts dynamically from tasks to ensure sync
  const taskNumbers = {
    newTask: tasks.filter((t) => t.newTask).length,
    active: tasks.filter((t) => t.active).length,
    completed: tasks.filter((t) => t.completed).length,
    failed: tasks.filter((t) => t.failed).length,
    declined: tasks.filter((t) => t.declined).length,
  };

  // Prepare data object for child components
  const dashboardData = {
    ...data,
    tasks: tasks,
    taskNumbers: taskNumbers,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-emerald-500 text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={dashboardData} changeUser={changeUser} />
        <TasklistNumber data={dashboardData} />
        <TaskList data={dashboardData} onTaskUpdate={fetchTasks} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
