import React from "react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { X, Layers, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";

export const ComparisonBar = () => {
  const { comparisonList, properties, toggleComparison, clearComparison, setComparisonModalOpen } = useStore();

  if (comparisonList.length === 0) return null;

  const comparedProperties = properties.filter(p => comparisonList.includes(p.id));

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4"
    >
      <div className="bg-luxury-black dark:bg-neutral-900 text-white rounded-[2rem] p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">{comparisonList.length} Propriétés</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">À comparer</div>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 shrink-0" />

          <div className="flex items-center gap-3">
            {comparedProperties.map((property) => (
              <div key={property.id} className="relative group shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20">
                  <ImagePlaceholder src={property.images[0]} alt={property.title} className="w-full h-full" />
                </div>
                <button 
                  onClick={() => toggleComparison(property.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {comparisonList.length < 4 && (
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                <span className="text-xl">+</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={clearComparison}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Vider
          </button>
          <button 
            onClick={() => setComparisonModalOpen(true)}
            disabled={comparisonList.length < 2}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              comparisonList.length >= 2 
                ? "bg-luxury-gold text-white hover:bg-white hover:text-luxury-black" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            Comparer
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
