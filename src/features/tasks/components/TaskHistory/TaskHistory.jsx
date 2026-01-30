import React, { useState } from "react";

const HistoryStatus = ({ task }) => {
  if (task.completed) {
    return (
      <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
        Completed
      </span>
    );
  }
  if (task.failed) {
    return (
      <span className="text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
        Failed
      </span>
    );
  }
  if (task.declined) {
    return (
      <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
        Declined
      </span>
    );
  }
  return null;
};

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    role="img"
    aria-label="Calendar icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-[#1c1c1c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 inline-block">
                {task.category}
              </span>
              <h3
                id="task-details-title"
                className="text-2xl font-bold text-white leading-tight"
              >
                {task.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-gray-400 hover:text-white cursor-pointer"
              aria-label="Close task details"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                Description
              </p>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                  Assigned By
                </p>
                <p className="text-white text-sm font-bold">
                  {task.assignedBy?.fname} {task.assignedBy?.lname}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                  Deadline Date
                </p>
                <p className="text-white text-sm font-mono font-bold tracking-tighter">
                  {task.date}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                  Task Outcome
                </p>
                <HistoryStatus task={task} />
              </div>
              <p className="text-[10px] text-gray-600 font-medium italic">
                Recorded on {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskHistory = ({ data }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const tasks = data?.tasks || [];

  const history = tasks.filter(
    (task) => task.completed || task.failed || task.declined,
  );

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const visibleHistory = sortedHistory.slice(0, visibleCount);
  const hasMore = visibleCount < sortedHistory.length;
  const isFullyExpanded =
    visibleCount >= sortedHistory.length && sortedHistory.length > 5;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  return (
    <>
      <section aria-labelledby="task-history-heading" className="pb-12 ">
        <div className="flex items-center gap-3 mb-6">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-400 border border-white/5"
          >
            <CalendarIcon />
          </div>
          <div>
            <h3
              id="task-history-heading"
              className="text-xl font-bold text-white leading-tight"
            >
              Archived & Completed
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Your recent task history ({sortedHistory.length} total)
            </p>
          </div>
        </div>

        <div className="bg-[#262626] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1c1c1c]/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Assigned by</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4 text-right">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-400 italic font-medium"
                    >
                      No history recorded yet.
                    </td>
                  </tr>
                ) : (
                  visibleHistory.map((task, idx) => (
                    <tr
                      key={task._id || idx}
                      onClick={() => setSelectedTask(task)}
                      className="text-sm hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedTask(task);
                        }
                      }}
                      aria-label={`View details for task: ${task.title}`}
                    >
                      <td className="px-6 py-4">
                        <div
                          className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[140px] sm:max-w-[250px]"
                          title={task.title}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-gray-400 line-clamp-1 font-medium mt-0.5 max-w-[200px]">
                          {task.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-gray-300 font-bold text-xs tracking-wider truncate max-w-[120px]"
                          title={`${task.assignedBy?.fname} ${task.assignedBy?.lname}`}
                        >
                          {task.assignedBy?.fname} {task.assignedBy?.lname}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <HistoryStatus task={task} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold font-mono text-gray-400 tracking-tighter">
                          {task.date}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="px-6 py-4 bg-[#1c1c1c]/30 border-t border-white/5 flex justify-center">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 font-bold text-sm rounded-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
                aria-label={`Show more history, ${sortedHistory.length - visibleCount} remaining`}
              >
                <span>Show More</span>
                <span className="text-xs text-emerald-400">
                  ({sortedHistory.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}

          {isFullyExpanded && (
            <div className="px-6 py-4 bg-[#1c1c1c]/30 border-t border-white/5 flex justify-center">
              <button
                onClick={handleCollapse}
                className="px-6 py-3 bg-gray-600/10 hover:bg-gray-600/20 text-gray-400 hover:text-gray-300 font-bold text-sm rounded-xl border border-gray-500/20 hover:border-gray-500/30 transition-all active:scale-95 flex items-center gap-2"
                aria-label="Collapse history list"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>Collapse</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};

export default TaskHistory;
