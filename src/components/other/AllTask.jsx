import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const AllTask = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const employeesData = await authContext.getAllEmployees();
      const tasksData = await authContext.getUserTasks();
      const computedEmployees = employeesData.map((emp) => {
        // Find tasks assigned to this employee
        const empTasks = tasksData.filter((task) => {
          const isAssignedToEmp =
            task.assignedTo?._id === emp._id || task.assignedTo === emp._id;
          const isAssignedByAdmin =
            (task.assignedBy?._id || task.assignedBy) === authContext.user?._id;
          return isAssignedToEmp && isAssignedByAdmin;
        });

        return {
          ...emp,
          taskNumbers: {
            newTask: empTasks.filter((t) => t.newTask).length,
            active: empTasks.filter((t) => t.active).length,
            completed: empTasks.filter((t) => t.completed).length,
            failed: empTasks.filter((t) => t.failed).length,
            declined: empTasks.filter((t) => t.declined).length,
          },
        };
      });

      const activeEmployees = computedEmployees.filter(
        (emp) =>
          emp.taskNumbers.newTask > 0 ||
          emp.taskNumbers.active > 0 ||
          emp.taskNumbers.completed > 0 ||
          emp.taskNumbers.failed > 0 ||
          emp.taskNumbers.declined > 0,
      );

      setEmployees(activeEmployees);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 mb-10">
        <div className="bg-[#111111]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
          <div className="text-center text-emerald-500">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="mt-8 mb-10">
        <div className="bg-[#111111]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 shadow-2xl">
          <div className="text-center text-slate-400">
            Assign task to employee to view status
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-10">
      <div className="bg-[#111111]/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Employee Status
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Click an employee to view details on a separate page
            </p>
          </div>
          <div className="hidden xs:flex bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Admin View
            </span>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-6 bg-emerald-600/10 mb-4 py-4 px-6 rounded-2xl border border-emerald-500/10">
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
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">
                Declined
              </h2>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {employees.map((elem, idx) => (
                <div
                  key={elem._id || idx}
                  onClick={() => navigate(`/employee-tasks/${elem._id}`)}
                  className="grid grid-cols-6 bg-black/20 hover:bg-black/40 border border-white/5 hover:border-emerald-500/30 py-4 px-6 rounded-2xl transition-all duration-300 items-center group/row cursor-pointer"
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
                  <span className="text-sm font-bold text-slate-500 text-center tabular-nums">
                    {elem.taskNumbers.declined}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTask;
