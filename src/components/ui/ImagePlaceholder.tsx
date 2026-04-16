import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  className?: string;
  showUploadHint?: boolean;
}

const aspectRatios = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  src,
  alt,
  aspectRatio = "video",
  className = "",
  showUploadHint = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${aspectRatios[aspectRatio]} ${className}`}
    >
      <AnimatePresence mode="wait">
        {src && src.length > 0 && !isLoaded && !hasError && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 animate-pulse"
          >
            <ImageIcon className="w-8 h-8 text-neutral-400" />
          </motion.div>
        )}

        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 p-4 text-center"
          >
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-xs font-medium">Image non disponible</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always show placeholder, never the actual image as per user request */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 m-1 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-luxury-gold/5 flex items-center justify-center mb-3">
          <ImageIcon className="w-6 h-6 text-luxury-gold/40" />
        </div>
        <p className="text-[8px] font-bold text-luxury-gold/60 uppercase tracking-[0.3em]">Riviera Collection</p>
      </div>

      {showUploadHint && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group">
          <div className="bg-white/90 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 text-primary" />
          </div>
          <span className="mt-2 text-white text-xs font-bold drop-shadow-md">
            MODIFIER L'IMAGE
          </span>
        </div>
      )}

      {/* Upload-ready placeholder when no src is provided */}
      {(!src || src.length === 0) && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600 m-2 rounded-lg">
          <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Emplacement Image
          </p>
        </div>
      )}
    </div>
  );
};
