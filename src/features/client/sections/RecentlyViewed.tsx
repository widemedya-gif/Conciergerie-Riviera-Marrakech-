import React from "react";
import { motion } from "motion/react";
import { 
  History, 
  MapPin, 
  Star, 
  ArrowRight, 
  Trash2,
  Clock
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const RecentlyViewedSection = () => {
  const { recentlyViewed, properties } = useStore();

  const viewedProperties = recentlyViewed.map(rv => {
    const property = properties.find(p => p.id === rv.propertyId);
    return property ? { ...property, viewedAt: rv.viewedAt } : null;
  }).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Consultés Récemment</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Retrouvez les propriétés que vous avez consultées lors de vos dernières sessions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
          <Trash2 size={16} /> Effacer l'historique
        </button>
      </div>

      {/* Grid */}
      {viewedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewedProperties.map((property: any) => (
            <motion.div
              key={property.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden group shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star size={12} className="text-luxury-gold fill-luxury-gold" />
                  <span className="text-[10px] font-bold text-luxury-black">{property.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-[10px] font-medium">
                  <Clock size={12} />
                  {new Date(property.viewedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1 mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-neutral-400 text-xs mb-4">
                  <MapPin size={12} />
                  <span>{property.city}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-50 dark:border-neutral-800">
                  <span className="text-luxury-gold font-bold">{property.price}€</span>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-black dark:text-white hover:text-luxury-gold transition-colors">
                    Détails <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-[40px] border border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <History size={40} className="text-neutral-200" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-luxury-black dark:text-white mb-2">Historique vide</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Les propriétés que vous visitez apparaîtront ici pour vous permettre de les retrouver facilement.
          </p>
        </div>
      )}
    </div>
  );
};
