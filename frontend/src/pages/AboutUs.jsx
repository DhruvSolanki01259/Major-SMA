import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { teamData } from "../data/teamData";

const fadeUp = (delay = 0) => ({
 initial: { opacity: 0, y: 30 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.8, delay, ease:"easeOut" },
});

const AboutUs = () => {
 return (
 <section className="min-h-screen py-24 px-6 bg-[#FBFDFF] font-sans">
 <div className="max-w-6xl mx-auto text-center">
 {/* Hero Section */}
 <motion.div {...fadeUp(0)} className="mb-20">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
 Our Mission
 </div>
 <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#012A4A]">
 Meet the Visionaries Behind{""}
 <span className="text-[#61A5C2]">Social Media Automation</span>
 </h1>
 <p className="text-[#2A6F97] text-sm md:text-base max-w-2xl mx-auto mt-5 font-medium leading-relaxed">
 We’re a passionate team driven by innovation — building intelligent
 automation tools to simplify your online presence management and
 elevate your brand efficiency.
 </p>
 </motion.div>

 {/* Guide Section */}
 <motion.div
 {...fadeUp(0.2)}
 className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/30 p-10 md:p-14 max-w-4xl mx-auto mb-20 text-left flex flex-col md:flex-row items-center gap-10"
 >
 {/* Guide Image */}
 <div className="flex-shrink-0">
 <img
 src={teamData.guide.profileImage}
 alt={teamData.guide.name}
 className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#61A5C2] object-cover shadow-lg mx-auto md:mx-0"
 />
 </div>

 {/* Guide Info */}
 <div className="flex-1 text-center md:text-left">
 <h3 className="text-xl md:text-2xl font-bold text-[#012A4A]">
 {teamData.guide.name}
 </h3>
 <p className="text-[#61A5C2] mt-1 text-sm font-bold uppercase tracking-widest">
 {teamData.guide.designation}
 </p>
 <p className="text-gray-600 mt-4 text-sm leading-relaxed font-medium">
 {teamData.guide.description}
 </p>
 <div className="flex justify-center md:justify-start gap-4 mt-6 text-[#2A6F97]">
 <a href={`mailto:${teamData.guide.email}`} aria-label="Email" className="p-2 bg-blue-50 rounded-xl hover:bg-[#61A5C2] hover:text-white transition-colors">
 <Mail size={18} />
 </a>
 <a
 href={teamData.guide.linkedin}
 target="_blank"
 rel="noopener noreferrer"
 aria-label="LinkedIn"
 className="p-2 bg-blue-50 rounded-xl hover:bg-[#61A5C2] hover:text-white transition-colors"
 >
 <FaLinkedin size={18} />
 </a>
 </div>
 </div>
 </motion.div>

 {/* Team Members */}
 <motion.div {...fadeUp(0.3)} className="mb-12">
 <h2 className="text-2xl font-extrabold text-[#012A4A]">Our Core Team</h2>
 <div className="w-12 h-1 bg-[#61A5C2] mx-auto rounded-full mt-4"/>
 </motion.div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
 {teamData.teamMembers.map((member, idx) => (
 <motion.div
 key={idx}
 {...fadeUp(0.4 + (idx * 0.1))}
 className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 hover:-translate-y-1 transition-all overflow-hidden"
 >
 <div className="h-2 w-full bg-gradient-to-r from-[#01497C] to-[#61A5C2]" />
 <div className="p-8 flex flex-col items-center text-center">
 <img
 src={member.profileImage}
 alt={member.name}
 className="w-24 h-24 rounded-full border-2 border-gray-100 object-cover shadow-sm mb-5"
 />

 <h4 className="text-base font-bold text-[#012A4A]">
 {member.name}
 </h4>
 <p className="text-[#61A5C2] text-[10px] font-black uppercase tracking-widest mt-1 mb-4">
 {member.role}
 </p>
 <p className="text-xs text-gray-500 font-medium leading-relaxed">
 {member.description}
 </p>

 {/* Social Links */}
 <div className="flex justify-center gap-3 mt-6 text-[#2A6F97]">
 <a href={`mailto:${member.email}`} aria-label="Email" className="p-2 bg-gray-50 rounded-lg hover:bg-[#61A5C2] hover:text-white transition-colors">
 <Mail size={16} />
 </a>
 <a
 href={member.linkedin}
 target="_blank"
 rel="noopener noreferrer"
 aria-label="LinkedIn"
 className="p-2 bg-gray-50 rounded-lg hover:bg-[#61A5C2] hover:text-white transition-colors"
 >
 <FaLinkedin size={16} />
 </a>
 <a
 href={member.github}
 target="_blank"
 rel="noopener noreferrer"
 aria-label="GitHub"
 className="p-2 bg-gray-50 rounded-lg hover:bg-[#61A5C2] hover:text-white transition-colors"
 >
 <FaGithub size={16} />
 </a>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
};

export default AboutUs;