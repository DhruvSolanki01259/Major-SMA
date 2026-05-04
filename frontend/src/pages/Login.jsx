import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, X, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { error, isLoading, login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Signing you in...");

    try {
      await login({
        email,
        password,
      });

      toast.success("Logged in successfully 🎉", {
        id: loadingToast,
      });

      navigate("/");
    } catch (err) {
      toast.error(err?.message || error || "Login failed. Please try again.", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden border bg-white border-[#E2E8F0]"
      >
        {/* LOADING OVERLAY */}

        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md transition-all duration-300">
            <p className="text-lg font-semibold text-[#012A4A] animate-pulse">
              Signing you in...
            </p>
          </div>
        )}

        {/* CONTENT */}

        <div
          className={`flex w-full ${
            isLoading ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          {/* LEFT PANEL */}

          <div className="hidden md:flex md:w-1/2 border-r p-10 items-center justify-center flex-col bg-[#F1F5F9] border-[#E2E8F0]">
            <img src="/login-image.png" className="w-96 mb-6" />

            <h3 className="text-[#012A4A] text-3xl font-bold text-center">
              Manage Your Presence Effortlessly
            </h3>

            <p className="text-[#013A63]/80 text-center mt-2">
              Access your automation dashboard securely.
            </p>
          </div>

          {/* RIGHT PANEL */}

          <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#012A4A]">
                Welcome Back
              </h2>

              <form className="space-y-4" onSubmit={handleLogin}>
                {/* EMAIL */}

                <div className="flex items-center border rounded-lg px-3 py-2 bg-[#F9FAFB] border-[#E2E8F0]">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />

                  {email && (
                    <X
                      className="w-4 h-4 text-gray-500 cursor-pointer"
                      onClick={() => setEmail("")}
                    />
                  )}
                </div>

                {/* PASSWORD */}

                <div className="space-y-1">
                  {password && (
                    <p
                      onClick={() => {
                        setPassword("");
                        setShowPassword(false);
                      }}
                      className="text-xs text-blue-600 px-3 text-right cursor-pointer hover:underline"
                    >
                      Clear password
                    </p>
                  )}

                  <div className="flex items-center border rounded-lg px-3 py-2 bg-[#F9FAFB] border-[#E2E8F0]">
                    <Lock className="w-5 h-5 text-gray-500 mr-2" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />

                    <div
                      className="cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* FORGOT PASSWORD

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#01497C] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div> */}

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-semibold text-white bg-[#01497C] hover:bg-[#014F86] transition disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </button>
              </form>

              {/* OAUTH BUTTONS */}

              {/* <div className="flex justify-center gap-4 mt-6">
                <button
                  // onClick={() =>
                  //   window.open(
                  //     "http://localhost:8000/api/auth/google",
                  //     "_self",
                  //   )
                  // }
                  className="flex items-center gap-2 px-5 py-2.5 border rounded-lg hover:bg-gray-50 transition"
                >
                  <FcGoogle className="w-5 h-5" />
                  Google
                </button>

                <button className="flex items-center gap-2 px-5 py-2.5 border rounded-lg hover:bg-gray-50 transition">
                  <FaGithub className="w-5 h-5" />
                  GitHub
                </button>
              </div> */}

              {/* SIGNUP LINK */}

              <p className="mt-6 text-center text-sm text-[#013A63]/80">
                Don’t have an account?{" "}
                <Link to="/signup" className="font-medium hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
