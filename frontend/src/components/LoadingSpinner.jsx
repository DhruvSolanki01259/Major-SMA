import { motion } from "framer-motion";

const LoadingSpinner = ({
  label = "Loading",
  overlay = false,
  withBackdrop = false,
}) => {
  return (
    <div
      className={`
        inset-0 z-50 flex items-center justify-center
        ${overlay ? "absolute" : "fixed"}
        ${withBackdrop ? "bg-white/60 backdrop-blur-sm" : "bg-transparent"}
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-gray-300 border-t-blue-600"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />

        <motion.p
          className="text-sm tracking-wide text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
