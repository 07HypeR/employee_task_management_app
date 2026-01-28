import React from "react";

const Header = ({ data, changeUser }) => {
  const logOutUser = () => {
    localStorage.setItem("loggedInUser", "");
    changeUser("");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-[#111111]/60 backdrop-blur-2xl rounded-[2rem] sm:rounded-3xl mb-8 sm:mb-10 border border-emerald-500/10 hover:border-emerald-500/20 hover:bg-[#111111]/80 transition-all duration-300 gap-6 sm:gap-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">
          Task Management
        </h1>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          Hello,{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            {data?.fname || "Employee"}
          </span>{" "}
          👋
        </h2>
      </div>
      <button
        onClick={logOutUser}
        className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-bold transition-all duration-300 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Header;
