import React from "react";
import Header from "../other/Header";
import CreatTask from "../other/CreatTask";
import AllTask from "../other/AllTask";

const AdminDashboard = ({ data, changeUser }) => {
  return (
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-10 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Header data={data} changeUser={changeUser} />
        <CreatTask />
        <AllTask />
      </div>
    </div>
  );
};

export default AdminDashboard;
