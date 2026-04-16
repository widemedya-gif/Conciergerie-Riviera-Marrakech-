import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { LoginForm } from "./LoginForm";
import { RegisterFlow } from "./RegisterFlow";

export const AuthModal = () => {
  const { isAuthModalOpen, setAuthModalOpen, authModalView } = useStore();

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            {authModalView === "login" ? <LoginForm /> : <RegisterFlow />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
