import React, { useState, useEffect } from "react";
import { useEmployees, useTasks } from "@hooks/useApi";

const CreatTask = () => {
  const { employees, fetchEmployees } = useEmployees();
  const { createTask } = useTasks();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (message.text && message.type === "success") {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        category,
        assignedTo: assignTo,
      };

      const result = await createTask(taskData);

      if (result.success) {
        setMessage({ type: "success", text: "Task created successfully!" });
        // Clear form
        setTaskTitle("");
        setTaskDate("");
        setAssignTo("");
        setCategory("");
        setTaskDescription("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create task",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating the task",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-[#111111]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Create New Task
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Assign work to your team members
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              Administrator
            </span>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl ${message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-rose-500/10 border border-rose-500/30"}`}
          >
            <p
              className={`text-xs sm:text-sm font-semibold ${message.type === "success" ? "text-emerald-400" : "text-rose-400"}`}
            >
              {message.text}
            </p>
          </div>
        )}

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Task Title
              </label>
              <input
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                type="text"
                placeholder="e.g. Design homepage banner"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                  Date
                </label>
                <input
                  className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 [color-scheme:dark] text-sm sm:text-base"
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                  Assign To
                </label>
                <select
                  className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base appearance-none cursor-pointer"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  required
                >
                  <option value="" className="bg-[#1c1c1c]">
                    Select Employee
                  </option>
                  {employees.map((employee) => (
                    <option
                      key={employee._id}
                      value={employee._id}
                      className="bg-[#1c1c1c]"
                    >
                      {employee.fname} {employee.lname}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Category
              </label>
              <input
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                type="text"
                placeholder="Design, Dev, etc..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="space-y-2 flex-grow">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Description
              </label>
              <textarea
                className="w-full h-[150px] sm:h-[188px] outline-none bg-black/20 border border-emerald-500/10 text-white p-5 sm:p-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 resize-none text-sm sm:text-base"
                placeholder="Detailed task instructions..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="mt-6 sm:mt-8 w-full h-12 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer text-sm sm:text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Task...</span>
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatTask;
