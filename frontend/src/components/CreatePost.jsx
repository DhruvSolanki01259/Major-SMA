import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, Layout, Palette, 
  Calendar, Rocket, Send, Image as ImageIcon, MessageSquare, 
  Camera, Globe, Briefcase, Target, Lightbulb, Zap, Info, Clock
} from "lucide-react";
import ScheduleStep from "./ScheduleStep";
import axios from "axios";

/* ---------- COLOR PALETTES ---------- */
const colorPalettes = [
  { name: "Oceanic", colors: ["#0F172A", "#1E293B", "#38BDF8"] },
  { name: "Sunset", colors: ["#111827", "#F59E0B", "#EF4444"] },
  { name: "Corporate", colors: ["#1E3A8A", "#3B82F6", "#93C5FD"] },
  { name: "Forest", colors: ["#064E3B", "#10B981", "#A7F3D0"] },
  { name: "Lavender", colors: ["#7C3AED", "#A78BFA", "#EDE9FE"] },
];

const steps = [
  { label: "Goal", icon: <Target size={18} /> },
  { label: "Brainstorm", icon: <Lightbulb size={18} /> },
  { label: "Creative", icon: <Palette size={18} /> },
  { label: "Time", icon: <Calendar size={18} /> },
  { label: "Launch", icon: <Rocket size={18} /> },
];

