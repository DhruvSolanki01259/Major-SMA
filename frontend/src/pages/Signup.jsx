import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, X, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/auth.store";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating your account...");

    try {
      await signup({ fullname, email, password });
      toast.success("Account created successfully 🎉", { id: loadingToast });
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Signup failed", { id: loadingToast });
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-[#FBFDFF] font-sans text-gray-900 selection:bg-blue-100">
      {/* RIGHT PANEL - Decorative */}
      <div className="hidden md:flex w-full md:w-5/12 bg-[#01497C] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent z-0" />
        
        <div className="relative z-10 flex justify-end">
          <div className="bg-white p-3 rounded-xl shadow-xl shadow-black/20 mb-8">
            <img src="/app-logo.png" alt="App Logo" className="w-24" />
          </div>
        </div>

        <div className="relative z-10 text-right mt-auto mb-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter mb-4">
            Automate Your Social Growth
          </h2>
          <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-md ml-auto">
            Join thousands of creators who simplify their workflow, analyze performance, and grow their audience on autopilot.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl self-end w-full max-w-xs">
           <div className="flex gap-4 items-center mb-4">
              <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg overflow-hidden">
                 <img src="/signup-image.png" className="w-full h-full object-cover" alt="" onError={(e) => e.target.style.display = 'none'}/>
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-widest uppercase">Global Reach</p>
                <p className="text-blue-200 font-bold text-xs">Publish Everywhere</p>
              </div>
           </div>
        </div>
      </div>

      {/* LEFT PANEL - Signup Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 relative z-10"
        >
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 font-medium">
              Start your journey to social media mastery.
            </p>
          </div>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm group mb-8"
          >
            <FcGoogle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Or sign up with email</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                />
                {fullname && (
                  <button type="button" onClick={() => setFullname("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                />
                {email && (
                  <button type="button" onClick={() => setEmail("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
               </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-gray-900 tracking-widest placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black tracking-widest uppercase text-[11px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 active:translate-y-0"
            >
              {isLoading ? "Creating..." : <>Get Started Free <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
