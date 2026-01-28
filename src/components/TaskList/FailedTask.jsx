import React from "react";

const FailedTask = ({ data }) => {
  return (
    <div className="h-full p-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 bg-rose-500/10 hover:bg-rose-500/[0.15] transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-rose-500/20 text-rose-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-rose-500/20">
          {data.category}
        </span>
        <span className="text-slate-500 text-xs font-medium">{data.date}</span>
      </div>
      <h2 className="text-xl font-bold mb-3 leading-tight text-rose-100">
        {data.title}
      </h2>
      <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
        {data.description}
      </p>

      {/* Assigned By Information */}
      {data.assignedBy && (
        <div className="mb-4 pb-4 border-b border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
            Assigned By
          </p>
          <p className="text-sm text-rose-400 font-semibold">
            {data.assignedBy.fname} {data.assignedBy.lname}
          </p>
        </div>
      )}

      <div className="mt-auto">
        <div className="w-full flex items-center justify-center gap-2 bg-rose-500/20 text-rose-500 font-bold py-2.5 rounded-xl border border-rose-500/30">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Failed
        </div>
      </div>
    </div>
  );
};

export default FailedTask;
