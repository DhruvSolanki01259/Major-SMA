import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuthStore();

  /* ---------------- Tabs ---------------- */

  const publicTabs = [
    // { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const privateTabs = [
    { label: "Content Studio", path: "/content-studio" },
    { label: "View Analytics", path: "/analytics" },
  ];

  const tabs = user ? [...publicTabs, ...privateTabs] : publicTabs;

  /* ---------------- Animations ---------------- */

  const tabAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-gray-50 border-b border-gray-200 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between h-16">
        {/* Logo */}

        <Link to="/">
          <motion.img
            src="/app-logo.png"
            alt="App Logo"
            className="w-28 cursor-pointer select-none -ml-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          />
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden md:flex gap-8 text-gray-900 font-medium">
          {tabs.map((tab, i) => (
            <motion.div
              key={tab.path}
              custom={i}
              variants={tabAnimation}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <Link to={tab.path}>
                <span className="hover:text-blue-800 transition">
                  {tab.label}
                </span>
              </Link>

              <span className="absolute left-0 bottom-[-4px] w-0 group-hover:w-full h-[2px] bg-blue-800 transition-all" />
            </motion.div>
          ))}
        </nav>

        {/* Desktop Controls */}

        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle (placeholder) */}

          <button className="w-9 h-9 rounded-full border flex items-center justify-center text-blue-800 hover:bg-blue-50 transition">
            <Sun size={16} />
          </button>

          {/* AUTH BUTTON / AVATAR */}

          {!user ? (
            <Link to="/signup">
              <button className="px-4 py-1.5 rounded-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white transition">
                Sign Up
              </button>
            </Link>
          ) : (
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition"
            >
              {user.profile_initials || "CR"}
            </Link>
          )}
        </div>

        {/* Mobile Controls */}

        <div className="flex md:hidden items-center gap-2">
          <button className="w-9 h-9 rounded-full border flex items-center justify-center text-blue-800 hover:bg-blue-50 transition">
            <Sun size={16} />
          </button>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="md:hidden bg-gray-50 border-t border-gray-200 shadow-md"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setIsOpen(false)}
                >
                  <button className="text-left w-full px-3 py-2 rounded hover:bg-blue-100 transition">
                    {tab.label}
                  </button>
                </Link>
              ))}

              {!user ? (
                <Link to="/signup">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="border-2 border-blue-800 text-blue-800 px-4 py-2 rounded hover:bg-blue-800 hover:text-white transition text-center w-full"
                  >
                    Sign Up
                  </button>
                </Link>
              ) : (
                <Link to="/profile">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="border-2 border-blue-800 text-blue-800 px-4 py-2 rounded hover:bg-blue-800 hover:text-white transition text-center w-full"
                  >
                    Profile
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
