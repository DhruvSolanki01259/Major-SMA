import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  // UI-only state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDark = false;

  const bgPrimary = isDark ? "bg-[#0B1E30]" : "bg-[#F8FAFC]";
  const cardBg = isDark
    ? "bg-[#102A43] border-[#1E3A5F]"
    : "bg-white border-[#E2E8F0]";
  const leftBg = isDark
    ? "bg-[#1E3A5F] border-r-[#2C7DA0]"
    : "bg-[#F1F5F9] border-r-[#E2E8F0]";
  const textPrimary = isDark ? "text-[#E0F2FF]" : "text-[#012A4A]";
  const textSecondary = isDark ? "text-[#61A5C2]/80" : "text-[#013A63]/80";
  const inputBg = isDark
    ? "bg-[#1E3A5F] text-[#E0F2FF] border-[#2C7DA0]"
    : "bg-[#F9FAFB] text-[#013A63] border-[#E2E8F0]";
  const buttonBg = isDark
    ? "bg-[#61A5C2] hover:bg-[#89C2D9]"
    : "bg-[#01497C] hover:bg-[#014F86]";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${bgPrimary}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative flex w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden border ${cardBg}`}
      >
        {/* LEFT SIDE */}
        <div
          className={`hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 ${leftBg}`}
        >
          <img src="/login-image.png" className="w-96 mb-6" alt="Login" />
          <h3 className={`${textPrimary} text-3xl font-bold text-center`}>
            Manage Your Presence Effortlessly
          </h3>
          <p className={`${textSecondary} text-center mt-2`}>
            Access your automation dashboard securely.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            <h2
              className={`text-3xl font-bold text-center mb-6 ${textPrimary}`}
            >
              Welcome Back
            </h2>

            {/* FORM */}
            <form className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 opacity-60" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 p-3 rounded-lg border ${inputBg}`}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 opacity-60" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 p-3 rounded-lg border ${inputBg}`}
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className={`text-sm font-medium ${
                    isDark ? "text-[#61A5C2]" : "text-[#01497C]"
                  } hover:underline`}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="button"
                className={`w-full py-3 rounded-lg text-white font-semibold ${buttonBg}`}
              >
                Log In
              </button>
            </form>

            {/* SOCIAL BUTTONS */}
            <div className="flex justify-center gap-4 mt-6">
              {/* Google */}
              <button className="flex items-center gap-2 px-5 py-2.5 border rounded-lg hover:shadow">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                  alt="Google"
                />
                Google
              </button>

              {/* GitHub */}
              {/* <button className="flex items-center gap-2 px-5 py-2.5 border rounded-lg hover:shadow">
                <GitHub className="w-5 h-5" />
                GitHub
              </button> */}
            </div>

            {/* Signup link */}
            <p className={`mt-6 text-center text-sm ${textSecondary}`}>
              Don’t have an account?{" "}
              <Link to="/signup" className="font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
