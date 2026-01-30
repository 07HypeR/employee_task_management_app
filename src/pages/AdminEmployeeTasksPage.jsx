import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks, useEmployees, useAuth } from "@hooks/useApi";
import { Header } from "@components/layout";

const TaskCard = ({ data }) => {
  const getStatusInfo = (task) => {
    if (task.completed)
      return {
        text: "Completed",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        trackingText: "Task Completed",
        dotColor: "bg-emerald-500",
      };
    if (task.failed)
      return {
        text: "Failed",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        trackingText: "Task Failed",
        dotColor: "bg-rose-500",
      };
    if (task.declined)
      return {
        text: "Declined",
        color: "text-slate-400 bg-white/5 border-white/10",
        trackingText: "Task Declined",
        dotColor: "bg-rose-500/50",
      };
    if (task.active)
      return {
        text: "Active",
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        trackingText: "Task Accepted",
        dotColor: "bg-amber-500",
      };
    if (task.newTask)
      return {
        text: "New Task",
        color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        trackingText: "Awaiting Acceptance",
        dotColor: "bg-blue-400",
      };
    return {
      text: "Unknown",
      color: "text-slate-400 bg-white/5 border-white/10",
      trackingText: "Status Unknown",
      dotColor: "bg-slate-500",
    };
  };

  const status = getStatusInfo(data);

  return (
    <div className="h-full p-6 bg-[#111111]/60 backdrop-blur-2xl rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 group shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <span
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.color}`}
        >
          {status.text}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          {data.category}
        </span>
      </div>
      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
        {data.title}
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4 font-medium">
        {data.description}
      </p>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <svg
            className="w-4 h-4"
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
            {data.date}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
            {status.trackingText}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminEmployeeTasks = ({ changeUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks: allTasks, fetchTasks } = useTasks();
  const { employees, fetchEmployees } = useEmployees();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchEmployees();
        await fetchTasks();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const emp = employees.find((e) => e._id === id);
      setEmployee(emp);
    }
  }, [employees, id]);

  useEffect(() => {
    if (allTasks.length > 0) {
      const filtered = allTasks.filter((task) => {
        const isAssignedToEmp =
          task.assignedTo?._id === id || task.assignedTo === id;
        return isAssignedToEmp;
      });
      setFilteredTasks(filtered);
    }
  }, [allTasks, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-emerald-500 text-xl font-bold">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={user} changeUser={changeUser} />

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="group p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-none">
                {employee ? `${employee.fname} ${employee.lname}` : "Employee"}
                's Tasks
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Detailed view of all tasks assigned by you
              </p>
            </div>
          </div>

          <div className="px-4 py-2 w-fit bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-center font-black text-emerald-500 uppercase tracking-widest">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-[#111111]/60 backdrop-blur-2xl p-20 rounded-[2.5rem] border border-white/5 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-emerald-500/10">
              📭
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Tasks Found
            </h3>
            <p className="text-slate-500 font-medium tracking-tight">
              You haven't assigned any tasks to this employee yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map((task, idx) => (
              <TaskCard key={task._id || idx} data={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployeeTasks;
