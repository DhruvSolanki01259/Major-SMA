import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, ChevronDown, ArrowLeft } from "lucide-react";

import CreatePost from "../components/CreatePost.jsx";

/* ---------- ANIMATION ---------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

/* ---------- MOCK DATA ---------- */
const mockPosts = [
  {
    _id: "1",
    title: "AI Marketing Trends 2026",
    description: "Top AI trends you must follow to grow your business.",
    tags: ["AI", "Marketing", "Trends"],
    socialMedia: ["Instagram", "LinkedIn"],
    category: "Marketing",
    isScheduled: false,
    scheduledAt: { date: "2026-05-01", time: "10:00 AM" },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    _id: "2",
    title: "Startup Growth Hacks",
    description: "Proven hacks to scale your startup fast.",
    tags: ["Startup", "Growth"],
    socialMedia: ["Twitter"],
    category: "Business",
    isScheduled: true,
    scheduledAt: { date: "2026-05-05", time: "2:30 PM" },
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
  },
  {
    _id: "3",
    title: "Content Creation Tips",
    description: "Create viral content easily with these tips.",
    tags: ["Content", "Social Media"],
    socialMedia: ["Instagram", "Facebook"],
    category: "Content",
    isScheduled: false,
    scheduledAt: { date: "2026-04-28", time: "6:00 PM" },
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
];

/* ---------- DATE FORMAT ---------- */
const formatDateTime = (date, time) => {
  const parsed = new Date(date);
  if (isNaN(parsed)) return "";
  return `${parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} at ${time}`;
};

const ContentStudio = () => {
  const [posts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    platform: "",
    tag: "",
  });

  /* ---------- FILTER ---------- */
  const filteredPosts = posts.filter((p) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags.some((t) => t.toLowerCase().includes(search));

    const matchesCategory = filters.category
      ? p.category.toLowerCase().includes(filters.category.toLowerCase())
      : true;

    const matchesPlatform = filters.platform
      ? p.socialMedia.some((pl) =>
          pl.toLowerCase().includes(filters.platform.toLowerCase()),
        )
      : true;

    const matchesTag = filters.tag
      ? p.tags.some((t) => t.toLowerCase().includes(filters.tag.toLowerCase()))
      : true;

    return matchesSearch && matchesCategory && matchesPlatform && matchesTag;
  });

  const uploadedPosts = filteredPosts.filter((p) => !p.isScheduled);
  const scheduledPosts = filteredPosts.filter((p) => p.isScheduled);

  /* ---------- CARD ---------- */
  const PostCard = ({ post }) => (
    <motion.div
      {...fadeUp()}
      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      <div className="h-44 overflow-hidden">
        <img
          src={post.image}
          alt=""
          className="w-full h-full object-cover hover:scale-105 transition"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#012A4A]">{post.title}</h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-3">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-[#E0F2FF] text-[#01497C] px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-[#01497C] mt-auto">
          <strong>Platforms:</strong> {post.socialMedia.join(", ")}
        </div>

        <div className="text-xs text-gray-500 mt-2">
          {post.isScheduled
            ? `Scheduled for ${formatDateTime(
                post.scheduledAt.date,
                post.scheduledAt.time,
              )}`
            : `Posted on ${formatDateTime(
                post.scheduledAt.date,
                post.scheduledAt.time,
              )}`}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        {!isCreatingPost ? (
          <motion.div
            key="studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-bold text-[#012A4A]">
                  Content Studio
                </h1>
                <p className="text-gray-500">Manage your posts visually</p>
              </div>

              <button
                onClick={() => setIsCreatingPost(true)}
                className="flex items-center gap-2 px-5 py-2 border border-[#01497C] text-[#01497C] rounded-lg hover:bg-[#01497C] hover:text-white transition"
              >
                <PlusCircle size={18} />
                Create Post
              </button>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-6 rounded-xl shadow mb-10">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="bg-[#01497C] text-white px-4 rounded-lg flex items-center gap-2"
                >
                  <ChevronDown size={16} />
                  Filters
                </button>
              </div>

              {/* ADVANCED */}
              {showAdvanced && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["category", "platform", "tag"].map((field) => (
                    <input
                      key={field}
                      placeholder={field}
                      className="border p-2 rounded"
                      value={filters[field]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [field]: e.target.value,
                        })
                      }
                    />
                  ))}

                  <button
                    onClick={() =>
                      setFilters({
                        category: "",
                        platform: "",
                        tag: "",
                      })
                    }
                    className="text-sm text-blue-600"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* UPLOADED */}
            <h2 className="text-xl font-semibold mb-4">Uploaded Posts</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* SCHEDULED */}
            <h2 className="text-xl font-semibold mt-10 mb-4">
              Scheduled Posts
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {scheduledPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="create">
            <button
              onClick={() => setIsCreatingPost(false)}
              className="mb-6 flex items-center gap-2 text-[#01497C]"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <CreatePost />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentStudio;