const CreatePost = ({ onPostSaved }) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [postContent, setPostContent] = useState({
    niche: "",
    selectedIdea: "",
    creative: {
      imageColors: [],
      imageNotes: "",
    },
    platforms: {
      twitter: {},
      facebook: {},
      instagram: {},
      linkedin: {},
    },
    scheduledAt: null,
    isScheduled: false,
    status: "draft",
  });

  const canProceed = () => {
    if (step === 0) return postContent.niche.trim().length > 2;
    if (step === 1) return postContent.selectedIdea;
    if (step === 2) return selectedPlatforms.length > 0 && postContent.creative.imageColors.length >= 2;
    return true;
  };

  const next = async () => {
    if (!canProceed() || isLoading) return;

    if (step === 0) {
      setIsLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/api/content/generate", { niche: postContent.niche });
        if (res.data && res.data.data) {
          setIdeas(res.data.data);
          setStep(1);
        }
      } catch (error) {
        toast.error("AI Brainstorming failed. Using fallbacks.");
        setIdeas(["The Future of " + postContent.niche, "Mastering " + postContent.niche, "Secrets to " + postContent.niche]);
        setStep(1);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (step === 2) {
      setIsLoading(true);
      const loadToast = toast.loading("AI is crafting your posts & initial images...");
      try {
        const res = await axios.post("http://localhost:8000/api/content/generatePostContent", {
          niche: postContent.niche,
          selectedIdea: postContent.selectedIdea,
          platforms: selectedPlatforms,
          imageNotes: postContent.creative.imageNotes,
          imageColors: postContent.creative.imageColors
        });

        const generatedData = res.data.data;
        const updated = {};
        selectedPlatforms.forEach((p) => {
          updated[p] = {
            content: {
              text: generatedData[p]?.text || "",
              hashtags: generatedData[p]?.hashtags || []
            },
            imagePrompt: generatedData[p]?.imagePrompt || "",
            mediaUrl: generatedData[p]?.mediaUrl || ""
          };
        });

        setPostContent(prev => ({ ...prev, platforms: updated }));
        toast.success("Content & Preview Images Ready!", { id: loadToast });
        setStep(3);
      } catch (error) {
        toast.error("Generation failed. Please try again.", { id: loadToast });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setStep(prev => prev + 1);
  };

  const finalize = async () => {
    setIsLoading(true);
    const finalizeToast = toast.loading("Finalizing campaign and generating all platform assets...");
    try {
      const payload = { ...postContent, selectedPlatforms };
      const res = await axios.post("http://localhost:8000/api/posts", payload);
      if (res.data.success) {
        toast.success("Campaign Launched Successfully!", { id: finalizeToast });
        if (onPostSaved) onPostSaved();
      }
    } catch (error) {
      toast.error("Failed to launch campaign.", { id: finalizeToast });
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    { id: "instagram", icon: <Camera size={20} />, color: "bg-gradient-to-tr from-[#FFDC80] to-[#C13584]" },
    { id: "twitter", icon: <MessageSquare size={20} />, color: "bg-[#1DA1F2]" },
    { id: "facebook", icon: <Globe size={20} />, color: "bg-[#1877F2]" },
    { id: "linkedin", icon: <Briefcase size={20} />, color: "bg-[#0A66C2]" },
  ];

  return (
    <div className="w-full bg-white">
      {/* STEPPER */}
      <div className="px-8 py-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex justify-between">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group relative">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                i === step ? "bg-[#01497C] text-white scale-110 shadow-blue-200" : 
                i < step ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-400"
              }`}>
                {i < step ? <Check size={20} strokeWidth={3} /> : s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${i === step ? "text-[#01497C]" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`absolute left-14 top-5 w-16 h-0.5 hidden sm:block ${i < step ? "bg-green-200" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: NICHE */}
          {step === 0 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full">Phase 01: Defining Your Reach</div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">What's your niche?</h2>
                <p className="text-gray-500 max-w-lg mx-auto font-medium">Tell our AI your industry or topic, and we'll generate high-impact viral content ideas for you.</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-20 transition-opacity" />
                <input
                  className="relative w-full text-2xl font-bold px-8 py-10 bg-white border-2 border-gray-100 rounded-[2rem] focus:outline-none focus:border-blue-500 transition-all text-center placeholder:text-gray-200"
                  placeholder="e.g. Sustainable Fashion, AI Tech, Vegan Diet..."
                  value={postContent.niche}
                  onChange={(e) => setPostContent({ ...postContent, niche: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && next()}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { title: "Personal Brand", desc: "Share your journey and expertise", icon: <Zap size={18} className="text-amber-500" /> },
                  { title: "E-Commerce", desc: "Showcase products and lifestyle", icon: <Rocket size={18} className="text-blue-500" /> },
                  { title: "Education", desc: "Teach tips and industry hacks", icon: <Sparkles size={18} className="text-purple-500" /> },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: IDEAS */}
          {step === 1 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">Phase 02: Brainstorming</div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Pick a Winning Idea</h2>
                <p className="text-gray-500 max-w-lg mx-auto font-medium">Select the concept that resonates most with your audience. We'll build the campaign around it.</p>
              </div>

              <div className="grid gap-4">
                {ideas.map((ideaObj, i) => {
                  const ideaText = typeof ideaObj === "object" ? (ideaObj.idea || ideaObj.title || ideaObj.text || JSON.stringify(ideaObj)) : ideaObj;
                  const isSelected = postContent.selectedIdea === ideaText;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setPostContent({ ...postContent, selectedIdea: ideaText })}
                      className={`group cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
                        isSelected ? "border-[#2A6F97] bg-blue-50/30 shadow-lg shadow-blue-900/5" : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      {isSelected && <div className="absolute top-0 right-0 p-3 bg-[#2A6F97] text-white rounded-bl-2xl"><Check size={16} strokeWidth={4} /></div>}
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-[#2A6F97] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500"}`}>
                          <Sparkles size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Viral Hook Idea #{i + 1}</p>
                          <p className={`text-lg font-bold leading-snug ${isSelected ? "text-[#012A4A]" : "text-gray-700"}`}>{ideaText}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CREATIVE */}
          {step === 2 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full">Phase 03: Visual Identity</div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Creative Setup</h2>
                <p className="text-gray-500 max-w-lg mx-auto font-medium">Select your target platforms and define the visual aesthetic of your campaign.</p>
              </div>

              {/* PLATFORMS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">
                  <Layout size={14}/> Target Platforms
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {platforms.map((p) => {
                    const isSelected = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                        className={`group relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          isSelected ? `border-[#01497C] bg-blue-50/50 shadow-lg shadow-blue-900/5` : "border-gray-50 hover:border-gray-200 bg-white"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${p.color} ${!isSelected && "opacity-40 grayscale"}`}>
                          {p.icon}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-[#01497C]" : "text-gray-400"}`}>{p.id}</span>
                        {isSelected && <div className="absolute top-2 right-2 w-5 h-5 bg-[#01497C] text-white rounded-full flex items-center justify-center border-2 border-white"><Check size={10} strokeWidth={4}/></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLORS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 px-1">
                  <Palette size={14}/> Brand Palette
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {colorPalettes.map((p, i) => {
                      const isSelected = JSON.stringify(postContent.creative.imageColors) === JSON.stringify(p.colors);
                      return (
                        <button
                          key={i}
                          onClick={() => setPostContent({ ...postContent, creative: { ...postContent.creative, imageColors: p.colors }})}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            isSelected ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-gray-50 hover:border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex gap-1.5">
                            {p.colors.map((c, idx) => <div key={idx} className="w-8 h-8 rounded-lg shadow-sm" style={{ background: c }} />)}
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-gray-500"}`}>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 flex flex-col h-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Custom Color Input</p>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-700"
                      placeholder="Enter colors (Blue, Gold...)"
                      value={postContent.creative.imageColors.join(", ")}
                      onChange={(e) => setPostContent({ ...postContent, creative: { ...postContent.creative, imageColors: e.target.value.split(",").map(c => c.trim()).filter(Boolean) }})}
                    />
                    <div className="mt-auto pt-6">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Creative Style Notes</p>
                       <textarea
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px]"
                        placeholder="e.g. Minimalist design, bold typography, cinematic lighting..."
                        value={postContent.creative.imageNotes}
                        onChange={(e) => setPostContent({ ...postContent, creative: { ...postContent.creative, imageNotes: e.target.value }})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SCHEDULE */}
          {step === 3 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ScheduleStep postData={postContent} setPostData={setPostContent} />
            </motion.div>
          )}

          {/* STEP 5: FINALIZE */}
          {step === 4 && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-10">
               <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">Final Phase: Launch</div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ready to Launch?</h2>
                <p className="text-gray-500 max-w-lg mx-auto font-medium">Review your campaign one last time. Our AI has crafted everything for you.</p>
              </div>

              <div className="grid gap-6">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/40 overflow-hidden">
                   <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#2A6F97] text-white text-[10px] font-black tracking-widest rounded-full uppercase">{postContent.niche}</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest rounded-full uppercase">Draft</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight">{postContent.selectedIdea}</h3>
                   </div>
                   
                   <div className="p-8 grid sm:grid-cols-3 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Target Platforms</p>
                        <div className="flex gap-2">
                           {selectedPlatforms.map(p => (
                             <div key={p} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm">
                               {platforms.find(pl => pl.id === p)?.icon}
                             </div>
                           ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Publish Time</p>
                        <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                           <Clock size={16} className="text-blue-500"/>
                           {postContent.scheduledAt ? `${postContent.scheduledAt.date} at ${postContent.scheduledAt.time}` : "Auto: 10 mins"}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Visual Style</p>
                        <div className="flex gap-1.5">
                           {postContent.creative.imageColors.map((c, i) => <div key={i} className="w-6 h-6 rounded-md shadow-sm" style={{ background: c }} />)}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-900 text-white p-8 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 shadow-2xl shadow-blue-900/40">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Zap size={32} className="text-blue-300" />
                   </div>
                   <div className="text-center sm:text-left">
                      <p className="font-black text-xl mb-1">AI Automation is Enabled</p>
                      <p className="text-blue-200/80 text-sm font-medium">Click launch to generate full platform assets, resize images, and queue posts for automatic publishing.</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
          <button
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 0 || isLoading}
            className="flex items-center gap-2 px-6 py-3 font-bold text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-0"
          >
            <ChevronLeft size={20} /> Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={next}
              disabled={!canProceed() || isLoading}
              className="group flex items-center gap-3 px-8 py-4 bg-[#01497C] text-white rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Processing...
                </div>
              ) : (
                <>Next Step <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          ) : (
            <button 
              onClick={finalize}
              disabled={isLoading}
              className="flex items-center gap-3 px-10 py-5 bg-green-600 text-white rounded-[1.5rem] font-black shadow-lg shadow-green-900/20 hover:shadow-green-900/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Launching..." : <><Send size={20} /> Launch Campaign</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
