import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const isDark = false;

  const bgPrimary = isDark ? "bg-[#0B1E30]" : "bg-[#F8FAFC]";
  const cardBg = isDark
    ? "bg-[#102A43] border-[#1E3A5F]"
    : "bg-white border-[#E2E8F0]";
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
        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {!verifying ? (
              <>
                <h2
                  className={`text-3xl font-bold text-center mb-6 ${textPrimary}`}
                >
                  Create Your Account
                </h2>

                <form className="space-y-4">
                  {/* Full Name */}
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 opacity-60" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 p-3 rounded-lg border ${inputBg}`}
                    />
                  </div>

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

                  {/* Sign Up Button */}
                  <button
                    type="button"
                    onClick={() => setVerifying(true)}
                    className={`w-full py-3 rounded-lg font-semibold text-white ${buttonBg}`}
                  >
                    Sign Up
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
                  <button className="flex items-center gap-2 px-5 py-2.5 border rounded-lg hover:shadow">
                    {/* <GitHub className="w-5 h-5" /> */}
                    GitHub
                  </button>
                </div>

                {/* Login */}
                <p className={`mt-6 text-center text-sm ${textSecondary}`}>
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium hover:underline">
                    Login
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2
                  className={`text-2xl font-bold text-center mb-6 ${textPrimary}`}
                >
                  Verify Your Email
                </h2>

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${inputBg}`}
                  />

                  <button
                    type="button"
                    className={`w-full py-3 rounded-lg font-semibold text-white ${buttonBg}`}
                  >
                    Verify Email
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`hidden md:flex md:w-1/2 border-l p-10 items-center justify-center flex-col ${
            isDark
              ? "bg-[#1E3A5F] border-[#2C7DA0]"
              : "bg-[#F1F5F9] border-[#E2E8F0]"
          }`}
        >
          <img src="/signup-image.png" className="w-96 mb-6" alt="Signup" />
          <h3 className={`${textPrimary} text-3xl font-bold`}>
            Automate Your Social Growth
          </h3>
          <p className={`${textSecondary} text-center mt-2`}>
            Simplify your workflow with powerful automation.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
