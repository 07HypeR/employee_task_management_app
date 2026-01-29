import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks, useAuth } from "@hooks/useApi";
import { Header } from "@components/layout";
import { TaskCard } from "@features/tasks";
import socketService from "@services/socket";

const TaskPage = ({ changeUser }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { tasks: allTasks, tasksLoading, fetchTasks } = useTasks();
  const { user } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

    // Listen for real-time task updates
    const handleTaskCreated = (task) => {
      console.log("🆕 New task created:", task);
      // Check if this task is assigned to current user
      if (user && task.assignedTo?._id === user._id) {
        fetchTasks(); // Refresh tasks
      }
    };

    const handleTaskUpdated = (task) => {
      console.log("📝 Task updated:", task);
      // Check if this task belongs to current user
      if (
        user &&
        (task.assignedTo?._id === user._id || task.assignedBy?._id === user._id)
      ) {
        fetchTasks(); // Refresh tasks
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);

    // Cleanup listeners on unmount
    return () => {
      socketService.off("taskCreated", handleTaskCreated);
      socketService.off("taskUpdated", handleTaskUpdated);
    };
  }, [user]);

  useEffect(() => {
    setFilteredTasks(getFilteredTasks(allTasks));
  }, [type, allTasks]);

  const getFilteredTasks = (allTasks) => {
    switch (type) {
      case "new":
        return allTasks.filter((t) => t.newTask);
      case "accepted":
        return allTasks.filter((t) => t.active);
      case "completed":
        return allTasks.filter((t) => t.completed);
      case "failed":
        return allTasks.filter((t) => t.failed);
      case "declined":
        return allTasks.filter((t) => t.declined);
      default:
        return [];
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case "new":
        return "New Tasks";
      case "accepted":
        return "Accepted Tasks";
      case "completed":
        return "Completed Tasks";
      case "failed":
        return "Failed Tasks";
      case "declined":
        return "Declined Tasks";
      default:
        return "Tasks";
    }
  };

  if (tasksLoading && filteredTasks.length === 0) {
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
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={user} changeUser={changeUser} />

        <div className="mt-8 mb-12 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="group p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Viewing your categorized assignments
              </p>
            </div>
          </div>

          <div className="sm:ml-auto w-fit flex items-center gap-3 bg-emerald-500/10 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-emerald-500/10 shadow-lg shadow-emerald-500/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500 font-black uppercase tracking-widest">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "Assignment" : "Assignments"}
            </span>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-[#111111]/40 backdrop-blur-2xl py-24 rounded-[3rem] border border-white/5 text-center shadow-2xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <span className="text-4xl opacity-40">📬</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              Category Empty
            </h3>
            <p className="text-slate-500 max-w-md mx-auto px-6">
              {type === "new" &&
                "You don't have any new tasks assigned at the moment."}
              {type === "accepted" && "No tasks are currently in progress."}
              {type === "completed" && "You haven't finished any tasks yet."}
              {type === "failed" && "Great job! You have no failed tasks."}
              {type === "declined" &&
                "You haven't declined any incoming requests."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
