import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const APP_NAME = import.meta.env.VITE_APP_NAME || "Social Media Automation";
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: "About", path: "/about-us" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Contact", path: "/contact" },
  ];

  // Transition settings
  const transition = {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <footer className="w-full bg-[#013A63] text-[#E0F2FF] border-t border-[#1E3A5F] py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section: Logo + About */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-center md:text-left space-y-2"
        >
          <h2
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r 
              from-[#A9D6E5] to-[#61A5C2] bg-clip-text text-transparent"
          >
            {APP_NAME}
          </h2>
          <p className="text-[#CBE5F5] text-sm max-w-md">
            Streamline your social media workflow with intelligent automation —
            plan, post, and analyze effortlessly.
          </p>
        </motion.div>

        {/* Center Section: Footer Links */}
        <motion.ul
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 text-sm font-medium"
        >
          {footerLinks.map((link, i) => (
            <motion.li
              key={i}
              whileHover={{
                scale: 1.07,
                color: "#A9D6E5",
                transition: { duration: 0.3 },
              }}
              transition={transition}
              className="transition-colors duration-300 hover:text-[#A9D6E5] cursor-pointer"
              onClick={() => (window.location.href = link.path)}
            >
              {link.label}
            </motion.li>
          ))}
        </motion.ul>

        {/* Right Section: Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="flex justify-center md:justify-end gap-4 text-[#CBE5F5]"
        >
          {[
            { Icon: FaFacebook, label: "FaFacebook" },
            { Icon: FaTwitter, label: "FaTwitter" },
            { Icon: FaLinkedin, label: "FaLinkedIn" },
            { Icon: FaGithub, label: "GitHub" },
          ].map(({ Icon, label }, i) => (
            <motion.a
              key={label}
              href="#"
              whileHover={{
                scale: 1.1,
                color: "#A9D6E5",
                transition: { duration: 0.25 },
              }}
              transition={transition}
              className="hover:text-[#A9D6E5] transition-colors duration-300"
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: 0.4 }}
        className="border-t border-[#1E3A5F] mt-8 pt-6 text-center text-sm text-[#89A0B2]"
      >
        © {year}{" "}
        <span className="font-semibold text-[#A9D6E5]">{APP_NAME}</span>. All
        rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
