import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { MapPin, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "../../types";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";

export const MarketplaceMap = ({ properties }: { properties: Property[] }) => {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-neutral-100 dark:bg-neutral-800 rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-neutral-700">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-50 dark:opacity-20 pointer-events-none">
        <svg width="100%" height="100%" className="text-gray-300 dark:text-neutral-600">
          <pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      {/* Map Pins */}
      {properties.map((property) => (
        <MapPinItem 
          key={property.id} 
          property={property} 
          isSelected={selectedPin === property.id}
          onClick={() => setSelectedPin(property.id)}
        />
      ))}

      {/* Property Preview Card */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden z-50"
          >
            <button 
              onClick={() => setSelectedPin(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center z-10 hover:bg-black transition-colors"
            >
              <X size={14} />
            </button>
            
            <div className="h-32">
              <ImagePlaceholder 
                src={properties.find(p => p.id === selectedPin)?.images[0] || ""} 
                alt="Property"
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-luxury-black dark:text-white line-clamp-1">
                  {properties.find(p => p.id === selectedPin)?.title}
                </h4>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-luxury-gold fill-luxury-gold" />
                  <span className="text-xs font-bold">{properties.find(p => p.id === selectedPin)?.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-luxury-gold">
                  {properties.find(p => p.id === selectedPin)?.price.toLocaleString()} DH
                </div>
                <button 
                  onClick={() => {
                    useStore.getState().setQuickViewPropertyId(selectedPin);
                    useStore.getState().setQuickViewOpen(true);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                >
                  Voir plus
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 shadow-lg flex items-center justify-center text-luxury-black dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all">+</button>
        <button className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 shadow-lg flex items-center justify-center text-luxury-black dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all">-</button>
      </div>
    </div>
  );
};

const MapPinItem = ({ property, isSelected, onClick }: { property: Property; isSelected: boolean; onClick: () => void; key?: string }) => {
  // Simulated random position based on ID
  const seed = property.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const top = (seed % 70) + 15;
  const left = ((seed * 13) % 70) + 15;

  return (
    <motion.button
      onClick={onClick}
      style={{ top: `${top}%`, left: `${left}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      whileHover={{ scale: 1.1 }}
    >
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        isSelected ? "scale-125" : "scale-100"
      )}>
        <div className={cn(
          "px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border-2 transition-all",
          isSelected 
            ? "bg-luxury-black text-white border-luxury-gold dark:bg-white dark:text-luxury-black" 
            : "bg-white text-luxury-black border-transparent hover:border-luxury-gold dark:bg-neutral-900 dark:text-white"
        )}>
          {property.price.toLocaleString()} DH
        </div>
        <div className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r-2 border-b-2 transition-all",
          isSelected 
            ? "bg-luxury-black border-luxury-gold dark:bg-white" 
            : "bg-white border-transparent dark:bg-neutral-900"
        )} />
      </div>
    </motion.button>
  );
};
