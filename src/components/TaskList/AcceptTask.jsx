import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AcceptTask = ({ data }) => {
  const { updateTaskStatus } = useContext(AuthContext);

  // Get logged in user email to identify who owns the task
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userEmail = loggedInUser?.data.email;

  const handleComplete = () => {
    if (userEmail) {
      updateTaskStatus(userEmail, data.title, "completed");
    }
  };

  const handleFailed = () => {
    if (userEmail) {
      updateTaskStatus(userEmail, data.title, "failed");
    }
  };

  return (
    <div className="h-full p-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 bg-amber-500/10 hover:bg-amber-500/[0.15] transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
          {data.category}
        </span>
        <span className="text-slate-500 text-xs font-medium">{data.date}</span>
      </div>
      <h2 className="text-xl font-bold mb-3 leading-tight">{data.title}</h2>
      <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
        {data.description}
      </p>
      <div className="mt-auto flex gap-3">
        <button
          onClick={handleComplete}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
        >
          Complete
        </button>
        <button
          onClick={handleFailed}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-300 shadow-lg shadow-rose-600/20"
        >
          Failed
        </button>
      </div>
    </div>
  );
};

export default AcceptTask;
