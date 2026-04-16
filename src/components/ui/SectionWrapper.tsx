import React from "react";
import { useStore } from "@/src/store/useStore";
import { ArrowUp, ArrowDown, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, children }) => {
  const isAdminMode = useStore((state) => state.isAdminMode);
  const homepageSections = useStore((state) => state.homepageSections);
  const reorderSections = useStore((state) => state.reorderSections);

  if (!isAdminMode) {
    return <>{children}</>;
  }

  const currentIndex = homepageSections.indexOf(id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === homepageSections.length - 1;

  const handleMoveUp = () => {
    if (!isFirst) reorderSections(currentIndex, currentIndex - 1);
  };

  const handleMoveDown = () => {
    if (!isLast) reorderSections(currentIndex, currentIndex + 1);
  };

  return (
    <div className="relative group border-2 border-transparent hover:border-luxury-gold/50 transition-colors rounded-xl m-2">
      {/* Admin Controls Overlay */}
      <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white dark:bg-neutral-900 shadow-xl rounded-lg p-1 border border-neutral-200 dark:border-neutral-800">
        <div className="px-2 py-1 flex items-center gap-1 cursor-grab text-neutral-400 hover:text-luxury-gold">
          <GripVertical size={16} />
        </div>
        <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
        <button 
          onClick={handleMoveUp}
          disabled={isFirst}
          className="p-1.5 text-neutral-500 hover:text-luxury-gold disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors rounded"
        >
          <ArrowUp size={16} />
        </button>
        <button 
          onClick={handleMoveDown}
          disabled={isLast}
          className="p-1.5 text-neutral-500 hover:text-luxury-gold disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors rounded"
        >
          <ArrowDown size={16} />
        </button>
        <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
        <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded">
          <Trash2 size={16} />
        </button>
      </div>
      
      {/* Visual Indicator */}
      <div className="absolute top-0 left-0 bg-luxury-gold text-white text-[10px] font-bold px-2 py-1 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
        SECTION: {id.toUpperCase()}
      </div>

      {/* Content */}
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};
