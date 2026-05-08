import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Share2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const sections = [
    {
      id: "information-collection",
      icon: <Database size={24} className="text-blue-500" />,
      title: "1. Information We Collect",
      content: "We collect information that you provide directly to us when you register for an account, use our services, or communicate with us. This may include your name, email address, social media account tokens, and content you choose to automate through our platform."
    },
    {
      id: "how-we-use",
      icon: <Eye size={24} className="text-purple-500" />,
      title: "2. How We Use Your Information",
      content: "We use the information we collect to operate, maintain, and improve our services. Specifically, we use your social media connections to post content on your behalf as explicitly requested and scheduled by you."
    },
    {
      id: "third-party",
      icon: <Share2 size={24} className="text-amber-500" />,
      title: "3. Third-Party Services",
      content: "Our application interacts with third-party APIs including OpenAI for content generation and various social media platforms (Facebook, Twitter, LinkedIn, Instagram). Your use of these integrations is subject to their respective privacy policies."
    },
    {
      id: "data-security",
      icon: <Lock size={24} className="text-green-500" />,
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure."
    },
    {
      id: "contact",
      icon: <Mail size={24} className="text-red-500" />,
      title: "5. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us."
    }
  ];

  return (
    <section className="min-h-screen bg-[#FBFDFF] py-20 px-6 font-sans text-gray-900 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Shield size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">Privacy Policy</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-gray-500 leading-relaxed mb-12">
            Your privacy is critically important to us. At Social Media Automation, we have a few fundamental principles: we don't ask for personal information unless we truly need it, we don't share your personal information except to comply with the law, develop our products, or protect our rights, and we don't store personal information on our servers unless required for the ongoing operation of one of our services.
          </p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Privacy;
