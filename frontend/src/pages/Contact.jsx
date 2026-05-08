import React, { useState } from"react";
import { motion } from"framer-motion";
import { Mail, Phone, MapPin, Send } from"lucide-react";
import { useAuthStore } from"../store/auth.store";
import axios from"axios";
import { toast } from"react-hot-toast";

const fadeUp = (delay = 0) => ({
 initial: { opacity: 0, y: 30 },
 animate: { opacity: 1, y: 0 },
 transition: { duration: 0.8, delay, ease:"easeOut" },
});

const Contact = () => {
 const { user } = useAuthStore();
 const [name, setName] = useState(user?.name ||"");
 const [email, setEmail] = useState(user?.email ||"");
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);

 const API_URL = import.meta.env.VITE_BACKEND_API_URL ||"http://localhost:8000";

 const handleSubmit = async (e) => {
 e.preventDefault();

 if (!name.trim() || !email.trim() || !message.trim()) {
 toast.error("Please fill in all fields!");
 return;
 }

 try {
 setLoading(true);

 // Note: Endpoint may vary based on backend. Using standard axios post.
 const res = await axios.post(
 `${API_URL}/api/user/contact`,
 { name, email, message },
 { withCredentials: true }
 );

 if (res.data?.success) {
 toast.success("Message sent successfully! 🚀");
 setMessage("");
 } else {
 toast.error(res.data?.message ||"Failed to send message.");
 }
 } catch (error) {
 console.error("Contact Error:", error);
 toast.error(error.response?.data?.message ||"Something went wrong. Please try again.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <section className="min-h-screen py-24 px-6 bg-[#FBFDFF] font-sans">
 <div className="max-w-5xl mx-auto text-center">
 <motion.div {...fadeUp(0)} className="mb-20">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2A6F97] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
 Get In Touch
 </div>
 <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#012A4A]">
 Let’s Connect with{""}
 <span className="text-[#61A5C2]">Our Team</span>
 </h1>

 <p className="text-[#2A6F97] text-sm md:text-base max-w-xl mx-auto mt-5 font-medium leading-relaxed">
 Have questions, feedback, or collaboration ideas? Reach out to us —
 we’d love to hear from you!
 </p>
 </motion.div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
 {[
 {
 icon: <Mail size={20} />,
 title:"Email Us",
 content:"socialarc.sma@gmail.com",
 link:"mailto:socialarc.sma@gmail.com",
 },
 {
 icon: <Phone size={20} />,
 title:"Call Us",
 content:"+91 98332 81953",
 link:"tel:+919833281953",
 },
 {
 icon: <MapPin size={20} />,
 title:"Visit Us",
 content:"Mumbai, Maharashtra, India",
 link:"#",
 },
 ].map((item, idx) => (
 <motion.a
 key={idx}
 {...fadeUp(idx * 0.1)}
 href={item.link}
 className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 hover:-translate-y-1 transition-all"
 >
 <div className="flex flex-col items-center text-center">
 <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#61A5C2] flex items-center justify-center mb-5 group-hover:bg-[#61A5C2] group-hover:text-white transition-colors">
 {item.icon}
 </div>
 <h3 className="text-base font-bold text-[#012A4A] mb-2">{item.title}</h3>
 <p className="text-sm font-medium text-[#2A6F97]">{item.content}</p>
 </div>
 </motion.a>
 ))}
 </div>

 <motion.div
 {...fadeUp(0.3)}
 className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/30 p-10 md:p-14 max-w-3xl mx-auto text-left"
 >
 <div className="text-center mb-10">
 <h2 className="text-2xl font-extrabold text-[#012A4A]">Send Us a Message</h2>
 </div>

 <form className="space-y-6" onSubmit={handleSubmit}>
 <div className="grid md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="name" className="block text-[11px] font-black uppercase tracking-widest text-[#2A6F97] mb-2 px-1">
 Your Name
 </label>
 <input
 type="text"
 id="name"
 placeholder="Enter your name"
 className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-[#012A4A] focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
 value={name}
 onChange={(e) => setName(e.target.value)}
 />
 </div>

 <div>
 <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-[#2A6F97] mb-2 px-1">
 Your Email
 </label>
 <input
 type="email"
 id="email"
 placeholder="example@email.com"
 className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-[#012A4A] focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 />
 </div>
 </div>

 <div>
 <label htmlFor="message" className="block text-[11px] font-black uppercase tracking-widest text-[#2A6F97] mb-2 px-1">
 Message
 </label>
 <textarea
 id="message"
 rows="5"
 placeholder="Type your message..."
 className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-[#012A4A] focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none placeholder:text-gray-400 placeholder:font-medium"
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 ></textarea>
 </div>

 <div className="flex justify-end pt-4">
 <button
 type="submit"
 disabled={loading}
 className="flex items-center gap-3 bg-[#01497C] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#013A63] transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 text-sm"
 >
 {loading ?"Sending..." :"Send Message"}
 <Send size={16} />
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 </section>
 );
};

export default Contact;