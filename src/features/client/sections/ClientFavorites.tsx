import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  LayoutGrid, 
  List, 
  Trash2, 
  ArrowRight, 
  Filter,
  Search,
  ArrowUpDown,
  Share2,
  Copy
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const ClientFavorites = () => {
  const { favorites, properties, toggleFavorite, addNotification, toggleComparison, comparisonList, setComparisonModalOpen } = useStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));
  
  const filteredFavorites = favoriteProperties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (id: string) => {
    addNotification("Lien copié dans le presse-papier !", "success");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Mes Favoris</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Retrouvez toutes les propriétés que vous avez aimées.</p>
        </div>
        <div className="flex gap-3">
          {comparisonList.length > 0 && (
            <button 
              onClick={() => setComparisonModalOpen(true)}
              className="px-6 py-3.5 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20 flex items-center gap-2"
            >
              Comparer ({comparisonList.length})
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher dans vos favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-neutral-50 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-100 dark:border-neutral-700">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white dark:bg-neutral-700 text-luxury-gold shadow-sm" : "text-neutral-400")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white dark:bg-neutral-700 text-luxury-gold shadow-sm" : "text-neutral-400")}
            >
              <List size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all">
            <ArrowUpDown size={16} /> Trier
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredFavorites.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredFavorites.map((property) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden group hover:shadow-xl transition-all duration-500",
                  viewMode === "list" && "flex flex-col sm:flex-row"
                )}
              >
                {/* Image */}
                <div className={cn(
                  "relative overflow-hidden shrink-0",
                  viewMode === "grid" ? "h-64" : "w-full sm:w-72 h-64 sm:h-auto"
                )}>
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => toggleFavorite(property.id)}
                      className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                    <button 
                      onClick={() => handleShare(property.id)}
                      className="p-2.5 bg-white/90 backdrop-blur-md text-luxury-black rounded-xl shadow-lg hover:bg-luxury-gold hover:text-white transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                        <Trash2 size={12} /> {property.city}, {property.region}
                      </p>
                    </div>
                    <span className="text-luxury-gold font-bold text-lg">{property.price}€</span>
                  </div>

                  <div className="flex gap-4 my-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Type</span>
                      <span className="text-xs font-bold text-luxury-black dark:text-white">{property.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Capacité</span>
                      <span className="text-xs font-bold text-luxury-black dark:text-white">{property.capacity} Pers.</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-neutral-50 dark:border-neutral-800 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => toggleComparison(property.id)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        comparisonList.includes(property.id)
                          ? "bg-luxury-gold text-white"
                          : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      )}
                    >
                      {comparisonList.includes(property.id) ? "Dans le comparateur" : "Comparer"}
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all">
                      Voir <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-[40px] border border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-neutral-200" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-luxury-black dark:text-white mb-2">Aucun favori pour le moment</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
            Parcourez nos propriétés d'exception et cliquez sur le coeur pour les ajouter à votre liste.
          </p>
          <button className="px-8 py-4 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20">
            Découvrir les propriétés
          </button>
        </div>
      )}
    </div>
  );
};
