import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, PlusCircle, ChevronDown, ArrowLeft, X, Heart, MessageCircle, 
  Share2, Repeat2, Bookmark, MoreHorizontal, Plus, Edit2, CheckCircle2, 
  Save, Ban, Calendar, Clock, Image as ImageIcon, Send, ExternalLink,
  ShieldCheck, User, Globe, Zap, Rocket
} from "lucide-react";
import api from "../api/api.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/auth.store";

import CreatePost from "../components/CreatePost.jsx";

/* ---------- ANIMATION ---------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: "easeOut" },
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

/* ---------- REAL WORLD MOCKUPS (PREMIUM VERSION) ---------- */
const SocialMediaMockup = ({ platform, data, isEditing, onUpdate, username }) => {
  const { content, mediaUrl } = data;
  const text = content?.text || "";
  const hashtags = Array.isArray(content?.hashtags) ? content.hashtags.join(" ") : (content?.hashtags || "");
  const imageUrl = mediaUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113";

  const handleChange = (field, value) => {
    if (field === "hashtags") {
      onUpdate({
        ...data,
        content: {
          ...content,
          hashtags: value.split(" ").filter(t => t.trim() !== "")
        }
      });
    } else {
      onUpdate({
        ...data,
        content: {
          ...content,
          [field]: value
        }
      });
    }
  };

  const commonClasses = "border border-gray-100 rounded-[2rem] bg-white w-full max-w-[400px] font-sans shadow-2xl shadow-gray-200/50 hover:shadow-gray-300/50 transition-all duration-500 overflow-hidden group/mockup";

  if (platform === "twitter") {
    return (
      <div className={commonClasses}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-black rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xl">X</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                   <span className="font-bold text-[15px] text-gray-900 leading-tight">{username || "Your Brand"}</span>
                   <ShieldCheck size={14} className="text-blue-500 fill-blue-500 text-white" />
                </div>
                <span className="text-gray-500 text-[14px]">@{(username || "yourbrand").toLowerCase().replace(/\s/g, "")} · now</span>
              </div>
            </div>
            <MoreHorizontal className="text-gray-300" size={18} />
          </div>
          
          {isEditing ? (
            <div className="space-y-3 mb-4">
              <textarea 
                className="w-full p-4 text-[15px] border-2 border-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none min-h-[120px] transition-all"
                value={text}
                onChange={(e) => handleChange("text", e.target.value)}
                placeholder="What's happening?"
              />
              <input 
                className="w-full p-3 text-[15px] border-2 border-gray-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-[#1D9BF0] font-medium"
                value={hashtags}
                onChange={(e) => handleChange("hashtags", e.target.value)}
                placeholder="#hashtags"
              />
            </div>
          ) : (
            <>
              <p className="text-[15px] mb-3 text-gray-900 whitespace-pre-wrap leading-relaxed">{text}</p>
              {hashtags && <p className="text-[15px] text-[#1D9BF0] mb-4 hover:underline cursor-pointer">{hashtags}</p>}
            </>
          )}

          <div className="rounded-2xl overflow-hidden border border-gray-50 relative group">
            <img src={imageUrl} alt="post" className="w-full h-auto object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex justify-between mt-5 text-gray-400 px-1">
            <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><MessageCircle size={18}/> <span className="text-xs font-bold">24</span></div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors"><Repeat2 size={18}/> <span className="text-xs font-bold">12</span></div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500 transition-colors"><Heart size={18}/> <span className="text-xs font-bold">142</span></div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><Share2 size={18}/></div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === "instagram") {
    return (
      <div className={commonClasses}>
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584] rounded-full p-[2px]">
              <div className="w-full h-full bg-white rounded-full border border-white flex items-center justify-center overflow-hidden">
                 <User size={20} className="text-gray-200" />
              </div>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-[14px] text-gray-900 flex items-center gap-1">{(username || "yourbrand").toLowerCase().replace(/\s/g, "")} <ShieldCheck size={12} className="text-blue-500 fill-blue-500 text-white"/></span>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Sponsored</span>
            </div>
          </div>
          <MoreHorizontal size={20} className="text-gray-900" />
        </div>
        
        <div className="aspect-square w-full overflow-hidden relative">
          <img src={imageUrl} alt="post" className="w-full h-full object-cover transition-transform duration-700 group-hover/mockup:scale-105" />
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-3 px-1">
            <div className="flex gap-4">
              <Heart size={26} className="text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
              <MessageCircle size={26} className="text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
              <Share2 size={26} className="text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
            </div>
            <Bookmark size={26} className="text-gray-900 hover:scale-110 transition-transform cursor-pointer" />
          </div>
          
          <div className="px-1">
            <p className="font-black text-[14px] text-gray-900 mb-2">1,248 likes</p>
            {isEditing ? (
              <div className="space-y-3 mt-2">
                <textarea 
                  className="w-full p-3 text-[14px] border-2 border-gray-50 rounded-2xl focus:ring-2 focus:ring-purple-400 outline-none min-h-[100px]"
                  value={text}
                  onChange={(e) => handleChange("text", e.target.value)}
                  placeholder="Add a caption..."
                />
                <input 
                  className="w-full p-3 text-[14px] border-2 border-gray-50 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none text-blue-800"
                  value={hashtags}
                  onChange={(e) => handleChange("hashtags", e.target.value)}
                  placeholder="#hashtags"
                />
              </div>
            ) : (
              <>
                <p className="text-[14px] text-gray-900 leading-snug">
                  <span className="font-bold mr-2">{(username || "yourbrand").toLowerCase().replace(/\s/g, "")}</span>
                  {text}
                </p>
                {hashtags && <p className="text-[14px] text-[#00376B] mt-2 font-medium">{hashtags}</p>}
              </>
            )}
            <p className="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest">34 minutes ago</p>
          </div>
        </div>
      </div>
    );
  }

  if (platform === "linkedin") {
    return (
      <div className={commonClasses}>
        <div className="flex justify-between items-start p-5">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-[#0A66C2] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-inner shadow-black/20">in</div>
            <div>
              <p className="font-bold text-[14px] text-gray-900 leading-tight flex items-center gap-1.5">
                {username || "Your Brand"} 
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-black">Company</span>
              </p>
              <p className="text-gray-400 text-[12px] mt-0.5 font-medium">Empowering Social Connections • 1st</p>
              <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-[12px]">
                <Clock size={12}/> <span>Just now •</span>
                <Globe size={12}/>
              </div>
            </div>
          </div>
          <MoreHorizontal size={20} className="text-gray-400" />
        </div>

        <div className="px-5 pb-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea 
                className="w-full p-4 text-[14px] border-2 border-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none min-h-[140px]"
                value={text}
                onChange={(e) => handleChange("text", e.target.value)}
                placeholder="What do you want to talk about?"
              />
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-50 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-[#0A66C2]"
                value={hashtags}
                onChange={(e) => handleChange("hashtags", e.target.value)}
                placeholder="#hashtags"
              />
            </div>
          ) : (
            <>
              <p className="text-[14px] mb-3 text-gray-900 whitespace-pre-wrap leading-relaxed">{text}</p>
              {hashtags && <p className="text-[14px] text-[#0A66C2] font-black mb-3">{hashtags}</p>}
            </>
          )}
        </div>

        <div className="bg-gray-50 border-y border-gray-50">
          <img src={imageUrl} alt="post" className="w-full max-h-[400px] object-cover hover:brightness-105 transition-all duration-500" />
        </div>

        <div className="px-5 py-3 flex items-center justify-between text-gray-400 text-[11px] font-bold border-b border-gray-50 mx-2">
           <div className="flex items-center gap-1 hover:text-[#0A66C2] transition-colors cursor-pointer">
              <Heart size={14} className="fill-[#0A66C2] text-[#0A66C2]"/>
              1,420 likes
           </div>
           <div className="hover:text-[#0A66C2] transition-colors cursor-pointer">128 comments • 42 reposts</div>
        </div>

        <div className="flex justify-around p-1 text-gray-500 font-bold text-[13px]">
          <div className="flex items-center gap-2 hover:bg-gray-50 py-3.5 px-4 rounded-xl cursor-pointer flex-1 justify-center transition-colors"><Heart size={18}/> Like</div>
          <div className="flex items-center gap-2 hover:bg-gray-50 py-3.5 px-4 rounded-xl cursor-pointer flex-1 justify-center transition-colors"><MessageCircle size={18}/> Comment</div>
          <div className="flex items-center gap-2 hover:bg-gray-50 py-3.5 px-4 rounded-xl cursor-pointer flex-1 justify-center transition-colors"><Share2 size={18}/> Repost</div>
        </div>
      </div>
    );
  }

  // Generic/Facebook
  return (
    <div className={commonClasses}>
      <div className="flex justify-between items-start p-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20">f</div>
          <div>
            <p className="font-bold text-[15px] text-gray-900 leading-tight hover:underline cursor-pointer">{username || "Your Brand"}</p>
            <div className="flex items-center gap-1 text-gray-400 text-[12px] font-bold mt-0.5">
              <span>Just now</span>
              <span>·</span>
              <Globe size={12}/>
            </div>
          </div>
        </div>
        <MoreHorizontal className="text-gray-400" size={20} />
      </div>

      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea 
              className="w-full p-4 text-[15px] border-2 border-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              value={text}
              onChange={(e) => handleChange("text", e.target.value)}
              placeholder="What's on your mind?"
            />
            <input 
              className="w-full p-3 text-[15px] border-2 border-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-[#1877F2] font-bold"
              value={hashtags}
              onChange={(e) => handleChange("hashtags", e.target.value)}
              placeholder="#hashtags"
            />
          </div>
        ) : (
          <>
            <p className="text-[15px] mb-3 text-gray-900 whitespace-pre-wrap leading-relaxed">{text}</p>
            {hashtags && <p className="text-[15px] text-[#1877F2] mb-3 font-medium">{hashtags}</p>}
          </>
        )}
      </div>

      <div className="border-y border-gray-50 overflow-hidden">
        <img src={imageUrl} alt="post" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="px-4 py-3 flex items-center justify-between text-gray-400 text-[13px] font-bold border-b border-gray-50 mx-4">
         <div className="flex items-center gap-1 cursor-pointer hover:underline">
            <div className="bg-[#1877F2] p-1 rounded-full"><Heart size={10} className="text-white fill-white"/></div>
            1.4K
         </div>
         <div className="flex gap-3">
            <span className="hover:underline cursor-pointer">42 Comments</span>
            <span className="hover:underline cursor-pointer">12 Shares</span>
         </div>
      </div>

      <div className="flex justify-between px-4 py-1 text-gray-500 font-bold text-[14px]">
        <div className="flex items-center justify-center gap-2 hover:bg-gray-50 py-3 rounded-xl cursor-pointer flex-1 transition-colors"><Heart size={20}/> Like</div>
        <div className="flex items-center justify-center gap-2 hover:bg-gray-50 py-3 rounded-xl cursor-pointer flex-1 transition-colors"><MessageCircle size={20}/> Comment</div>
        <div className="flex items-center justify-center gap-2 hover:bg-gray-50 py-3 rounded-xl cursor-pointer flex-1 transition-colors"><Share2 size={20}/> Share</div>
      </div>
    </div>
  );
};

