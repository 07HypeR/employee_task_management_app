import React from "react";
import { Link } from "react-router-dom";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const success = handleLogin(email, password);

    if (!success) {
      setError("Invalid credentials. Please check your email and password.");
      return;
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-[#1c1c1c] relative overflow-y-auto overflow-x-hidden py-10 px-4 sm:px-0 scroll-smooth">
      {/* Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-[#111111]/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 p-8 sm:p-10 shadow-2xl overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />

          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mb-3">
              Employee Portal
            </h1>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Welcome{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Back
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Please enter your credentials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl animate-shake">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                  <span className="text-rose-500 text-lg">⚠</span>
                </div>
                <p className="text-rose-400 text-xs sm:text-sm font-semibold">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                type="email"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error on input change
                }}
                required
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <button className="mt-4 sm:mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 sm:h-14 px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer text-sm sm:text-base">
              Log In
            </button>

            <div className="mt-4 flex flex-col gap-2 items-center">
              <a
                href="#"
                className="text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors duration-300"
              >
                Forgot password?
              </a>
              <div className="text-[10px] sm:text-xs font-medium text-slate-600 uppercase tracking-wider text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors duration-300"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">
          Secure Access Management
        </p>
      </div>
    </div>
  );
};

export default Login;
