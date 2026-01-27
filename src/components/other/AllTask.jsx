import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AllTask = () => {
  const authData = useContext(AuthContext);

  if (!authData || !authData.employees) {
    return null;
  }

  return (
    <div className="mt-8 mb-10">
      <div className="bg-[#111111]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Employee Status
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Real-time task distribution overview
            </p>
          </div>
          <div className="hidden xs:flex bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Global Sync
            </span>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-5 bg-emerald-600/10 mb-4 py-4 px-6 rounded-2xl border border-emerald-500/10">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                Employee
              </h2>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">
                New
              </h2>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">
                Active
              </h2>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">
                Completed
              </h2>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">
                Failed
              </h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {authData.employees.map(function (elem, idx) {
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-5 bg-black/20 hover:bg-black/40 border border-white/5 hover:border-emerald-500/30 py-4 px-6 rounded-2xl transition-all duration-300 items-center group/row"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/row:bg-emerald-500/20 transition-all shrink-0">
                        <span className="text-xs font-bold text-emerald-500">
                          {elem.fname[0]}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-200 truncate pr-2">
                        {elem.fname} {elem.lname}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-400 text-center tabular-nums">
                      {elem.taskNumbers.newTask}
                    </span>
                    <span className="text-sm font-bold text-amber-500 text-center tabular-nums">
                      {elem.taskNumbers.active}
                    </span>
                    <span className="text-sm font-bold text-emerald-500 text-center tabular-nums">
                      {elem.taskNumbers.completed}
                    </span>
                    <span className="text-sm font-bold text-rose-500 text-center tabular-nums">
                      {elem.taskNumbers.failed}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTask;
