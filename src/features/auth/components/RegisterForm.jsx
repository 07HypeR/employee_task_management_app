import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useApi";

const Register = () => {
  const [formData, setFormData] = React.useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      if (result.error === "User already exists") {
        setError("User already exists with this email");
      } else if (
        result.error?.includes("failed") ||
        result.error?.includes("fetch")
      ) {
        setError("Server error, try again later");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-[#1c1c1c] relative overflow-y-auto overflow-x-hidden py-10 scroll-smooth">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-[#111111]/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-emerald-500/10 p-8 sm:p-10 shadow-2xl overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mb-3">
              Join Our Team
            </h1>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Create{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Account
              </span>
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl animate-shake relative group">
              <div className="flex items-center gap-3 pr-8 justify-center">
                <p className="text-rose-400 text-xs sm:text-sm font-semibold text-center">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError("")}
                className="absolute top-1/2 -translate-y-1/2 right-3 w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                title="Close"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <p className="text-emerald-400 text-xs sm:text-sm font-semibold text-center">
                ✓ Registration successful! Redirecting to login...
              </p>
            </div>
          )}

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                  First Name
                </label>
                <input
                  name="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                  type="text"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                  Last Name
                </label>
                <input
                  name="lname"
                  value={formData.lname}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                  type="text"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Role Selection
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base"
              >
                <option value="employee" className="bg-[#1c1c1c]">
                  Employee
                </option>
                <option value="admin" className="bg-[#1c1c1c]">
                  Admin
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-4">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full h-12 sm:h-14 outline-none bg-black/20 border border-emerald-500/10 text-white px-5 sm:px-6 rounded-xl sm:rounded-2xl placeholder:text-slate-600 focus:border-emerald-500/40 focus:bg-black/40 transition-all duration-300 text-sm sm:text-base"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className="mt-4 sm:mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 sm:h-14 px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer text-sm sm:text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
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
                  <span>Processing...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="mt-4 text-center">
              <div className="text-[10px] sm:text-xs font-medium text-slate-600 uppercase tracking-wider">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors duration-300"
                >
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
