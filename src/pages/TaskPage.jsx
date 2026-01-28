import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Header from "../components/other/Header";
import AcceptTask from "../components/TaskList/AcceptTask";
import NewTask from "../components/TaskList/NewTask";
import CompleteTask from "../components/TaskList/CompleteTask";
import FailedTask from "../components/TaskList/FailedTask";
import DeclineTask from "../components/TaskList/DeclineTask";

const TaskPage = ({ changeUser }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [type]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await authContext.getUserTasks();
      const filtered = getFilteredTasks(allTasks);
      setTasks(filtered);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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

  const renderTask = (task, idx) => {
    const taskProps = {
      data: task,
      onUpdate: fetchTasks,
    };

    if (task.active) return <AcceptTask key={task._id || idx} {...taskProps} />;
    if (task.newTask) return <NewTask key={task._id || idx} {...taskProps} />;
    if (task.completed)
      return <CompleteTask key={task._id || idx} data={task} />;
    if (task.failed) return <FailedTask key={task._id || idx} data={task} />;
    if (task.declined) return <DeclineTask key={task._id || idx} data={task} />;
    return null;
  };

  if (!authContext.user || authContext.user.role !== "employee") {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-emerald-500 text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={authContext.user} changeUser={changeUser} />

        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-slate-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <div className="ml-auto flex items-center gap-3 bg-emerald-600/10 backdrop-blur-2xl px-4 py-2 rounded-full border border-emerald-500/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-[#111111]/60 backdrop-blur-2xl p-20 rounded-3xl border border-white/5 text-center">
            <div className="mb-4 text-6xl opacity-20">📭</div>
            <p className="text-slate-500 text-lg mb-2">
              No tasks found in this category.
            </p>
            <p className="text-slate-600 text-sm">
              {type === "new" &&
                "You don't have any new tasks assigned to you."}
              {type === "accepted" && "You haven't accepted any tasks yet."}
              {type === "completed" && "You haven't completed any tasks yet."}
              {type === "failed" && "You don't have any failed tasks."}
              {type === "declined" && "You haven't declined any tasks."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task, idx) => (
              <div key={task._id || idx} className="w-full">
                {renderTask(task, idx)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
