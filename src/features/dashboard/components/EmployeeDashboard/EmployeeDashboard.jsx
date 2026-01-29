import React, { useEffect, useMemo, useRef } from "react";
import { Header, TaskStatistics } from "@components/layout";
import { TaskList, TaskHistory } from "@features/tasks";
import { useTasks } from "@hooks/useApi";
import socketService from "@services/socket";

const EmployeeDashboard = ({ data, changeUser }) => {
  const { tasks, tasksLoading, fetchTasks } = useTasks();
  const userId = data?._id;
  const fetchDebounceTimerRef = useRef(null);
  const fetchTasksRef = useRef(fetchTasks);

  useEffect(() => {
    fetchTasksRef.current = fetchTasks;
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasksRef.current();

    const debouncedFetchTasks = () => {
      if (fetchDebounceTimerRef.current) {
        clearTimeout(fetchDebounceTimerRef.current);
      }

      fetchDebounceTimerRef.current = setTimeout(() => {
        fetchTasksRef.current();
      }, 300);
    };

    const handleTaskCreated = (task) => {
      if (userId && task.assignedTo?._id === userId) {
        debouncedFetchTasks();
      }
    };

    const handleTaskUpdated = (task) => {
      if (userId && task.assignedTo?._id === userId) {
        debouncedFetchTasks();
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);

    return () => {
      if (fetchDebounceTimerRef.current) {
        clearTimeout(fetchDebounceTimerRef.current);
      }
      socketService.off("taskCreated", handleTaskCreated);
      socketService.off("taskUpdated", handleTaskUpdated);
    };
  }, [userId]);

  const taskCounts = useMemo(() => {
    return {
      newTask: tasks.filter((t) => t.newTask).length,
      active: tasks.filter((t) => t.active).length,
      completed: tasks.filter((t) => t.completed).length,
      failed: tasks.filter((t) => t.failed).length,
      declined: tasks.filter((t) => t.declined).length,
    };
  }, [tasks]);

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
        <div className="text-emerald-500 text-xl font-bold animate-pulse">
          Loading Tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
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
