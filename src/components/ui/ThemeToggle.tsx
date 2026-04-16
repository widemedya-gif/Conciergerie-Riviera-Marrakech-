import React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";

export const ThemeToggle = () => {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full p-1 transition-all duration-500 focus:outline-none group",
        isDark ? "bg-neutral-800 ring-1 ring-neutral-700" : "bg-neutral-200 ring-1 ring-neutral-300"
      )}
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-white dark:bg-luxury-black shadow-md flex items-center justify-center"
      >
        {isDark ? (
          <Moon size={14} className="text-luxury-gold" />
        ) : (
          <Sun size={14} className="text-luxury-gold" />
        )}
      </motion.div>
      
      {/* Tooltip or Label for better UX */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest font-bold">
        {isDark ? "Mode Clair" : "Mode Sombre"}
      </span>
    </button>
  );
};
