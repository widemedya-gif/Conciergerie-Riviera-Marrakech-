import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = "Sélectionner...", icon, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative group", className)} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border transition-all duration-300 outline-none text-left",
          isOpen 
            ? "border-luxury-gold ring-2 ring-luxury-gold/20 dark:ring-luxury-gold/10" 
            : "border-neutral-200 dark:border-neutral-700 hover:border-luxury-gold/50 dark:hover:border-luxury-gold/50",
          !selectedOption && "text-neutral-400"
        )}
      >
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isOpen ? "text-luxury-gold" : "text-neutral-400 group-hover:text-luxury-gold"
          )}>
            {icon}
          </div>
        )}
        
        <span className="truncate flex-1 font-medium text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          size={16} 
          className={cn(
            "text-neutral-400 transition-transform duration-300 ml-2 flex-shrink-0",
            isOpen && "rotate-180 text-luxury-gold"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200 text-left",
                    value === option.value 
                      ? "bg-luxury-gold/10 text-luxury-gold font-bold" 
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check size={16} className="text-luxury-gold flex-shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}