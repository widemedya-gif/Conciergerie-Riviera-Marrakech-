import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { 
  Heart, 
  Eye, 
  Layers, 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2,
  TrendingUp,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";
import { Property } from "../../types";

export const MarketplaceGrid = ({ properties }: { properties: Property[] }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden animate-pulse border border-gray-100 dark:border-neutral-800 h-[450px]">
            <div className="h-64 bg-gray-200 dark:bg-neutral-800" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4" />
              <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-serif font-bold text-luxury-black dark:text-white">Aucune propriété disponible pour le moment</h3>
        <p className="text-gray-500 dark:text-neutral-400 mt-2 max-w-md">
          Les propriétaires peuvent commencer à publier des propriétés. Revenez bientôt pour découvrir nos nouvelles offres.
        </p>
        <button 
          onClick={() => useStore.getState().resetFilters()}
          className="mt-8 px-8 py-3 bg-luxury-black text-white dark:bg-white dark:text-luxury-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all"
        >
          Réinitialiser la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <MarketplaceCard key={property.id} property={property} index={index} />
      ))}
    </div>
  );
};

const MarketplaceCard = ({ property, index }: { property: Property; index: number; key?: string }) => {
  const { 
    toggleFavorite, 
    favorites, 
    toggleComparison, 
    comparisonList, 
    setQuickViewOpen, 
    setQuickViewPropertyId,
    user,
    setAuthModalOpen
  } = useStore();

  const isFavorite = favorites.includes(property.id);
  const isCompared = comparisonList.includes(property.id);

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewPropertyId(property.id);
    setQuickViewOpen(true);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    toggleFavorite(property.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComparison(property.id);
  };

  // Simulated insights
  const matchScore = property.matchScore || Math.floor(Math.random() * 20) + 80;
  const viewsToday = property.viewCountToday || Math.floor(Math.random() * 50) + 10;
  const priceInsight = property.priceInsight || (property.price < 2000 ? "Good deal" : "Fair price");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-2xl hover:shadow-luxury-gold/10 transition-all duration-500 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <ImagePlaceholder 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.isSuperhost && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-luxury-gold shadow-sm">
              <ShieldCheck size={12} />
              Superhost
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-luxury-black/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
            <Zap size={12} className="text-luxury-gold" />
            Score: {matchScore}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleFavorite}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300",
              isFavorite ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white hover:text-red-500"
            )}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleCompare}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300",
              isCompared ? "bg-luxury-gold text-white" : "bg-white/20 text-white hover:bg-white hover:text-luxury-gold"
            )}
          >
            <Layers size={18} />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={handleQuickView}
            className="flex items-center gap-2 px-6 py-3 bg-white text-luxury-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            <Eye size={16} />
            Aperçu Rapide
          </button>
        </div>

        {/* Price Insight Tag */}
        <div className="absolute bottom-4 left-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
            priceInsight === "Good deal" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          )}>
            {priceInsight === "Good deal" ? "Excellente Affaire" : "Prix Juste"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1 text-gray-400 mb-1">
              <MapPin size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{property.city}, {property.neighborhood || property.region}</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-luxury-black dark:text-white line-clamp-1 group-hover:text-luxury-gold transition-colors">
              {property.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-luxury-black dark:text-white">
              {property.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">DH</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">/ nuit</div>
          </div>
        </div>

        {/* Attributes */}
        <div className="flex items-center justify-between py-4 border-y border-gray-50 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
              <Bed size={14} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{property.capacity} lits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
              <Bath size={14} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">2 bains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
              <Maximize2 size={14} />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{property.size || 120} m²</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-luxury-gold fill-luxury-gold" />
            <span className="text-xs font-bold text-luxury-black dark:text-white">{property.rating}</span>
            <span className="text-[10px] text-gray-400">(24 avis)</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{viewsToday} vues aujourd'hui</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Search = ({ size, className }: { size?: number; className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
