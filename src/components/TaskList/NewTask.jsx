import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const NewTask = ({ data, onUpdate }) => {
  const { updateTaskStatus } = useContext(AuthContext);

  const handleAccept = async () => {
    try {
      const result = await updateTaskStatus(data._id, "accept");
      if (result.success && onUpdate) {
        onUpdate(); // Refresh tasks
      }
    } catch (error) {}
  };

  const handleDecline = async () => {
    try {
      const result = await updateTaskStatus(data._id, "decline");
      if (result.success && onUpdate) {
        onUpdate(); // Refresh tasks
      }
    } catch (error) {}
  };

  return (
    <div className="h-full p-6 bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          {data.category}
        </span>
        <span className="text-slate-500 text-xs font-medium">{data.date}</span>
      </div>
      <h2 className="text-xl font-bold mb-3 leading-tight">{data.title}</h2>
      <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
        {data.description}
      </p>

      {/* Assigned By Information */}
      {data.assignedBy && (
        <div className="mb-4 pb-4 border-b border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
            Assigned By
          </p>
          <p className="text-sm text-emerald-400 font-semibold">
            {data.assignedBy.fname} {data.assignedBy.lname}
          </p>
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <button
          onClick={handleAccept}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="px-4 bg-[#1c1c1c] hover:bg-[#252525] text-slate-300 font-semibold py-2.5 rounded-xl transition-colors duration-300 border border-white/5"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default NewTask;
