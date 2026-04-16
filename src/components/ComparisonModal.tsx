import React from "react";
import { X, Star, MapPin, Check, ShoppingCart, BarChart2, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store/useStore";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { cn } from "../lib/utils";
import { Button } from "./ui/BaseComponents";

export const ComparisonModal = () => {
  const { 
    comparisonList, toggleComparison, clearComparison,
    isComparisonModalOpen, setComparisonModalOpen,
    properties,
    addToCart, cart,
    addNotification
  } = useStore();

  const selectedProperties = properties.filter(p => comparisonList.includes(p.id));

  if (!isComparisonModalOpen) return null;

  const features = [
    { label: "Prix", key: "price", format: (v: number, p: any) => `€${v}${p.rentalType === 'sale' ? '' : ' / nuit'}` },
    { label: "Localisation", key: "location" },
    { label: "Type de bien", key: "type" },
    { label: "Surface", key: "size", format: (v: number) => `${v} m²` },
    { label: "Capacité", key: "capacity", format: (v: number) => `${v} personnes` },
    { label: "Note globale", key: "rating", format: (v: number) => (
      <div className="flex items-center gap-1">
        <Star size={14} className="fill-luxury-gold text-luxury-gold" /> {v} / 5
      </div>
    )},
    { label: "Match Score", key: "matchScore", format: (v: number) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-luxury-gold" style={{ width: `${v}%` }} />
        </div>
        <span className="text-luxury-gold">{v}%</span>
      </div>
    )},
  ];

  const handleBookNow = () => {
    addNotification("Redirection vers le système de réservation...", "success");
    setTimeout(() => {
      setComparisonModalOpen(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setComparisonModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative w-full max-w-[90vw] bg-white dark:bg-luxury-black rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] transition-colors duration-500 border border-neutral-200 dark:border-neutral-800"
        >
          {/* Header */}
          <div className="p-8 md:px-12 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                  <BarChart2 size={20} />
                </div>
                <h2 className="text-3xl font-serif text-luxury-black dark:text-white">
                  Comparaison Détaillée
                </h2>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Analysez jusqu'à 4 propriétés côte à côte pour prendre la meilleure décision.</p>
            </div>
            <div className="flex items-center gap-4">
              {selectedProperties.length > 0 && (
                <button 
                  onClick={clearComparison}
                  className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-luxury-bordeaux transition-colors"
                >
                  Tout effacer
                </button>
              )}
              <button
                onClick={() => setComparisonModalOpen(false)}
                className="p-3 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-luxury-black dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <div className="min-w-[1200px] p-8 md:px-12">
              <div className="grid grid-cols-5 gap-8">
                {/* Labels Column */}
                <div className="pt-[280px] pr-4 border-r border-neutral-100 dark:border-neutral-800">
                  {features.map((f) => (
                    <div key={f.label} className="h-20 flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800">
                      {f.label}
                    </div>
                  ))}
                  <div className="h-40 pt-6 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    Équipements Principaux
                  </div>
                </div>

                {/* Properties Columns */}
                {selectedProperties.map((p) => (
                  <div key={p.id} className="flex flex-col relative group">
                    {/* Property Card Header */}
                    <div className="h-[280px] mb-8 relative flex flex-col">
                      <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 shadow-md">
                        <ImagePlaceholder src={p.images[0]} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {p.isSuperhost && (
                          <div className="absolute top-3 left-3 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                            Superhost
                          </div>
                        )}

                        <button 
                          onClick={() => toggleComparison(p.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full text-neutral-600 hover:text-luxury-bordeaux transition-colors z-10"
                          title="Retirer de la comparaison"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      
                      <h3 className="font-serif text-xl line-clamp-2 text-luxury-black dark:text-white mb-2">{p.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
                        <MapPin size={12} /> {p.city}
                      </div>
                    </div>

                    {/* Features Rows */}
                    {features.map((f) => (
                      <div key={f.label} className="h-20 flex items-center text-sm font-medium border-b border-neutral-100 dark:border-neutral-800 text-luxury-black dark:text-white">
                        {f.format ? f.format((p as any)[f.key], p) : (p as any)[f.key]}
                      </div>
                    ))}

                    {/* Amenities Row */}
                    <div className="h-40 py-6 flex flex-wrap gap-2 content-start overflow-y-auto custom-scrollbar border-b border-neutral-100 dark:border-neutral-800">
                      {[...p.amenities, ...(p.features || [])].slice(0, 6).map(a => (
                        <span key={a} className="text-[11px] font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-full text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                          <Check size={10} className="text-luxury-gold" /> {a}
                        </span>
                      ))}
                      {p.amenities.length + (p.features?.length || 0) > 6 && (
                        <span className="text-[11px] font-medium text-neutral-400 px-2 py-1.5">
                          +{p.amenities.length + (p.features?.length || 0) - 6} autres
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 space-y-3">
                      <Button 
                        onClick={handleBookNow}
                        className="w-full py-4 text-sm flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/20"
                      >
                        Réserver <ArrowRight size={16} />
                      </Button>
                      <Button 
                        variant={cart.includes(p.id) ? "outline" : "secondary"}
                        onClick={() => addToCart(p.id)}
                        disabled={cart.includes(p.id)}
                        className={cn(
                          "w-full py-4 text-sm flex items-center justify-center gap-2",
                          cart.includes(p.id) ? "border-green-500 text-green-600 dark:text-green-400" : ""
                        )}
                      >
                        {cart.includes(p.id) ? <Check size={16} /> : <ShoppingCart size={16} />}
                        {cart.includes(p.id) ? "Sauvegardé" : "Sauvegarder"}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: 4 - selectedProperties.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-8 text-center text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/20 h-full min-h-[600px]">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                      <Plus size={24} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2">Emplacement Libre</p>
                    <p className="text-xs text-neutral-500">Ajoutez une propriété depuis le catalogue pour la comparer.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
              <ShieldCheck size={16} className="text-luxury-gold" /> Données certifiées par Riviera
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
