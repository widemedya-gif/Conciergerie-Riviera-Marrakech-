import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-2xl bg-white dark:bg-luxury-black rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-500",
              className
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
              <h2 className="text-2xl font-serif text-luxury-black dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-luxury-black dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-neutral-800 rounded-xl", className)} />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  isLoading, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-luxury-black dark:bg-white text-white dark:text-luxury-black hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white shadow-lg shadow-black/10",
    secondary: "bg-luxury-gold text-white hover:bg-luxury-bordeaux",
    outline: "border border-gray-200 dark:border-neutral-800 text-luxury-black dark:text-white hover:border-luxury-gold dark:hover:border-luxury-gold hover:text-luxury-gold dark:hover:text-luxury-gold",
    ghost: "text-gray-500 dark:text-neutral-400 hover:text-luxury-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base"
  };

  return (
    <button
      className={cn(
        "rounded-full font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
