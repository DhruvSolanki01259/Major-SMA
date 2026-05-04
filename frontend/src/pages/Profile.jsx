import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  CalendarDays,
  ShieldCheck,
  LogOut,
  Clock,
  PlusCircle,
} from "lucide-react";

import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

import { useAuthStore } from "../store/auth.store";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

/* ---------------- Animation ---------------- */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const Profile = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  if (!user) return <LoadingSpinner label="Loading profile..." />;

  /* ---------------- Logout ---------------- */

  const handleLogout = () => {
    logout();
    navigate("/login");
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
      color: "text-pink-500",
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
      connected: user?.socialConnections?.twitter || false,
      color: "text-sky-500",
    },
  ];

  return (
    <section className="min-h-screen px-6 py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* HEADER */}

        <motion.div {...fadeUp()}>
          <h1 className="text-4xl font-bold text-[#012A4A]">
            Welcome, Creator 👋
          </h1>

          <p className="mt-2 text-[#6C757D]">
            Manage your profile, connect platforms, and schedule posts.
          </p>
        </motion.div>

        {/* PROFILE CARD */}

        <motion.div
          {...fadeUp(0.1)}
          className="bg-white border border-[#E2E8F0] rounded-3xl p-10 flex gap-8 items-center shadow-sm"
        >
          {/* Avatar */}

          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.profile_initials
            )}
          </div>

          {/* User Info */}

          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold text-[#012A4A]">
              {user.name}
            </h2>

            <p className="flex items-center gap-2 text-[#6C757D]">
              <Mail size={16} />
              {user.email}
            </p>

            <p className="flex items-center gap-2 text-[#6C757D]">
              <CalendarDays size={16} />
              Joined {new Date(user.createdAt).toDateString()}
            </p>

            <p className="flex items-center gap-2 text-[#6C757D]">
              <ShieldCheck size={16} />
              Role: {user.role || "Creator"}
            </p>
          </div>
        </motion.div>

        {/* SOCIAL CONNECT SECTION */}

        <motion.div
          {...fadeUp(0.2)}
          className="bg-white border border-[#E2E8F0] rounded-3xl p-10 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-6 text-[#012A4A]">
            Connect Social Platforms
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {socials.map((social) => {
              const Icon = social.icon;

              return (
                <div
                  key={social.name}
                  className="border border-[#E2E8F0] rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-md transition"
                >
                  <Icon size={28} className={social.color} />

                  <p className="font-medium">{social.name}</p>

                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      social.connected
                        ? "bg-green-100 text-green-700"
                        : "bg-[#01497C] text-white hover:bg-[#014F86]"
                    }`}
                  >
                    {social.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* SCHEDULED POSTS */}

        <motion.div
          {...fadeUp(0.3)}
          className="bg-white border border-[#E2E8F0] rounded-3xl p-10 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#012A4A] flex gap-2 items-center">
              <Clock size={20} />
              Scheduled Posts
            </h3>

            <button className="flex items-center gap-2 bg-[#01497C] text-white px-5 py-2 rounded-lg hover:bg-[#014F86] transition">
              <PlusCircle size={16} />
              Create Post
            </button>
          </div>

          <div className="border border-dashed border-[#CED4DA] rounded-2xl p-12 text-center">
            <Clock className="mx-auto mb-4 text-[#ADB5BD]" />

            <p className="text-[#6C757D]">No scheduled posts yet.</p>

            <p className="text-sm text-[#ADB5BD] mt-2">
              Your scheduled automation content will appear here.
            </p>
          </div>
        </motion.div>

        {/* CREATIVE LOGOUT CARD */}

        <motion.div
          {...fadeUp(0.4)}
          className="bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-3xl p-10 text-white flex justify-between items-center"
        >
          <div>
            <h3 className="text-xl font-semibold">Ready to take a break?</h3>

            <p className="opacity-90 mt-1">
              You can safely logout anytime and return later.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-[#E63946] px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
