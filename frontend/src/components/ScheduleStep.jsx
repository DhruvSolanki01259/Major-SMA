import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, BrainCircuit, Check, ChevronLeft, ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.25 },
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const ScheduleStep = ({ postData, setPostData }) => {
  const today = new Date();

  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleType, setScheduleType] = useState("manual");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const calendarRef = useRef(null);
  const timeRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const years = [];
  for (let i = today.getFullYear(); i <= today.getFullYear() + 5; i++) {
    years.push(i);
  }

  /* ---------- CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false);
      if (timeRef.current && !timeRef.current.contains(e.target)) setTimeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- AUTO POST ---------- */
  useEffect(() => {
    if (!scheduleEnabled) {
      const now = new Date();
      const autoTime = new Date(now.getTime() + 10 * 60000);
      const date = formatLocalDate(autoTime);
      const h = String(autoTime.getHours()).padStart(2, "0");
      const m = String(autoTime.getMinutes()).padStart(2, "0");

      setPostData((prev) => ({
        ...prev,
        isScheduled: false,
        scheduledAt: { type: "auto", date, time: `${h}:${m}` },
      }));
    }
  }, [scheduleEnabled, setPostData]);

  /* ---------- CALENDAR LOGIC ---------- */
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  const isPastDate = (date) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return date < start;
  };

  const updateSchedule = (date, h, m) => {
    if (!date || !h || !m) return;
    setPostData((prev) => ({
      ...prev,
      isScheduled: true,
      scheduledAt: { type: "manual", date: formatLocalDate(date), time: `${h}:${m}` },
    }));
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    setCalendarOpen(false);
    if (hour && minute) updateSchedule(date, hour, minute);
  };

  const handleHourChange = (h) => {
    setHour(h);
    if (selectedDate && minute) updateSchedule(selectedDate, h, minute);
  };

  const handleMinuteChange = (m) => {
    setMinute(m);
    if (selectedDate && hour) updateSchedule(selectedDate, hour, m);
  };

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutesList = ["00", "15", "30", "45"];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full">Phase 04: Timing & Logic</div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Scheduling Control</h2>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">Decide whether to publish instantly with our 10-minute lead time or queue it for a perfect moment.</p>
      </div>

      {/* ENABLE TOGGLE */}
      <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6 ${scheduleEnabled ? "border-[#2A6F97] bg-blue-50/30" : "border-gray-100 bg-white"}`}>
        <div className="flex items-center gap-5">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${scheduleEnabled ? "bg-[#2A6F97] text-white" : "bg-gray-100 text-gray-400"}`}>
              <Clock size={28} />
           </div>
           <div>
              <p className="font-black text-xl text-gray-900">Custom Scheduling</p>
              <p className="text-sm text-gray-500 font-medium">{scheduleEnabled ? "Custom time is active" : "Using auto-publish (10 min lead time)"}</p>
           </div>
        </div>

        <button
          onClick={() => setScheduleEnabled(!scheduleEnabled)}
          className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${scheduleEnabled ? "bg-[#2A6F97]" : "bg-gray-200"}`}
        >
          <motion.div
            layout
            className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center"
            animate={{ x: scheduleEnabled ? 40 : 0 }}
          >
            {scheduleEnabled && <Check size={16} className="text-[#2A6F97]" strokeWidth={3} />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {scheduleEnabled && (
          <motion.div key="options" {...fadeUp} className="space-y-8">
            {/* TYPE SWITCH */}
            <div className="flex p-2 bg-gray-100 rounded-[2rem] max-w-md mx-auto">
              {["manual", "analytical"].map((type) => (
                <button
                  key={type}
                  onClick={() => setScheduleType(type)}
                  className={`flex-1 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all ${
                    scheduleType === type ? "bg-white text-[#01497C] shadow-lg shadow-blue-900/10" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {type === "manual" ? <Calendar size={16} /> : <BrainCircuit size={16} />}
                  {type === "manual" ? "Manual Pick" : "Smart AI"}
                </button>
              ))}
            </div>

            {/* MANUAL PICKER */}
            {scheduleType === "manual" && (
              <motion.div {...fadeUp} className="grid md:grid-cols-2 gap-8">
                {/* DATE SELECTOR */}
                <div className="space-y-3" ref={calendarRef}>
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Publish Date</label>
                   <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full flex items-center justify-between p-6 bg-white border-2 border-gray-50 rounded-3xl hover:border-blue-200 transition-all text-left shadow-sm group"
                   >
                     <div className="flex items-center gap-4">
                        <Calendar className="text-blue-500" size={24} />
                        <span className="font-bold text-gray-900">{selectedDate ? formatDate(selectedDate) : "Select a date..."}</span>
                     </div>
                     <ChevronRight size={20} className={`text-gray-300 group-hover:text-blue-500 transition-transform ${calendarOpen ? "rotate-90" : ""}`} />
                   </button>

                   <AnimatePresence>
                     {calendarOpen && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-30 mt-2 w-full max-w-[350px] bg-white rounded-[2rem] border-2 border-gray-50 shadow-2xl p-6">
                          <div className="flex justify-between items-center mb-6">
                             <button onClick={() => setMonth(m => m === 0 ? 11 : m - 1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronLeft size={18}/></button>
                             <div className="flex flex-col items-center">
                                <span className="font-black text-gray-900">{months[month]}</span>
                                <span className="text-[10px] font-bold text-gray-400">{year}</span>
                             </div>
                             <button onClick={() => setMonth(m => m === 11 ? 0 : m + 1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight size={18}/></button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                             {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                             {calendarDays.map((date, i) => {
                               if (!date) return <div key={i} />;
                               const disabled = isPastDate(date);
                               const isSelected = selectedDate && formatLocalDate(date) === formatLocalDate(selectedDate);
                               return (
                                 <button
                                   key={i}
                                   disabled={disabled}
                                   onClick={() => handleDateSelect(date)}
                                   className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                                     isSelected ? "bg-[#2A6F97] text-white shadow-lg" : 
                                     disabled ? "text-gray-100 cursor-not-allowed" : "text-gray-700 hover:bg-blue-50"
                                   }`}
                                 >
                                   {date.getDate()}
                                 </button>
                               );
                             })}
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* TIME SELECTOR */}
                <div className="space-y-3" ref={timeRef}>
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Publish Time</label>
                   <button
                    onClick={() => setTimeOpen(!timeOpen)}
                    className="w-full flex items-center justify-between p-6 bg-white border-2 border-gray-50 rounded-3xl hover:border-blue-200 transition-all text-left shadow-sm group"
                   >
                     <div className="flex items-center gap-4">
                        <Clock className="text-blue-500" size={24} />
                        <span className="font-bold text-gray-900">{hour && minute ? `${hour}:${minute}` : "Select a time..."}</span>
                     </div>
                     <ChevronRight size={20} className={`text-gray-300 group-hover:text-blue-500 transition-transform ${timeOpen ? "rotate-90" : ""}`} />
                   </button>

                   <AnimatePresence>
                     {timeOpen && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-30 mt-2 w-full max-w-[300px] bg-white rounded-[2rem] border-2 border-gray-50 shadow-2xl flex overflow-hidden">
                          <div className="flex-1 max-h-[300px] overflow-y-auto scrollbar-hide py-4 border-r border-gray-50">
                             <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hour</div>
                             {hoursList.map(h => (
                               <button key={h} onClick={() => handleHourChange(h)} className={`w-full py-3 px-6 text-left font-bold text-sm transition-colors ${hour === h ? "bg-blue-50 text-[#2A6F97]" : "text-gray-700 hover:bg-gray-50"}`}>
                                 {h}
                               </button>
                             ))}
                          </div>
                          <div className="flex-1 max-h-[300px] overflow-y-auto scrollbar-hide py-4">
                             <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Min</div>
                             {minutesList.map(m => (
                               <button key={m} onClick={() => handleMinuteChange(m)} className={`w-full py-3 px-6 text-left font-bold text-sm transition-colors ${minute === m ? "bg-blue-50 text-[#2A6F97]" : "text-gray-700 hover:bg-gray-50"}`}>
                                 :{m}
                               </button>
                             ))}
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* AI MODE */}
            {scheduleType === "analytical" && (
              <motion.div {...fadeUp} className="p-12 rounded-[3rem] text-center border-2 border-blue-50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-900/5 flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <BrainCircuit size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI Smart Scheduler</h3>
                <p className="text-gray-500 mt-3 font-medium max-w-sm mx-auto">We'll analyze your historical audience engagement and competitor activity to pick the peak performing minute for this post.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleStep;
