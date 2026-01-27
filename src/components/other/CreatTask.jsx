import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";

const CreatTask = () => {
  const authData = useContext(AuthContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const taskToAdd = {
      title: taskTitle,
      date: taskDate,
      assignTo,
      category,
      description: taskDescription,
      active: false,
      newTask: true,
      failed: false,
      completed: false,
    };

    const updatedEmployees = authData.employees.map((elem) => {
      if (assignTo == elem.fname) {
        return {
          ...elem,
          tasks: [...elem.tasks, taskToAdd],
          taskNumbers: {
            ...elem.taskNumbers,
            newTask: elem.taskNumbers.newTask + 1,
          },
        };
      }
      return elem;
    });

    authData.updateEmployees(updatedEmployees);
    setTaskTitle("");
    setTaskDate("");
    setAssignTo("");
    setCategory("");
    setTaskDescription("");
  };

  return (
    <div className="mt-8">
      <div className="bg-[#111111]/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              Create New Task
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Assign work to your team members
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
              Administrator
            </span>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Task Title
              </label>
              <input
                className="w-full h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-6 rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300"
                type="text"
                placeholder="e.g. Design homepage banner"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                  Date
                </label>
                <input
                  className="w-full h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-6 rounded-2xl focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 [color-scheme:dark]"
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
                <input
                  className="w-full h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-6 rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300"
                  type="text"
                  placeholder="Employee Name"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Category
              </label>
              <input
                className="w-full h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-6 rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300"
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
                className="w-full h-[188px] outline-none bg-black/20 border border-emerald-500/10 text-white p-6 rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 resize-none"
                placeholder="Detailed task instructions..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
              />
            </div>
            <button className="mt-8 w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatTask;
