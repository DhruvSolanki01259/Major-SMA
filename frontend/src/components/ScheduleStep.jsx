import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, BrainCircuit, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.25 },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
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
  for (let i = today.getFullYear(); i <= today.getFullYear() + 10; i++) {
    years.push(i);
  }

  /* ---------- CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setTimeOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- AUTO POST ---------- */
  useEffect(() => {
    if (!scheduleEnabled) {
      const now = new Date();
      const autoTime = new Date(now.getTime() + 5 * 60000);

      const date = formatLocalDate(autoTime);
      const h = String(autoTime.getHours()).padStart(2, "0");
      const m = String(autoTime.getMinutes()).padStart(2, "0");

      setPostData((prev) => ({
        ...prev,
        isScheduled: false,
        scheduledAt: {
          type: "auto",
          date,
          time: `${h}:${m}`,
        },
      }));
    }
  }, [scheduleEnabled, setPostData]);

  /* ---------- CALENDAR ---------- */
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const isPastDate = (date) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return date < start;
  };

  /* ---------- UPDATE ---------- */
  const updateSchedule = (date, h, m) => {
    if (!date || !h || !m) return;

    const selected = new Date(date);
    selected.setHours(h, m);

    if (selected < new Date()) return;

    setPostData((prev) => ({
      ...prev,
      isScheduled: true,
      scheduledAt: {
        type: "manual",
        date: formatLocalDate(date),
        time: `${h}:${m}`,
      },
    }));
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    setCalendarOpen(false);
    updateSchedule(date, hour, minute);
  };

  const handleHourChange = (h) => {
    setHour(h);
    if (minute) {
      updateSchedule(selectedDate, h, minute);
      setTimeOpen(false);
    }
  };

  const handleMinuteChange = (m) => {
    setMinute(m);
    if (hour) {
      updateSchedule(selectedDate, hour, m);
      setTimeOpen(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const minutes = ["00", "15", "30", "45"];

  const isPastTime = (h, m) => {
    if (!selectedDate) return false;

    const now = new Date();
    const selected = new Date(selectedDate);

    selected.setHours(h);
    selected.setMinutes(m);

    return selected < now;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#012A4A]">
          Schedule Your Post
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Choose when your content should go live
        </p>
      </div>

      {/* TOGGLE CARD */}
      <div className="p-6 rounded-2xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#012A4A] text-lg">
            Enable Scheduling
          </p>
          <p className="text-sm text-gray-500">
            Toggle to pick a custom publish time
          </p>
        </div>

        <button
          onClick={() => setScheduleEnabled(!scheduleEnabled)}
          className={`relative w-14 h-7 rounded-full transition ${
            scheduleEnabled ? "bg-[#2A6F97]" : "bg-gray-300"
          }`}
        >
          <motion.div
            layout
            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
            animate={{ x: scheduleEnabled ? 28 : 0 }}
          >
            {scheduleEnabled && <Check size={12} />}
          </motion.div>
        </button>
      </div>

      {/* AUTO MODE */}
      {!scheduleEnabled && (
        <motion.div {...fadeUp} className="p-6 rounded-2xl border bg-[#F4F9FD]">
          <p className="text-gray-700">
            Your post will be published automatically in{" "}
            <span className="font-semibold text-[#2A6F97]">5 minutes</span>.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {scheduleEnabled && (
          <motion.div {...fadeUp} className="space-y-6">
            {/* MODE SWITCH */}
            <div className="flex rounded-xl overflow-hidden border">
              {["manual", "analytical"].map((type) => (
                <button
                  key={type}
                  onClick={() => setScheduleType(type)}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium ${
                    scheduleType === type
                      ? "bg-[#2A6F97] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {type === "manual" ? (
                    <Calendar size={16} />
                  ) : (
                    <BrainCircuit size={16} />
                  )}
                  {type === "manual" ? "Manual" : "Smart AI"}
                </button>
              ))}
            </div>

            {/* MANUAL PICKER */}
            {scheduleType === "manual" && (
              <motion.div
                {...fadeUp}
                className="grid sm:grid-cols-2 gap-6 p-6 rounded-2xl border bg-white shadow-sm"
              >
                {/* DATE */}
                <div className="relative" ref={calendarRef}>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Select Date
                  </label>

                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full p-3 rounded-lg border bg-gray-50 text-left"
                  >
                    {selectedDate ? formatDate(selectedDate) : "Choose date"}
                  </button>

                  {calendarOpen && (
                    <div className="absolute z-20 mt-2 p-4 w-72 rounded-xl border bg-white shadow-lg">
                      <div className="flex gap-2 mb-4">
                        <select
                          value={month}
                          onChange={(e) => setMonth(Number(e.target.value))}
                          className="flex-1 p-2 border rounded"
                        >
                          {months.map((m, i) => (
                            <option key={i} value={i}>
                              {m}
                            </option>
                          ))}
                        </select>

                        <select
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="flex-1 p-2 border rounded"
                        >
                          {years.map((y) => (
                            <option key={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-sm">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div key={d} className="text-center text-gray-400">
                            {d}
                          </div>
                        ))}

                        {calendarDays.map((date, i) => {
                          if (!date) return <div key={i} />;

                          const disabled = isPastDate(date);

                          return (
                            <button
                              key={i}
                              disabled={disabled}
                              onClick={() => handleDateSelect(date)}
                              className={`p-2 rounded-md ${
                                disabled
                                  ? "text-gray-300"
                                  : "hover:bg-[#2A6F97] hover:text-white"
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* TIME */}
                <div className="relative" ref={timeRef}>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Select Time
                  </label>

                  <button
                    onClick={() => setTimeOpen(!timeOpen)}
                    className="w-full p-3 rounded-lg border bg-gray-50 text-left"
                  >
                    {hour && minute ? `${hour}:${minute}` : "Choose time"}
                  </button>

                  {timeOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow-lg flex">
                      <div className="w-1/2 max-h-56 overflow-y-auto">
                        {hours.map((h) => {
                          const disabled = isPastTime(h, minute || "00");

                          return (
                            <button
                              key={h}
                              disabled={disabled}
                              onClick={() => handleHourChange(h)}
                              className={`w-full px-4 py-2 text-left ${
                                disabled
                                  ? "text-gray-300"
                                  : "hover:bg-[#2A6F97] hover:text-white"
                              } ${hour === h ? "bg-[#2A6F97] text-white" : ""}`}
                            >
                              {h}
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-1/2 max-h-56 overflow-y-auto">
                        {minutes.map((m) => {
                          const disabled = isPastTime(hour || "00", m);

                          return (
                            <button
                              key={m}
                              disabled={disabled}
                              onClick={() => handleMinuteChange(m)}
                              className={`w-full px-4 py-2 text-left ${
                                disabled
                                  ? "text-gray-300"
                                  : "hover:bg-[#2A6F97] hover:text-white"
                              } ${
                                minute === m ? "bg-[#2A6F97] text-white" : ""
                              }`}
                            >
                              :{m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AI MODE */}
            {scheduleType === "analytical" && (
              <motion.div
                {...fadeUp}
                className="p-8 rounded-2xl text-center border bg-gradient-to-br from-[#EAF4FB] to-[#F5FAFD]"
              >
                <BrainCircuit size={36} className="mx-auto text-[#2A6F97]" />
                <h3 className="text-lg font-semibold mt-3 text-[#013A63]">
                  Smart Scheduling
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  We'll automatically pick the best time based on audience
                  activity.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleStep;