const ContentStudio = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewOnlyLibrary, setViewOnlyLibrary] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      if (res.data && res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Cloud data sync failed. Check connection.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [filters, setFilters] = useState({
    category: "",
    platform: "",
    tag: "",
  });

  /* ---------- FILTER ---------- */
  const filteredPosts = posts.filter((p) => {
    const search = searchTerm.toLowerCase();
    const title = p.selectedIdea || "";
    const niche = p.niche || "";
    const socialMedia = p.selectedPlatforms || (p.platforms ? Object.keys(p.platforms) : []);
    
    let tags = [];
    let allText = [];
    if (p.platforms) {
      Object.values(p.platforms).forEach(plat => {
        if (plat?.content?.hashtags) tags = [...tags, ...(Array.isArray(plat.content.hashtags) ? plat.content.hashtags : [])];
        if (plat?.content?.text) allText.push(plat.content.text);
      });
    }

    const combinedString = `${title} ${niche} ${tags.join(" ")} ${allText.join(" ")}`.toLowerCase();
    const matchesSearch = combinedString.includes(search);

    const matchesCategory = filters.category
      ? niche.toLowerCase().includes(filters.category.toLowerCase())
      : true;

    const matchesPlatform = filters.platform
      ? socialMedia.some((pl) => pl.toLowerCase().includes(filters.platform.toLowerCase()))
      : true;

    const matchesTag = filters.tag
      ? tags.some((t) => t.toLowerCase().includes(filters.tag.toLowerCase()))
      : true;

    const matchesLibrary = viewOnlyLibrary ? !p.isScheduled : true;
    return matchesSearch && matchesCategory && matchesPlatform && matchesTag && matchesLibrary;
  });

  const uploadedPosts = filteredPosts.filter((p) => !p.isScheduled);
  const scheduledPosts = filteredPosts.filter((p) => p.isScheduled);

  const handleEditClick = () => {
    if (selectedPost.status === "approved") {
      toast.error("Locked for distribution. Approved posts cannot be edited.");
      return;
    }
    setEditData({ ...selectedPost });
    setIsEditing(true);
  };

  const handleUpdatePost = async (finalStatus = null) => {
    setIsUpdating(true);
    const saveToast = toast.loading(finalStatus === "approved" ? "Approving & Syncing to Cloud..." : "Saving changes...");
    try {
      const statusToSet = finalStatus || editData.status;
      const payload = { ...editData, status: statusToSet };
      
      const res = await api.put(`/posts/${selectedPost._id}`, payload);
      
      if (res.data.success) {
        toast.success(finalStatus === "approved" ? "Campaign Live! Synced to Google Sheets." : "Changes Saved Locally.", { id: saveToast });
        setSelectedPost(res.data.data);
        setIsEditing(false);
        fetchPosts();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed. Check cloud permissions.", { id: saveToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePlatformDataUpdate = (platformName, newData) => {
    setEditData(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [platformName]: newData }
    }));
  };

  /* ---------- PREMIUM CARD ---------- */
  const PostCard = ({ post }) => {
    const imageUrl = (post.creative && post.creative.imageURLs && post.creative.imageURLs.length > 0)
      ? post.creative.imageURLs[0]
      : "https://images.unsplash.com/photo-1611162617474-5b21e879e113";
    
    const isApproved = post.status === "approved";
    const isDraft = post.status === "draft";

    return (
      <motion.div
        {...fadeUp()}
        onClick={() => { setSelectedPost(post); setIsEditing(false); }}
        className="bg-white rounded-[2.5rem] border border-gray-50 shadow-2xl shadow-gray-200/40 hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col group relative"
      >
        <div className="h-56 overflow-hidden relative">
          <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
          {post.creative?.imageURLs?.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/20">
              {post.creative.imageURLs.slice(0, 4).map((url, i) => (
                <div key={i} className="w-6 h-6 rounded-md overflow-hidden border border-white/40">
                  <img src={url} className="w-full h-full object-cover" />
                </div>
              ))}
              {post.creative.imageURLs.length > 4 && <span className="text-[8px] text-white font-bold flex items-center px-1">+{post.creative.imageURLs.length - 4}</span>}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {/* <div className="absolute top-4 left-4 flex gap-1.5">
            {(post.selectedPlatforms || Object.keys(post.platforms || {})).map(p => (
              <div key={p} className="w-8 h-8 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                 <img src={`https://www.google.com/s2/favicons?domain=${p}.com&sz=64`} className="w-4 h-4 brightness-110" alt={p}/>
              </div>
            ))}
          </div> */}

          <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${
            isApproved ? "bg-green-500 text-white" : isDraft ? "bg-amber-400 text-white" : "bg-blue-500 text-white"
          }`}>
            {post.status}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full tracking-widest">{post.niche}</span>
          </div>
          <h3 className="text-lg font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-4">{post.selectedIdea}</h3>
          
          <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2">
               {post.isScheduled ? <Clock size={14} className="text-amber-400"/> : <Zap size={14} className="text-blue-500"/>}
               <span>{post.isScheduled ? "Scheduled" : "Instant"}</span>
             </div>
             <span className="text-gray-900">{post.isScheduled && post.scheduledAt ? formatDateTime(post.scheduledAt.date, post.scheduledAt.time) : "Ready to Fly"}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen px-4 sm:px-10 py-12 bg-[#FBFDFF] text-gray-900 selection:bg-blue-100">
      <AnimatePresence mode="wait">
        {!isCreatingPost && !selectedPost && (
          <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Content Studio</h1>
                <p className="text-lg text-gray-400 font-medium">Your global social media distribution dashboard</p>
              </div>

              <button
                onClick={() => { setIsCreatingPost(true); setViewOnlyLibrary(false); }}
                className="group relative flex items-center gap-3 px-8 py-4 bg-[#01497C] text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                Start New Campaign
              </button>
            </div>

            {/* SEARCH & FILTERS DASHBOARD */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 mb-20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="Deep search campaign keywords, niches, or platform tags..."
                    className="w-full pl-14 pr-6 py-4.5 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all border-2 border-transparent focus:bg-white font-bold text-gray-700 placeholder:text-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className={`px-8 py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest text-[11px] uppercase transition-all ${
                    showAdvanced ? "bg-gray-900 text-white shadow-xl shadow-gray-900/30" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronDown size={18} className={`${showAdvanced ? "rotate-180" : ""} transition-transform duration-500`} />
                  Filter Studio
                </button>
              </div>

              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-50 mt-8">
                  {["category", "platform", "tag"].map((field) => (
                    <div key={field} className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">{field}</label>
                       <input
                        placeholder={`Filter by ${field}...`}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/10 outline-none transition-all font-bold text-gray-700"
                        value={filters[field]}
                        onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-3 flex justify-end">
                    <button onClick={() => setFilters({ category: "", platform: "", tag: "" })} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all">
                      Purge All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* CONTENT SECTIONS */}
            <div className="space-y-24">
              {!viewOnlyLibrary && <section>
                <div className="flex items-center justify-between mb-10 px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-10 bg-amber-400 rounded-full shadow-lg shadow-amber-400/30"/>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Scheduled Automations</h2>
                      <span className="px-4 py-1 bg-amber-50 text-amber-600 text-xs font-black rounded-full shadow-inner">{scheduledPosts.length}</span>
                   </div>
                   <button className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 flex items-center gap-2 transition-colors">View All <ChevronRight size={14}/></button>
                </div>
                {scheduledPosts.length === 0 ? (
                  <div className="bg-white border-4 border-dashed border-gray-50 rounded-[3rem] py-24 text-center">
                     <Calendar className="mx-auto text-gray-100 mb-6" size={80}/>
                     <p className="text-gray-300 font-black text-xl uppercase tracking-widest">No active automations</p>
                     <p className="text-gray-400 mt-2 font-medium">Create a post to see it scheduled here.</p>
                  </div>
                ) : (
                  <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {scheduledPosts.map((post) => <PostCard key={post._id} post={post} />)}
                  </div>
                )}
              </section>}

              <section>
                <div className="flex items-center justify-between mb-10 px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"/>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Asset Library</h2>
                      <span className="px-4 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full shadow-inner">{uploadedPosts.length}</span>
                   </div>
                   <button 
                    onClick={() => setViewOnlyLibrary(!viewOnlyLibrary)} 
                    className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${viewOnlyLibrary ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
                   >
                     {viewOnlyLibrary ? "Show All Posts" : "Manage Library"} <ChevronRight size={14}/>
                   </button>
                </div>
                {uploadedPosts.length === 0 ? (
                  <div className="bg-white border-4 border-dashed border-gray-50 rounded-[3rem] py-24 text-center">
                     <ImageIcon className="mx-auto text-gray-100 mb-6" size={80}/>
                     <p className="text-gray-300 font-black text-xl uppercase tracking-widest">Library Empty</p>
                  </div>
                ) : (
                  <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {uploadedPosts.map((post) => <PostCard key={post._id} post={post} />)}
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        )}

        {isCreatingPost && (
          <motion.div key="create" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-[1400px] mx-auto">
            <div className="flex justify-between items-center mb-10">
               <button onClick={() => setIsCreatingPost(false)} className="group flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gray-900 transition-all bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </button>
              <div className="hidden sm:flex items-center gap-3">
                 <ShieldCheck size={20} className="text-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure AI Environment</span>
              </div>
            </div>
            <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden min-h-[800px]">
               <CreatePost onPostSaved={() => { setIsCreatingPost(false); fetchPosts(); }} />
            </div>
          </motion.div>
        )}

        {selectedPost && (
          <motion.div key="view" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="max-w-[1600px] mx-auto pb-20">
            {/* DETAIL HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
              <button onClick={() => setSelectedPost(null)} className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-gray-900 transition-all bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 self-start">
                <ArrowLeft size={18} /> Exit Preview
              </button>
              
              <div className="flex flex-wrap justify-center gap-4">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-2xl border-2 border-gray-100 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-3"><Ban size={18} /> Abort Changes</button>
                    <button onClick={() => handleUpdatePost()} disabled={isUpdating} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-900/30 hover:bg-blue-700 transition-all flex items-center gap-3">
                      {isUpdating ? "Syncing..." : <><Save size={18} /> Update Content</>}
                    </button>
                  </>
                ) : (
                  selectedPost.status !== "approved" && (
                    <button onClick={handleEditClick} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-gray-900/30 hover:scale-105 transition-all flex items-center gap-3">
                      <Edit2 size={18} /> Modify Campaign
                    </button>
                  )
                )}
                
                {selectedPost.status !== "approved" && (
                  <button onClick={() => handleUpdatePost("approved")} disabled={isUpdating} className="px-10 py-4 bg-green-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-green-900/30 hover:scale-105 hover:bg-green-700 transition-all flex items-center gap-3">
                    {isUpdating ? "Processing..." : <><Rocket size={20} /> Approve & Distribute</>}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden">
              <div className="p-10 lg:p-20 border-b border-gray-50 bg-gray-50/20">
                <div className="flex flex-col xl:flex-row justify-between items-start gap-12">
                  <div className="max-w-4xl space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="px-4 py-1.5 bg-blue-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{selectedPost.niche}</span>
                       <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full ${
                         selectedPost.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700 shadow-inner"
                       }`}>
                         {selectedPost.status}
                       </span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter">{selectedPost.selectedIdea}</h2>
                    <div className="flex flex-wrap gap-8 pt-4">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Publication Status</span>
                         <div className="flex items-center gap-2 font-black text-gray-900"><Calendar size={16} className="text-blue-500"/> {selectedPost.isScheduled ? "Automated Sync" : "On-Demand Release"}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Platforms</span>
                         <div className="flex items-center gap-2 font-black text-gray-900"><ExternalLink size={16} className="text-purple-500"/> {Object.keys(selectedPost.platforms || {}).length} Selected</div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Launch Time</span>
                         <div className="flex items-center gap-2 font-black text-gray-900"><Clock size={16} className="text-amber-500"/> {formatDateTime(selectedPost.scheduledAt?.date, selectedPost.scheduledAt?.time)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPost.status === "approved" && (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-green-50 border-4 border-white shadow-2xl shadow-green-900/10 p-8 rounded-[3rem] flex flex-col items-center gap-4 text-center max-w-sm">
                       <div className="p-4 bg-green-500 text-white rounded-full shadow-xl shadow-green-500/40"><ShieldCheck size={32} strokeWidth={3}/></div>
                       <div>
                         <p className="font-black text-xl text-green-900 uppercase tracking-tighter leading-tight">Post Locked</p>
                         <p className="text-green-700/70 text-sm mt-2 font-bold leading-relaxed">Content has been validated and synced to the global distribution sheet.</p>
                       </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="p-10 lg:p-20 bg-[#FBFDFF]">
                <div className="text-center mb-20 space-y-2">
                   <div className="w-12 h-1 bg-blue-200 mx-auto rounded-full mb-6"/>
                   <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Live Channel Previews</h3>
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Simulated rendering across selected social architectures</p>
                </div>
                
                <div className="flex flex-wrap gap-20 justify-center items-start">
                  {Object.entries(isEditing ? editData.platforms : selectedPost.platforms || {}).map(([platformName, platformData]) => (
                    <div key={platformName} className="flex flex-col items-center group/preview">
                      <SocialMediaMockup 
                        platform={platformName} username={user?.fullName} 
                        data={platformData} 
                        isEditing={isEditing}
                        onUpdate={(newData) => handlePlatformDataUpdate(platformName, newData)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChevronRight = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

export default ContentStudio;

