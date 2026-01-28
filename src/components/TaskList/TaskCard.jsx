import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const TaskCard = ({ task, onUpdate }) => {
  const { updateTaskStatus } = useContext(AuthContext);

  const handleStatusUpdate = async (action) => {
    try {
      const result = await updateTaskStatus(task._id, action);
      if (result.success && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusInfo = () => {
    if (task.newTask)
      return {
        label: "New",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20 shadow-blue-500/5",
      };
    if (task.active)
      return {
        label: "Active",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20 shadow-amber-500/5",
      };
    if (task.completed)
      return {
        label: "Completed",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20 shadow-emerald-500/5",
      };
    if (task.failed)
      return {
        label: "Failed",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20 shadow-rose-500/5",
      };
    if (task.declined)
      return {
        label: "Declined",
        color: "text-slate-400",
        bg: "bg-white/5",
        border: "border-white/10",
      };
    return {
      label: "Unknown",
      color: "text-gray-500",
      bg: "bg-white/5",
      border: "border-white/5",
    };
  };

  const status = getStatusInfo();

  return (
    <div
      className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col h-full bg-[#1c1c1c]/80 backdrop-blur-xl hover:bg-[#1c1c1c] ${status.border} shadow-lg`}
    >
      <div className="flex justify-between items-center mb-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}
        >
          {task.category || "General"}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
            {status.label} Status
          </span>
          <span className="text-gray-600 text-[11px] font-medium">
            {task.date}
          </span>
        </div>
      </div>

      <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">
        {task.title}
      </h4>
      <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
        {task.description}
      </p>

      <div className="flex flex-col gap-4">
        {task.assignedBy && (
          <div className="flex items-center gap-2 pt-4 border-t border-white/5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${status.border} ${status.bg}`}
            >
              <span className={`text-[10px] font-black ${status.color}`}>
                {task.assignedBy.fname[0]}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              By{" "}
              <span className="text-gray-300 font-bold">
                {task.assignedBy.fname} {task.assignedBy.lname}
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {task.newTask && (
            <>
              <button
                onClick={() => handleStatusUpdate("accept")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate("decline")}
                className="px-4 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold py-2.5 rounded-xl border border-white/5 transition-all cursor-pointer"
              >
                Decline
              </button>
            </>
          )}
          {task.active && (
            <>
              <button
                onClick={() => handleStatusUpdate("complete")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={() => handleStatusUpdate("fail")}
                className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold py-2.5 rounded-xl border border-rose-500/10 transition-all cursor-pointer"
              >
                Failed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
