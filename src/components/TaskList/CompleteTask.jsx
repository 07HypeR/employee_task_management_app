import React from "react";

const CompleteTask = ({ data }) => {
  return (
    <div className="shrink-0 w-[320px] p-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 bg-emerald-500/10 hover:bg-emerald-500/[0.15] transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-emerald-500/20 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          {data.category}
        </span>
        <span className="text-slate-500 text-xs font-medium">{data.date}</span>
      </div>
      <h2 className="text-xl font-bold mb-3 leading-tight text-emerald-100">
        {data.title}
      </h2>
      <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
        {data.description}
      </p>
      <div className="mt-auto">
        <div className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-500 font-bold py-2.5 rounded-xl border border-emerald-500/30">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Completed
        </div>
      </div>
    </div>
  );
};

export default CompleteTask;
