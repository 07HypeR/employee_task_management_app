import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Header from "../components/other/Header";
import AcceptTask from "../components/TaskList/AcceptTask";
import NewTask from "../components/TaskList/NewTask";
import CompleteTask from "../components/TaskList/CompleteTask";
import FailedTask from "../components/TaskList/FailedTask";

const TaskPage = ({ changeUser }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const authData = useContext(AuthContext);

  // Get logged in user from localStorage
  const loggedInUserStr = localStorage.getItem("loggedInUser");
  if (!loggedInUserStr) return null;
  const loggedInUser = JSON.parse(loggedInUserStr);

  if (!loggedInUser || loggedInUser.role !== "employee") {
    navigate("/");
    return null;
  }

  // Find the latest employee data from context to ensure it's up-to-date
  const employeeData = authData.employees?.find(
    (emp) => emp.email === loggedInUser.data.email,
  );

  if (!employeeData) return null;

  const getFilteredTasks = () => {
    switch (type) {
      case "new":
        return employeeData.tasks.filter((t) => t.newTask);
      case "accepted":
        return employeeData.tasks.filter((t) => t.active);
      case "completed":
        return employeeData.tasks.filter((t) => t.completed);
      case "failed":
        return employeeData.tasks.filter((t) => t.failed);
      default:
        return [];
    }
  };

  const tasks = getFilteredTasks();

  const getPageTitle = () => {
    switch (type) {
      case "new":
        return "New Tasks";
      case "accepted":
        return "Accepted Tasks";
      case "completed":
        return "Completed Tasks";
      case "failed":
        return "Failed Tasks";
      default:
        return "Tasks";
    }
  };

  const renderTask = (task, idx) => {
    if (task.active) return <AcceptTask key={idx} data={task} />;
    if (task.newTask) return <NewTask key={idx} data={task} />;
    if (task.completed) return <CompleteTask key={idx} data={task} />;
    if (task.failed) return <FailedTask key={idx} data={task} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={employeeData} changeUser={changeUser} />

        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-slate-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-[#111111]/60 backdrop-blur-2xl p-20 rounded-3xl border border-white/5 text-center">
            <p className="text-slate-500 text-lg">
              No tasks found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task, idx) => (
              <div key={idx} className="w-full">
                {renderTask(task, idx)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
