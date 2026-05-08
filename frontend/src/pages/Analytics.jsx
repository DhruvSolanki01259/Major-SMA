import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

/* ─── helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const PLATFORM_META = {
  instagram: { label: "Instagram", color: "#E4405F", bg: "#FFF0F3", Icon: FaInstagram },
  twitter: { label: "Twitter / X", color: "#1DA1F2", bg: "#EFF9FF", Icon: FaTwitter },
  linkedin: { label: "LinkedIn", color: "#0077B5", bg: "#EEF5FB", Icon: FaLinkedin },
  facebook: { label: "Facebook", color: "#1877F2", bg: "#EEF2FF", Icon: FaFacebook },
};

function MetricCard({ icon: Icon, iconColor, iconBg, label, value, sub, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 flex items-center gap-5 hover:shadow-gray-200/40 hover:-translate-y-0.5 transition-all"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-[#012A4A] leading-none">{value}</p>
        {sub && (
          <p className="text-xs font-medium text-[#2A6F97] mt-1">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-[#012A4A]">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── main component ─── */
const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/posts`, {
          withCredentials: true,
        });
        // Backend returns { success: true, data: [...] }
        const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setPosts(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Could not load post data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  /* ─── derived metrics ─── */
  const total = posts.length;
  const approved = posts.filter(
    (p) => p.status === "approved" || p.status === "Approved"
  ).length;
  const drafts = posts.filter(
    (p) => p.status === "draft" || p.status === "Draft"
  ).length;
  const scheduled = posts.filter((p) => p.isScheduled).length;

  // platform distribution – count unique platforms per post
  const platformCounts = {};
  posts.forEach((p) => {
    // p.selectedPlatforms is an array of platform keys
    const pList = Array.isArray(p.selectedPlatforms) 
      ? p.selectedPlatforms 
      : (p.platforms ? Object.keys(p.platforms) : []);
      
    pList.forEach((pl) => {
      const key = pl.toLowerCase();
      platformCounts[key] = (platformCounts[key] || 0) + 1;
    });
  });

  // upcoming schedule (sorted ascending, next 10)
  const upcomingPosts = posts
    .filter((p) => p.isScheduled && p.scheduledAt && p.scheduledAt.date)
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledAt.date} ${a.scheduledAt.time}`);
      const dateB = new Date(`${b.scheduledAt.date} ${b.scheduledAt.time}`);
      return dateA - dateB;
    })
    .slice(0, 10);

  /* ─── loading / error states ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFDFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#61A5C2] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#2A6F97]">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBFDFF] flex items-center justify-center px-6">
        <div className="bg-white rounded-[2rem] border border-red-100 shadow-xl p-10 max-w-md text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <p className="font-bold text-[#012A4A] text-base mb-2">
            Failed to load data
          </p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFDFF] font-sans py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full mb-5">
            <BarChart3 size={12} />
            Analytics Dashboard
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#012A4A] leading-tight">
            Content Performance{" "}
            <span className="text-[#61A5C2]">Overview</span>
          </h1>
          <p className="text-sm text-[#2A6F97] font-medium mt-3 max-w-lg">
            A real-time summary of all your posts, their statuses, platform
            distribution, and upcoming scheduled content.
          </p>
        </motion.div>

        {/* ── Top KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            delay={0.05}
            icon={Layers}
            iconColor="#01497C"
            iconBg="#EEF5FF"
            label="Total Posts"
            value={total}
            sub="All content entries"
          />
          <MetricCard
            delay={0.1}
            icon={CheckCircle2}
            iconColor="#059669"
            iconBg="#ECFDF5"
            label="Approved"
            value={approved}
            sub={total > 0 ? `${Math.round((approved / total) * 100)}% of total` : "—"}
          />
          <MetricCard
            delay={0.15}
            icon={FileText}
            iconColor="#D97706"
            iconBg="#FFFBEB"
            label="Drafts"
            value={drafts}
            sub={total > 0 ? `${Math.round((drafts / total) * 100)}% of total` : "—"}
          />
          <MetricCard
            delay={0.2}
            icon={Clock}
            iconColor="#7C3AED"
            iconBg="#F5F3FF"
            label="Scheduled"
            value={scheduled}
            sub="Awaiting auto-publish"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* ── Platform Distribution ── */}
          <motion.div
            {...fadeUp(0.25)}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8"
          >
            <SectionHeading>Platform Distribution</SectionHeading>
            {Object.keys(platformCounts).length === 0 ? (
              <p className="text-sm text-gray-400 font-medium text-center py-8">
                No platform data found in posts.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(platformCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([platform, count]) => {
                    const meta =
                      PLATFORM_META[platform] || {
                        label: platform,
                        color: "#6B7280",
                        bg: "#F9FAFB",
                        Icon: TrendingUp,
                      };
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={platform}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: meta.bg }}
                            >
                              <meta.Icon size={14} style={{ color: meta.color }} />
                            </div>
                            <span className="text-sm font-bold text-[#012A4A]">
                              {meta.label}
                            </span>
                          </div>
                          <span className="text-xs font-black text-[#2A6F97]">
                            {count} post{count !== 1 ? "s" : ""}{" "}
                            <span className="text-gray-400 font-medium">
                              · {pct}%
                            </span>
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: meta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </motion.div>

          {/* ── Status Breakdown ── */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8"
          >
            <SectionHeading>Status Breakdown</SectionHeading>
            {total === 0 ? (
              <p className="text-sm text-gray-400 font-medium text-center py-8">
                No posts found.
              </p>
            ) : (
              <div className="space-y-5">
                {[
                  {
                    label: "Approved",
                    count: approved,
                    color: "#059669",
                    bg: "#ECFDF5",
                    Icon: CheckCircle2,
                  },
                  {
                    label: "Drafts",
                    count: drafts,
                    color: "#D97706",
                    bg: "#FFFBEB",
                    Icon: FileText,
                  },
                  {
                    label: "Scheduled",
                    count: scheduled,
                    color: "#7C3AED",
                    bg: "#F5F3FF",
                    Icon: Clock,
                  },
                ].map(({ label, count, color, bg, Icon }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: bg }}
                          >
                            <Icon size={14} style={{ color }} />
                          </div>
                          <span className="text-sm font-bold text-[#012A4A]">
                            {label}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#2A6F97]">
                          {count}{" "}
                          <span className="text-gray-400 font-medium">· {pct}%</span>
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Upcoming Schedule ── */}
        <motion.div
          {...fadeUp(0.35)}
          className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8"
        >
          <SectionHeading>Upcoming Scheduled Posts</SectionHeading>
          {upcomingPosts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar
                size={36}
                className="text-gray-200 mx-auto mb-4"
              />
              <p className="text-sm font-semibold text-gray-400">
                No scheduled posts found.
              </p>
              <p className="text-xs text-gray-300 mt-1 font-medium">
                Schedule a post in Content Studio to see it here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 pb-3 pr-4">
                      Title
                    </th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 pb-3 pr-4">
                      Platform(s)
                    </th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 pb-3">
                      Scheduled At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingPosts.map((post, i) => {
                    const platforms =
                      post.platforms ??
                      (post.platform ? [post.platform] : []);
                    return (
                      <tr
                        key={post._id ?? i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 pr-4 font-bold text-[#012A4A] max-w-[220px] truncate">
                          {post.title || post.content?.slice(0, 40) || "Untitled"}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex gap-2 flex-wrap">
                            {platforms.length > 0 ? (
                              platforms.map((pl) => {
                                const meta =
                                  PLATFORM_META[pl.toLowerCase()] || null;
                                return (
                                  <span
                                    key={pl}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
                                    style={{
                                      background: meta?.bg ?? "#F3F4F6",
                                      color: meta?.color ?? "#6B7280",
                                    }}
                                  >
                                    {meta && (
                                      <meta.Icon size={10} />
                                    )}
                                    {meta?.label ?? pl}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-[#2A6F97] font-semibold text-xs whitespace-nowrap">
                          {formatDate(post.scheduledAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default Analytics;
