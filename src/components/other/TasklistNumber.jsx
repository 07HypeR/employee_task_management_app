import React from "react";
import { Link } from "react-router-dom";

const TasklistNumber = ({ data }) => {
  const stats = [
    {
      label: "New Tasks",
      count: data.taskNumbers.newTask,
      gradient: "from-emerald-400 to-emerald-600",
      path: "/tasks/new",
    },
    {
      label: "Completed",
      count: data.taskNumbers.completed,
      gradient: "from-emerald-500 to-teal-500",
      path: "/tasks/completed",
    },
    {
      label: "Accepted",
      count: data.taskNumbers.active,
      gradient: "from-amber-400 to-orange-500",
      path: "/tasks/accepted",
    },
    {
      label: "Failed",
      count: data.taskNumbers.failed,
      gradient: "from-rose-500 to-red-600",
      path: "/tasks/failed",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
      {stats.map((stat, idx) => (
        <Link
          key={idx}
          to={stat.path}
          className="bg-[#111111]/60 backdrop-blur-2xl p-6 relative overflow-hidden group rounded-3xl border border-emerald-500/10 hover:border-emerald-500/20 hover:bg-[#111111]/80 transition-all duration-300 block"
        >
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.08] rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
          />
          <h2 className="text-3xl font-bold mb-1">{stat.count}</h2>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {stat.label}
          </h3>
        </Link>
      ))}
    </div>
  );
};

export default TasklistNumber;
