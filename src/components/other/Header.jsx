import React from "react";

const Header = ({ data, changeUser }) => {
  const logOutUser = () => {
    localStorage.setItem("loggedInUser", "");
    changeUser("");
  };

  return (
    <div className="flex items-center justify-between p-8 bg-[#111111]/60 backdrop-blur-2xl rounded-3xl mb-10 border border-emerald-500/10 hover:border-emerald-500/20 hover:bg-[#111111]/80 transition-all duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">
          Core Management
        </h1>
        <h2 className="text-4xl font-black tracking-tight">
          Hello,{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            {data?.fname || "Employee"}
          </span>{" "}
          👋
        </h2>
      </div>
      <button
        onClick={logOutUser}
        className="px-8 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-bold transition-all duration-300 border border-rose-500/20 hover:border-rose-500/40"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Header;
