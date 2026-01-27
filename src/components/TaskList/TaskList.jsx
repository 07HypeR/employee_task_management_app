import React, { useEffect } from "react";
import AcceptTask from "./AcceptTask";
import NewTask from "./NewTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";

const TaskList = ({ data }) => {
  useEffect(() => {
    console.log("📋 TaskList received data:", data);
  }, [data]);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            Active Tasks
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Manage your daily assignments
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#111111]/60 backdrop-blur-2xl px-4 py-2 rounded-full border border-emerald-500/10">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Live Updates
          </span>
        </div>
      </div>

      <div
        id="taskList"
        className="h-auto overflow-x-auto flex items-start justify-start w-full pb-8 gap-6 scroll-smooth custom-scrollbar"
      >
        {data.tasks.map((elem, idx) => {
          if (elem.active) {
            return <AcceptTask key={idx} data={elem} />;
          }
          if (elem.newTask) {
            return <NewTask key={idx} data={elem} />;
          }
          if (elem.completed) {
            return <CompleteTask key={idx} data={elem} />;
          }
          if (elem.failed) {
            return <FailedTask key={idx} data={elem} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default TaskList;
