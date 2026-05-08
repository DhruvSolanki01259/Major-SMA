import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertTriangle, Copyright, Scale, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  const sections = [
    {
      id: "acceptance",
      icon: <CheckCircle size={24} className="text-green-500" />,
      title: "1. Acceptance of Terms",
      content: "By accessing or using our Social Media Automation service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services."
    },
    {
      id: "service",
      icon: <FileText size={24} className="text-blue-500" />,
      title: "2. Description of Service",
      content: "We provide a platform that allows users to generate AI content, schedule posts, and automate publishing across various social media platforms. We reserve the right to modify or discontinue any part of the service at any time without notice."
    },
    {
      id: "conduct",
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      title: "3. User Conduct",
      content: "You are solely responsible for the content you generate and publish using our service. You agree not to use the service to post unlawful, offensive, or infringing material. You must comply with the terms of service of all connected social media platforms."
    },
    {
      id: "ip",
      icon: <Copyright size={24} className="text-purple-500" />,
      title: "4. Intellectual Property",
      content: "The AI-generated content is provided for your use, but the underlying service, software, and designs remain the property of our company. You retain all rights to your original inputs and prompts."
    },
    {
      id: "liability",
      icon: <Scale size={24} className="text-red-500" />,
      title: "5. Limitation of Liability",
      content: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service."
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
            <div className="p-4 bg-indigo-50 rounded-2xl">
              <Scale size={40} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">Terms of Service</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-gray-500 leading-relaxed mb-12">
            Please read these terms of service carefully before using our Social Media Automation platform. They govern your use of our services and outline our mutual responsibilities. By continuing to use the platform, you agree to these conditions.
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

export default Terms;
