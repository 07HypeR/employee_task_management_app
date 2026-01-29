import React, { useEffect, useMemo } from "react";
import { Header, TaskStatistics } from "@components/layout";
import { TaskList, TaskHistory } from "@features/tasks";
import { useTasks } from "@hooks/useApi";
import socketService from "@services/socket";

const EmployeeDashboard = ({ data, changeUser }) => {
  const { tasks, tasksLoading, fetchTasks } = useTasks();
  const userId = data?._id; // Extract stable user ID

  useEffect(() => {
    console.log(
      "🏠 EmployeeDashboard: Setting up socket listeners for user:",
      userId,
    );

    // Fetch tasks only once on mount
    fetchTasks();

    // Listen for real-time task updates
    const handleTaskCreated = (task) => {
      console.log("🆕 EmployeeDashboard: New task created:", task);
      console.log(
        "🔍 Checking if task is for user:",
        userId,
        "Task assigned to:",
        task.assignedTo?._id,
      );

      // Check if this task is assigned to current user
      if (userId && task.assignedTo?._id === userId) {
        console.log("✅ Task is for this user, refreshing tasks...");
        fetchTasks(); // Refresh tasks
      } else {
        console.log("⏭️ Task not for this user, skipping refresh");
      }
    };

    const handleTaskUpdated = (task) => {
      console.log("📝 EmployeeDashboard: Task updated:", task);
      console.log(
        "🔍 Checking if task belongs to user:",
        userId,
        "Task assigned to:",
        task.assignedTo?._id,
      );

      // Check if this task belongs to current user
      if (userId && task.assignedTo?._id === userId) {
        console.log("✅ Task belongs to this user, refreshing tasks...");
        fetchTasks(); // Refresh tasks
      } else {
        console.log("⏭️ Task not for this user, skipping refresh");
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);

    // Cleanup listeners on unmount
    return () => {
      console.log("🧹 EmployeeDashboard: Cleaning up socket listeners");
      socketService.off("taskCreated", handleTaskCreated);
      socketService.off("taskUpdated", handleTaskUpdated);
    };
  }, [userId, fetchTasks]); // Stable dependencies

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
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={dashboardData} changeUser={changeUser} />
        <TaskStatistics data={dashboardData} />
        <TaskList data={dashboardData} />
        <TaskHistory data={dashboardData} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
