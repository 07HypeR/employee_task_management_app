import React, { useEffect, useMemo } from "react";
import Header from "../other/Header";
import TasklistNumber from "../other/TasklistNumber";
import TaskList from "../TaskList/TaskList";
import TaskHistory from "../TaskList/TaskHistory";
import { useTasks } from "../../hooks/useApi";

const EmployeeDashboard = ({ data, changeUser }) => {
  const { tasks, tasksLoading, fetchTasks } = useTasks();

  useEffect(() => {
    // Fetch tasks only once on mount
    fetchTasks();
  }, []);

  // Calculate task counts only when tasks array changes
  const taskCounts = useMemo(() => {
    return {
      newTask: tasks.filter((t) => t.newTask).length,
      active: tasks.filter((t) => t.active).length,
      completed: tasks.filter((t) => t.completed).length,
      failed: tasks.filter((t) => t.failed).length,
      declined: tasks.filter((t) => t.declined).length,
    };
  }, [tasks]);

  // Prepare data object for child components
  const dashboardData = useMemo(
    () => ({
      ...data,
      tasks: tasks,
      taskNumbers: taskCounts,
    }),
    [data, tasks, taskCounts],
  );

  if (tasksLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-emerald-500 text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header data={dashboardData} changeUser={changeUser} />
        <TasklistNumber data={dashboardData} />
        <TaskList data={dashboardData} />
        <TaskHistory data={dashboardData} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
