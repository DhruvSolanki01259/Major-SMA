import React from"react";
import { motion } from"framer-motion";
import {
 Zap,
 Calendar,
 BarChart3,
 Share2,
 ArrowRight,
 ShieldCheck,
 Clock,
} from"lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from"react-icons/fa";
import { useNavigate } from"react-router-dom";
import { useAuthStore } from"../store/auth.store";
import LoadingSpinner from"../components/LoadingSpinner";

/* ---------------- ANIMATION PRESETS ---------------- */

const fadeUp = (delay = 0) => ({
 initial: { opacity: 0, y: 32 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.6, delay, ease:"easeOut" },
});

const floatY = {
 animate: { y: [0, -10, 0] },
 transition: { duration: 6, repeat: Infinity, ease:"easeInOut" },
};

/* ---------------- SOCIAL ICONS ---------------- */

const SOCIAL_ICONS = [
 { key:"instagram", icon: <FaInstagram />, color:"#E4405F" },
 { key:"twitter", icon: <FaTwitter />, color:"#1DA1F2" },
 { key:"linkedin", icon: <FaLinkedin />, color:"#0077B5" },
 { key:"facebook", icon: <FaFacebook />, color:"#1877F2" },
];

const Home = () => {
 const navigate = useNavigate();
 const { user, isCheckingAuth } = useAuthStore();
 const isSignedIn = !!user;

 if (isCheckingAuth) {
 return (
 <div className="h-screen flex items-center justify-center">
 <LoadingSpinner />
 </div>
 );
 }

 // Define some placeholder connection states for the UI demo since we don't have user.unsafeMetadata here
 const socials = { instagram: true, twitter: true, linkedin: false, facebook: true };

 return (
 <main className="bg-[#FBFDFF] text-gray-900 overflow-hidden font-sans">
 {/* ================= HERO ================= */}
 <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
 {/* LEFT */}
 <motion.div {...fadeUp(0)}>
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
 Social Media Automation
 </div>
 <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#012A4A]">
 {isSignedIn ? (
 <>
 Welcome back, {user.fullname?.split(" ")[0] ||"User"}.
 <span className="block text-[#61A5C2] mt-2">
 Manage your content smarter.
 </span>
 </>
 ) : (
 <>
 Plan. Publish.
 <span className="block text-[#61A5C2] mt-2">
 Grow with confidence.
 </span>
 </>
 )}
 </h1>

 <p className="mt-5 text-sm lg:text-base text-[#2A6F97] max-w-lg font-medium leading-relaxed">
 {isSignedIn
 ?"Control publishing, scheduling, and analytics from one reliable, intelligent dashboard."
 :"A single, powerful platform to schedule content, track performance, and stay perfectly consistent across all your social channels."}
 </p>

 <div className="mt-8 flex flex-wrap gap-4">
 <button
 onClick={() => navigate(isSignedIn ?"/content-studio" :"/signup")}
 className="bg-[#01497C] hover:bg-[#013A63] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-900/20 text-sm"
 >
 {isSignedIn ?"Open Content Studio" :"Get Started Free"}
 <ArrowRight size={16} />
 </button>

 {!isSignedIn && (
 <button
 onClick={() => navigate("/login")}
 className="bg-white border-2 border-gray-100 px-6 py-3 rounded-xl font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all text-sm shadow-sm"
 >
 Login to Account
 </button>
 )}
 </div>
 </motion.div>

 {/* RIGHT – FLOATING CARDS */}
 <motion.div
 {...fadeUp(0.2)}
 className="relative h-[480px] hidden lg:block"
 >
 {/* Platforms */}
 <motion.div
 {...floatY}
 className="absolute top-4 right-4 w-[240px] bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6"
 >
 <h3 className="flex items-center gap-2 font-bold text-xs text-[#012A4A] uppercase tracking-widest">
 <Share2 size={14} className="text-[#61A5C2]" />
 Platforms connected
 </h3>

 <div className="flex gap-3 mt-5">
 {SOCIAL_ICONS.map((s) => (
 <div
 key={s.key}
 className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
 socials[s.key]
 ?"bg-blue-50 border-blue-100 shadow-inner"
 :"opacity-40 border-gray-50 bg-gray-50 grayscale"
 }`}
 style={{ color: socials[s.key] ? s.color :"#9ca3af" }}
 >
 {s.icon}
 </div>
 ))}
 </div>
 </motion.div>

 {/* Scheduling */}
 <motion.div
 animate={{ y: [0, -12, 0] }}
 transition={{ duration: 5, repeat: Infinity }}
 className="absolute top-[160px] right-[140px] w-[280px] bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6"
 >
 <h3 className="flex items-center gap-2 font-bold text-xs text-[#012A4A] uppercase tracking-widest">
 <Calendar size={14} className="text-[#61A5C2]" />
 Smart Scheduling
 </h3>
 <p className="mt-3 text-xs text-[#2A6F97] font-medium leading-relaxed">
 Schedule content once and publish automatically at the exact right time for maximum engagement.
 </p>
 </motion.div>

 {/* Analytics */}
 <motion.div
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 7, repeat: Infinity }}
 className="absolute bottom-10 right-[320px] w-[220px] bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6"
 >
 <h4 className="flex items-center gap-2 font-bold text-xs text-[#012A4A] uppercase tracking-widest">
 <BarChart3 size={14} className="text-[#61A5C2]" />
 Deep Analytics
 </h4>
 <p className="mt-3 text-xs text-[#2A6F97] font-medium leading-relaxed">
 Understand audience engagement and post performance clearly.
 </p>
 </motion.div>
 </motion.div>
 </section>

 {/* ================= FEATURES ================= */}
 <section className="bg-white border-t border-gray-50">
 <div className="max-w-7xl mx-auto px-6 py-20">
 <div className="text-center mb-14">
 <h2 className="text-2xl lg:text-3xl font-extrabold text-[#012A4A]">
 Built for Serious Content Teams
 </h2>
 <p className="text-sm text-[#2A6F97] mt-3 font-medium max-w-md mx-auto">Everything you need to scale your social media presence without scaling your headcount.</p>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 {
 icon: <Clock size={24} className="text-[#61A5C2]" />,
 title:"Time Saving",
 desc:"Reduce manual work with reliable automation.",
 },
 {
 icon: <ShieldCheck size={24} className="text-[#61A5C2]" />,
 title:"Highly Secure",
 desc:"Enterprise-grade authentication and data safety.",
 },
 {
 icon: <Zap size={24} className="text-[#61A5C2]" />,
 title:"Fast Workflow",
 desc:"Publish across multiple platforms in minutes.",
 },
 {
 icon: <BarChart3 size={24} className="text-[#61A5C2]" />,
 title:"Actionable Insights",
 desc:"Track growth and make informed decisions easily.",
 },
 ].map((f, i) => (
 <motion.div
 key={i}
 {...fadeUp(0.1 * i)}
 className="bg-[#FBFDFF] border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 hover:-translate-y-1 transition-all"
 >
 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
 {f.icon}
 </div>
 <h3 className="font-bold text-base text-[#012A4A]">{f.title}</h3>
 <p className="mt-2 text-xs text-[#2A6F97] leading-relaxed font-medium">
 {f.desc}
 </p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* ================= CTA ================= */}
 {!isSignedIn && (
 <section className="bg-[#01497C] text-white overflow-hidden relative">
 <div className="absolute inset-0 bg-gradient-to-br from-[#013A63] to-[#01497C]" />
 <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
 <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#61A5C2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
 
 <div className="relative max-w-4xl mx-auto px-6 py-20 text-center z-10">
 <h2 className="text-3xl font-extrabold tracking-tight">
 Start Free. Upgrade When Ready.
 </h2>

 <p className="mt-4 text-[#A9D6E5] text-sm font-medium">
 No credit card required. Get started in minutes.
 </p>

 <button
 onClick={() => navigate("/signup")}
 className="mt-8 bg-white text-[#01497C] px-8 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl text-sm"
 >
 Create Free Account
 </button>
 </div>
 </section>
 )}
 </main>
 );
};

export default Home;