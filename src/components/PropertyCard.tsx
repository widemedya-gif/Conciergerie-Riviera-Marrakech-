import React, { useState } from "react";
import { Star, Heart, MapPin, Eye, ShoppingCart, BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Property } from "../types";
import { useStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";

interface PropertyCardProps {
  property: Property;
  index: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { 
    favorites, toggleFavorite, 
    cart, addToCart, removeFromCart,
    comparisonList, toggleComparison,
    setQuickViewPropertyId, setQuickViewOpen,
    addRecentlyViewed,
    addNotification
  } = useStore();

  const isFavorite = favorites.includes(property.id);
  const isInCart = cart.includes(property.id);
  const isInComparison = comparisonList.includes(property.id);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewPropertyId(property.id);
    setQuickViewOpen(true);
    addRecentlyViewed(property.id);
  };

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(property.id);
      addNotification("Retiré du panier", "info");
    } else {
      addToCart(property.id);
      addNotification("Ajouté au panier", "success");
    }
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComparison(property.id);
    if (!isInComparison && comparisonList.length >= 4) {
      addNotification("Maximum 4 propriétés pour comparaison", "error");
    } else {
      addNotification(isInComparison ? "Retiré de la comparaison" : "Ajouté à la comparaison", "info");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100 dark:border-neutral-800"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ImagePlaceholder 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full"
              aspectRatio="portrait"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation */}
        {isHovered && property.images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-10">
            <button onClick={prevImage} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextImage} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {property.isSuperhost && (
            <span className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-luxury-black dark:text-white shadow-sm">
              Superhost
            </span>
          )}
          {property.petFriendly && (
            <span className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-luxury-black dark:text-white shadow-sm flex items-center gap-1">
              Animaux acceptés
            </span>
          )}
          {property.matchScore && (
            <span className="bg-luxury-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Match {property.matchScore}%
            </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }}
            className={cn(
              "p-3 rounded-full backdrop-blur-md border transition-all duration-300",
              isFavorite 
                ? "bg-luxury-bordeaux text-white border-luxury-bordeaux" 
                : "bg-white/20 text-white border-white/30 hover:bg-white hover:text-luxury-bordeaux"
            )}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleToggleComparison}
            className={cn(
              "p-3 rounded-full backdrop-blur-md border transition-all duration-300",
              isInComparison 
                ? "bg-luxury-gold text-white border-luxury-gold" 
                : "bg-white/20 text-white border-white/30 hover:bg-white hover:text-luxury-gold"
            )}
          >
            <BarChart2 size={18} />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 z-0",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <button 
            onClick={handleQuickView}
            className="bg-white text-luxury-black px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2"
          >
            <Eye size={14} /> Aperçu Rapide
          </button>
          <button 
            onClick={handleToggleCart}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2",
              isInCart ? "bg-luxury-bordeaux text-white" : "bg-luxury-gold text-white"
            )}
          >
            <ShoppingCart size={14} /> {isInCart ? "Retirer" : "Ajouter au Panier"}
          </button>
        </div>

        {/* Demand Indicator */}
        {property.viewCountToday && property.viewCountToday > 5 && (
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-tight">
                Forte demande — {property.viewCountToday} vues aujourd'hui
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-2xl font-serif group-hover:text-luxury-gold transition-colors mb-1 text-luxury-black dark:text-white">{property.title}</h3>
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
              <MapPin size={14} />
              <span className="text-xs font-medium">{property.city}, {property.region}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded-lg">
              <Star size={14} className="fill-luxury-gold text-luxury-gold" />
              <span className="text-sm font-bold text-luxury-black dark:text-white">{property.rating}</span>
            </div>
            {property.priceInsight && (
              <span className={cn(
                "text-[10px] font-bold uppercase mt-1",
                property.priceInsight === "Best value" ? "text-green-500" : "text-luxury-gold"
              )}>
                {property.priceInsight}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-luxury-black dark:text-white">€{property.price}</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">/ nuit</span>
          </div>
          <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            {property.size} m² • {property.type}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
