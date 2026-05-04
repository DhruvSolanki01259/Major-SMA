import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScheduleStep from "./ScheduleStep";

/* ---------- MOCK IDEAS ---------- */
const mockIdeas = [
  "Top 5 AI tools for your niche",
  "Beginner guide to grow in this niche",
  "Mistakes to avoid in this niche",
];

/* ---------- COLOR PALETTES ---------- */
const colorPalettes = [
  ["#0F172A", "#1E293B", "#38BDF8"],
  ["#111827", "#F59E0B", "#EF4444"],
  ["#1E3A8A", "#3B82F6", "#93C5FD"],
  ["#064E3B", "#10B981", "#A7F3D0"],
  ["#7C3AED", "#A78BFA", "#EDE9FE"],
];

/* ---------- STEPS ---------- */
const steps = ["Niche", "Idea", "Creative", "Schedule", "Finalize"];

const CreatePost = () => {
  const [step, setStep] = useState(0);

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
  console.log(postContent);

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  /* ---------- VALIDATION ---------- */
  const canProceed = () => {
    if (step === 0) return postContent.niche.trim();
    if (step === 1) return postContent.selectedIdea;
    if (step === 2)
      return (
        selectedPlatforms.length > 0 &&
        postContent.creative.imageColors.length >= 2
      );
    return true;
  };

  /* ---------- STEP SAVE ---------- */
  const next = () => {
    if (!canProceed()) return;

    if (step === 2) {
      const updated = {};
      selectedPlatforms.forEach((p) => {
        updated[p] = {};
      });

      setPostContent((prev) => ({
        ...prev,
        platforms: updated,
      }));
    }

    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  /* ---------- UI ---------- */
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* STEPPER */}
      <div className="flex justify-between mb-10">
        {steps.map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                i <= step
                  ? "bg-[#2A6F97] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <p className="text-xs mt-2">{label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <MotionWrapper key={step}>
          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#012A4A]">
                Enter Your Niche
              </h2>

              <input
                className="w-full border p-4 rounded-xl"
                placeholder="e.g. Fitness, AI, Marketing..."
                value={postContent.niche}
                onChange={(e) =>
                  setPostContent({
                    ...postContent,
                    niche: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#012A4A]">
                Select Content Idea
              </h2>

              <select
                className="w-full border p-4 rounded-xl"
                value={postContent.selectedIdea}
                onChange={(e) =>
                  setPostContent({
                    ...postContent,
                    selectedIdea: e.target.value,
                  })
                }
              >
                <option value="">Choose an idea</option>
                {mockIdeas.map((idea, i) => (
                  <option key={i} value={idea}>
                    {idea}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-[#012A4A]">
                Platforms & Creative Setup
              </h2>

              {/* PLATFORMS */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Select platforms</p>

                <div className="flex flex-wrap gap-3">
                  {["twitter", "facebook", "instagram", "linkedin"].map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setSelectedPlatforms((prev) =>
                          prev.includes(p)
                            ? prev.filter((x) => x !== p)
                            : [...prev, p],
                        )
                      }
                      className={`px-4 py-2 rounded-xl border capitalize ${
                        selectedPlatforms.includes(p)
                          ? "bg-[#2A6F97] text-white"
                          : "hover:border-[#2A6F97]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR PALETTES */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Choose color style</p>

                {colorPalettes.map((palette, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setPostContent({
                        ...postContent,
                        creative: {
                          ...postContent.creative,
                          imageColors: palette,
                        },
                      })
                    }
                    className={`flex items-center gap-3 p-3 border rounded-xl w-full mb-2 ${
                      JSON.stringify(postContent.creative.imageColors) ===
                      JSON.stringify(palette)
                        ? "border-[#2A6F97] bg-blue-50"
                        : "hover:border-[#2A6F97]"
                    }`}
                  >
                    <div className="flex gap-1">
                      {palette.map((c, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded"
                          style={{ background: c }}
                        />
                      ))}
                    </div>

                    <span className="text-sm">Palette {i + 1}</span>
                  </button>
                ))}
              </div>

              {/* IMAGE NOTES */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Image Instructions</p>

                <textarea
                  className="w-full border p-3 rounded-xl"
                  placeholder="Minimal, bold, modern design..."
                  value={postContent.creative.imageNotes}
                  onChange={(e) =>
                    setPostContent({
                      ...postContent,
                      creative: {
                        ...postContent.creative,
                        imageNotes: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <ScheduleStep postData={postContent} setPostData={setPostContent} />
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#012A4A]">
                Final Review
              </h2>

              {/* CORE */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold mb-2">Core</h3>

                <input
                  className="border p-2 rounded w-full mb-2"
                  value={postContent.niche}
                  onChange={(e) =>
                    setPostContent({
                      ...postContent,
                      niche: e.target.value,
                    })
                  }
                />

                <textarea
                  className="border p-2 rounded w-full"
                  value={postContent.selectedIdea}
                  onChange={(e) =>
                    setPostContent({
                      ...postContent,
                      selectedIdea: e.target.value,
                    })
                  }
                />
              </div>

              {/* PLATFORMS */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold mb-2">Platforms</h3>

                <div className="flex gap-2 flex-wrap">
                  {Object.keys(postContent.platforms).map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* COLORS */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold mb-2">Colors</h3>

                <div className="flex gap-2">
                  {postContent.creative.imageColors.map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded"
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <textarea
                  className="border p-2 rounded w-full mt-3"
                  value={postContent.creative.imageNotes}
                  onChange={(e) =>
                    setPostContent({
                      ...postContent,
                      creative: {
                        ...postContent.creative,
                        imageNotes: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* SCHEDULE */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold mb-2">Schedule</h3>

                {postContent.scheduledAt ? (
                  <p>
                    {postContent.scheduledAt.date} at{" "}
                    {postContent.scheduledAt.time}
                  </p>
                ) : (
                  <p className="text-gray-500">Auto publish enabled</p>
                )}
              </div>
            </div>
          )}
        </MotionWrapper>
      </AnimatePresence>

      {/* NAV */}
      <div className="flex justify-between mt-10">
        <button
          onClick={back}
          disabled={step === 0}
          className="px-5 py-2 border rounded"
        >
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={next}
            disabled={!canProceed()}
            className="px-6 py-2 bg-[#2A6F97] text-white rounded"
          >
            Next
          </button>
        ) : (
          <button className="px-6 py-2 bg-green-600 text-white rounded">
            Save Post
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

/* ---------- MOTION ---------- */
const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
