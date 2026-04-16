import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Home, 
  Users, 
  Euro, 
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronDown,
  Star,
  Heart,
  ArrowRight
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";
import { Property, PropertyType } from "@/src/types";
import { Select } from "@/src/components/ui/Select";

export const AdvancedSearch = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { properties, filters, setFilters, resetFilters, favorites, toggleFavorite } = useStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"relevant" | "price-low" | "price-high" | "newest">("relevant");

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchLocation = filters.location === "Tout le Maroc" || p.city.includes(filters.location) || p.region.includes(filters.location);
      const matchType = filters.propertyType === "Tous" || p.type === filters.propertyType;
      const matchPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const matchGuests = p.capacity >= (filters.guests.adults + filters.guests.children);
      const matchAmenities = filters.amenities.every(a => p.amenities.includes(a));
      
      return matchLocation && matchType && matchPrice && matchGuests && matchAmenities;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0;
    });
  }, [properties, filters, sortBy]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-white dark:bg-luxury-black flex flex-col"
    >
      {/* Search Header */}
      <header className="h-24 px-6 sm:px-12 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-luxury-black/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-6 flex-1">
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X size={24} />
          </button>
          
          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-luxury-gold transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Où souhaitez-vous aller ?"
              value={filters.location}
              onChange={(e) => setFilters({ location: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all",
              isFilterOpen ? "bg-luxury-gold text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
            )}
          >
            <SlidersHorizontal size={18} /> Filtres
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto custom-scrollbar bg-neutral-50/50 dark:bg-neutral-900/50"
            >
              <div className="p-8 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-serif font-bold">Filtres</h3>
                  <button onClick={resetFilters} className="text-xs font-bold text-luxury-gold hover:underline">Réinitialiser</button>
                </div>

                {/* Property Type */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Type de propriété</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Tous", "Villa", "Riad", "Appartement", "Studio"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ propertyType: type as PropertyType })}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                          filters.propertyType === type 
                            ? "bg-luxury-gold border-luxury-gold text-white" 
                            : "bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Budget par nuit</label>
                    <span className="text-xs font-bold text-luxury-gold">{filters.priceRange[0]}€ - {filters.priceRange[1]}€</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                  />
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Chambres & Salles de bain</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Chambres</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setFilters({ bedrooms: Math.max(0, (filters.bedrooms || 0) - 1) })}
                          className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"
                        >-</button>
                        <span className="w-4 text-center font-bold">{filters.bedrooms || 0}</span>
                        <button 
                          onClick={() => setFilters({ bedrooms: (filters.bedrooms || 0) + 1 })}
                          className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Équipements Premium</label>
                  <div className="space-y-2">
                    {[
                      "Piscine privée", "Piscine chauffée", "Climatisation centrale", "Wi-Fi haut débit", 
                      "Cuisine équipée", "Salle de sport", "Spa / Jacuzzi", "Hammam", "Parking privé", 
                      "Sécurité 24/7", "Jardin paysager", "Terrasse", "Barbecue", "Cheminée", 
                      "Ascenseur", "Accès PMR", "Borne de recharge VE"
                    ].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => {
                            const newAmenities = filters.amenities.includes(amenity)
                              ? filters.amenities.filter(a => a !== amenity)
                              : [...filters.amenities, amenity];
                            setFilters({ amenities: newAmenities });
                          }}
                          className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-luxury-black dark:group-hover:text-white transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Caractéristiques & Atouts</label>
                  <div className="space-y-2">
                    {[
                      "Vue sur mer", "Vue sur montagne", "Vue sur ville", "Front de mer", 
                      "Accès direct plage", "Sans vis-à-vis", "Maison connectée", "Éco-responsable", 
                      "Architecture traditionnelle", "Design moderne", "Événements autorisés"
                    ].map((feature) => (
                      <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.features?.includes(feature)}
                          onChange={() => {
                            const currentFeatures = filters.features || [];
                            const newFeatures = currentFeatures.includes(feature)
                              ? currentFeatures.filter(f => f !== feature)
                              : [...currentFeatures, feature];
                            setFilters({ features: newFeatures });
                          }}
                          className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-luxury-black dark:group-hover:text-white transition-colors">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <main className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-luxury-black dark:text-white">
                  {filteredProperties.length} propriétés trouvées
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                  Basé sur vos critères de recherche à {filters.location}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
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
                
                <Select 
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-48"
                  options={[
                    { value: "relevant", label: "Plus pertinent" },
                    { value: "price-low", label: "Prix croissant" },
                    { value: "price-high", label: "Prix décroissant" },
                    { value: "newest", label: "Plus récent" }
                  ]}
                />
              </div>
            </div>

            {/* Grid */}
            <div className={cn(
              "grid gap-8",
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-100 dark:border-neutral-800 overflow-hidden group hover:shadow-2xl transition-all duration-500",
                    viewMode === "list" && "flex flex-col sm:flex-row"
                  )}
                >
                  <div className={cn(
                    "relative overflow-hidden shrink-0",
                    viewMode === "grid" ? "h-64" : "w-full sm:w-80 h-64 sm:h-auto"
                  )}>
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
                    <button 
                      onClick={() => toggleFavorite(property.id)}
                      className={cn(
                        "absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all",
                        favorites.includes(property.id) ? "bg-red-500 text-white" : "bg-white/90 text-luxury-black hover:bg-red-500 hover:text-white"
                      )}
                    >
                      <Heart size={18} fill={favorites.includes(property.id) ? "currentColor" : "none"} />
                    </button>
                    {property.matchScore && (
                      <div className="absolute bottom-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                        {property.matchScore}% Match
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="text-luxury-gold font-bold text-lg whitespace-nowrap">{property.price}€</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-neutral-400 text-xs mb-4">
                      <MapPin size={12} />
                      <span>{property.city}, {property.region}</span>
                    </div>

                    <div className="flex gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest">Type</span>
                        <span className="text-xs font-bold text-luxury-black dark:text-white">{property.type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest">Capacité</span>
                        <span className="text-xs font-bold text-luxury-black dark:text-white">{property.capacity} Pers.</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-neutral-50 dark:border-neutral-800 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-900 bg-luxury-gold text-white text-[8px] flex items-center justify-center font-bold">
                          +12
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all">
                        Réserver <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};
