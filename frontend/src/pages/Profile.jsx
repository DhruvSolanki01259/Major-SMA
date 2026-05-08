import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  CalendarDays,
  ShieldCheck,
  LogOut,
  Clock,
  ExternalLink,
  Zap,
  CheckCircle2,
  ListOrdered
} from "lucide-react";

import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import api from "../api/api.js";
import { useAuthStore } from "../store/auth.store";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

/* ---------------- Animation ---------------- */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const formatDateTime = (date, time) => {
  if (!date) return "Just now";
  const parsed = new Date(date);
  if (isNaN(parsed)) return `${date} at ${time || ''}`;
  return `${parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} • ${time || ''}`;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        if (res.data && res.data.success) {
          setPosts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "twitter_connected") {
      toast.success("Twitter account connected successfully!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (params.get("error") === "twitter_failed") {
      toast.error("Failed to connect Twitter account.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!user) return <LoadingSpinner label="Loading profile..." />;

  /* ---------------- Logout ---------------- */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleConnect = (platform) => {
    if (platform.toLowerCase() === "twitter") {
      window.location.href = "http://localhost:8000/api/auth/connect/twitter";
    } else {
      toast.error(`${platform} integration coming soon!`);
    }
  };

  /* ---------------- Social Providers ---------------- */

  const socials = [
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      connected: user?.socialConnections?.linkedin || false,
      color: "text-blue-700",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      connected: user?.socialConnections?.instagram || false,
      color: "text-pink-600",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      connected: user?.socialConnections?.facebook || false,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      connected: !!user?.socialConnections?.twitter?.accessToken,
      color: "text-sky-500",
    },
  ];

  return (
    <section className="min-h-screen px-4 sm:px-10 py-16 bg-[#FBFDFF] text-gray-900 font-sans selection:bg-blue-100">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* HEADER */}
        <motion.div {...fadeUp()} className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">
              Welcome back, {user.fullname?.split(' ')[0]} 👋
            </h1>
            <p className="mt-3 text-lg text-gray-500 font-medium">
              Manage your account settings and monitor your campaign statuses.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Profile Info & Socials */}
          <div className="lg:col-span-1 space-y-8">
            {/* PROFILE CARD */}
            <motion.div
              {...fadeUp(0.1)}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full bg-white p-2 shadow-xl shadow-gray-200/50 mb-6 z-10 relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white">
                      {user.profile_initials || user.fullname?.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {user.fullname}
                </h2>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mt-2">
                  {user.role || "Pro Creator"}
                </span>

                <div className="w-full mt-8 space-y-4 text-left">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Mail size={18} className="text-blue-500" /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</span>
                      <span className="text-sm font-bold text-gray-900 truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><CalendarDays size={18} className="text-purple-500" /></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Member Since</span>
                      <span className="text-sm font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SOCIAL CONNECT SECTION */}
            <motion.div
              {...fadeUp(0.2)}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/40"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Zap size={20} className="text-amber-500 fill-amber-500" /> Integrations
              </h3>

              <div className="space-y-4">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <div
                      key={social.name}
                      className="group border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-white transition-colors shadow-sm ${social.color}`}>
                           <Icon size={22} />
                        </div>
                        <span className="font-bold text-gray-900">{social.name}</span>
                      </div>

                      <button
                        onClick={() => !social.connected && handleConnect(social.name)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                          social.connected
                            ? "bg-green-50 text-green-600 cursor-default"
                            : "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-900/20"
                        }`}
                      >
                        {social.connected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Posts List */}
          <div className="lg:col-span-2">
            <motion.div
              {...fadeUp(0.3)}
              className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 h-full flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 flex gap-3 items-center tracking-tight">
                    <ListOrdered size={24} className="text-blue-600" />
                    Campaign History
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Overview of all your generated content and distribution status.</p>
                </div>
                
                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
                   <span className="text-xl font-black text-blue-600">{posts.length}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Posts</span>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto max-h-[800px] custom-scrollbar">
                {isLoadingPosts ? (
                   <div className="flex flex-col items-center justify-center h-64 opacity-50">
                     <LoadingSpinner label="Loading Records..." />
                   </div>
                ) : posts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                       <Clock size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-black text-lg">No campaigns found.</p>
                    <p className="text-sm text-gray-400 font-medium mt-1 max-w-xs mx-auto">
                      Go to the Content Studio to create and schedule your first post.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.slice().reverse().map((post) => (
                      <div key={post._id} className="group flex flex-col sm:flex-row gap-6 items-start sm:items-center p-5 rounded-[2rem] border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
                         
                         <div className="w-full sm:w-24 h-24 sm:h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 relative shadow-sm">
                           <img 
                             src={post.creative?.imageURLs?.[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113"} 
                             alt="post" 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                         </div>

                         <div className="flex-1 min-w-0 w-full space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                 {post.niche || 'General'}
                               </span>
                               {post.isScheduled && (
                                 <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                                   <CalendarDays size={12}/> Scheduled
                                 </span>
                               )}
                            </div>
                            <h4 className="text-base font-black text-gray-900 truncate leading-snug">
                              {post.selectedIdea || "Untitled Post"}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                               <span className="flex items-center gap-1">
                                 <Clock size={12}/> 
                                 {post.isScheduled ? formatDateTime(post.scheduledAt?.date, post.scheduledAt?.time) : new Date(post.createdAt).toLocaleDateString()}
                               </span>
                               <span className="flex items-center gap-1">
                                 <ExternalLink size={12}/> 
                                 {Object.keys(post.platforms || {}).length} Platforms
                               </span>
                            </div>
                         </div>

                         <div className="flex-shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                           <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm ${
                             post.status === 'approved' ? 'bg-green-500 text-white' : 
                             post.status === 'draft' ? 'bg-amber-100 text-amber-700' : 
                             'bg-blue-100 text-blue-700'
                           }`}>
                             {post.status || 'Pending'}
                           </span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* MOBILE LOGOUT */}
        <div className="sm:hidden flex justify-center mt-8">
           <button
            onClick={handleLogout}
            className="flex w-full justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
