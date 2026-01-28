import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ task }) => {
  if (task.completed) {
    return (
      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
        Completed
      </span>
    );
  }
  if (task.failed) {
    return (
      <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
        Failed
      </span>
    );
  }
  if (task.declined) {
    return (
      <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
        Declined
      </span>
    );
  }
  if (task.active) {
    return (
      <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
        Active
      </span>
    );
  }
  return (
    <span className="bg-blue-400/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-400/20">
      New Task
    </span>
  );
};

const TaskDetailsModal = ({ task, onClose, onNavigate }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-default"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1c1c1c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 inline-block">
                {task.category}
              </span>
              <h3 className="text-2xl font-bold text-white leading-tight">
                {task.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-gray-400 hover:text-white cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                  Assigned To
                </p>
                <div
                  onClick={onNavigate}
                  className="text-emerald-400 text-sm font-bold hover:underline cursor-pointer flex flex-col"
                >
                  <span>
                    {task.assignedTo?.fname} {task.assignedTo?.lname}
                  </span>
                  <span className="text-[9px] text-gray-600">
                    View Employee Tasks →
                  </span>
                </div>
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
                  Status
                </p>
                <StatusBadge task={task} />
              </div>
              <p className="text-[10px] text-gray-600 font-medium italic">
                Created on {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={onNavigate}
              className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
            >
              Go to Employee Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllTask = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("All");

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "New Task", value: "newTask" },
    { label: "Active", value: "active" },
    { label: "Declined", value: "declined" },
    { label: "Failed", value: "failed" },
    { label: "Completed", value: "completed" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksData = await authContext.getUserTasks();
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const goToEmployeeTasks = (task) => {
    if (!task) return;
    const empId = task.assignedTo?._id || task.assignedTo;
    navigate(`/employee-tasks/${empId}`);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task[filter] === true;
  });

  if (loading) {
    return (
      <div className="mt-8 mb-10">
        <div className="bg-[#262626] rounded-2xl border border-white/5 shadow-xl p-8 text-center text-emerald-500 font-medium">
          Loading Registry...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 mb-10">
        <div className="bg-[#262626] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-bold text-white whitespace-nowrap">
              Task Registry
            </h3>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all cursor-pointer ${
                    filter === option.value
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1c1c]/50 text-gray-400 text-[10px] tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Assigned to</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500 font-medium"
                    >
                      {filter === "All"
                        ? "No tasks assigned yet."
                        : `No tasks found for "${filterOptions.find((o) => o.value === filter).label}" status.`}
                    </td>
                  </tr>
                ) : (
                  [...filteredTasks]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .map((task) => (
                      <tr
                        key={task._id}
                        onClick={() => handleTaskClick(task)}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div
                            className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[140px] sm:max-w-[250px]"
                            title={task.title}
                          >
                            {task.title}
                          </div>
                          <div className="text-[11px] text-gray-500 line-clamp-1 font-medium mt-0.5 max-w-[200px]">
                            {task.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-slate-300 text-[13px] font-bold tracking-wider">
                                {task.assignedTo?.fname}{" "}
                                {task.assignedTo?.lname}
                              </span>
                              <span className="text-[9px] text-gray-500 font-bold tracking-tighter line-clamp-1">
                                {task.assignedTo?.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            <svg
                              className="w-3.5 h-3.5 opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-xs font-bold font-mono tracking-tighter">
                              {task.date}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge task={task} />
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onNavigate={() => goToEmployeeTasks(selectedTask)}
      />
    </>
  );
};

export default AllTask;
