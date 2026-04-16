import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { 
  X, 
  Search, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Wifi, 
  Car, 
  Waves, 
  Wind,
  Trash2,
  ShieldCheck,
  Layers,
  Mountain,
  Palmtree,
  Building2,
  CheckSquare,
  Square,
  ThermometerSun,
  Utensils,
  Dumbbell,
  Droplets,
  TreePine,
  Sun,
  Flame,
  ArrowUpDown,
  Accessibility,
  Zap,
  Building,
  Umbrella,
  EyeOff,
  Smartphone,
  Leaf,
  Landmark,
  Palette,
  PartyPopper
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROPERTY_TYPES = ["Tous", "Villa", "Riad", "Appartement", "Studio", "Terrain", "Bureau"];
const CITIES = ["Tout le Maroc", "Marrakech", "Casablanca", "Tanger", "Agadir", "Rabat", "Essaouira", "Fès", "Meknès"];
const CONDITIONS = ["Tous", "Neuf", "Bon état", "Rénové", "À rénover"];
const VIEWS = ["Tous", "Mer", "Montagne", "Jardin", "Ville"];
const AMENITIES = [
  { id: "Piscine privée", label: "Piscine privée", icon: Waves },
  { id: "Piscine chauffée", label: "Piscine chauffée", icon: ThermometerSun },
  { id: "Climatisation centrale", label: "Climatisation centrale", icon: Wind },
  { id: "Wi-Fi haut débit", label: "Wi-Fi haut débit", icon: Wifi },
  { id: "Cuisine équipée", label: "Cuisine équipée", icon: Utensils },
  { id: "Salle de sport", label: "Salle de sport", icon: Dumbbell },
  { id: "Spa / Jacuzzi", label: "Spa / Jacuzzi", icon: Bath },
  { id: "Hammam", label: "Hammam", icon: Droplets },
  { id: "Parking privé", label: "Parking privé", icon: Car },
  { id: "Sécurité 24/7", label: "Sécurité 24/7", icon: ShieldCheck },
  { id: "Jardin paysager", label: "Jardin paysager", icon: TreePine },
  { id: "Terrasse", label: "Terrasse", icon: Sun },
  { id: "Barbecue", label: "Barbecue", icon: Flame },
  { id: "Cheminée", label: "Cheminée", icon: Flame },
  { id: "Ascenseur", label: "Ascenseur", icon: ArrowUpDown },
  { id: "Accès PMR", label: "Accès PMR", icon: Accessibility },
  { id: "Borne de recharge VE", label: "Borne de recharge VE", icon: Zap },
];

const FEATURES = [
  { id: "Vue sur mer", label: "Vue sur mer", icon: Waves },
  { id: "Vue sur montagne", label: "Vue sur montagne", icon: Mountain },
  { id: "Vue sur ville", label: "Vue sur ville", icon: Building },
  { id: "Front de mer", label: "Front de mer", icon: Waves },
  { id: "Accès direct plage", label: "Accès direct plage", icon: Umbrella },
  { id: "Sans vis-à-vis", label: "Sans vis-à-vis", icon: EyeOff },
  { id: "Maison connectée", label: "Maison connectée", icon: Smartphone },
  { id: "Éco-responsable", label: "Éco-responsable", icon: Leaf },
  { id: "Architecture traditionnelle", label: "Architecture traditionnelle", icon: Landmark },
  { id: "Design moderne", label: "Design moderne", icon: Palette },
  { id: "Événements autorisés", label: "Événements autorisés", icon: PartyPopper },
];

export const MarketplaceSidebar = () => {
  const { filters, setFilters, resetFilters } = useStore();
  const [localSearch, setLocalSearch] = useState(filters.query || "");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ query: localSearch });
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const toggleAmenity = (id: string) => {
    const newAmenities = filters.amenities.includes(id)
      ? filters.amenities.filter(a => a !== id)
      : [...filters.amenities, id];
    setFilters({ amenities: newAmenities });
  };

  const toggleFeature = (id: string) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(id)
      ? currentFeatures.filter(f => f !== id)
      : [...currentFeatures, id];
    setFilters({ features: newFeatures });
  };

  return (
    <div className="w-full lg:w-80 shrink-0 space-y-8 lg:sticky lg:top-24 h-fit pb-12">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Ville, quartier, mots-clés..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus:border-luxury-gold outline-none transition-all text-sm"
        />
      </div>

      {/* Active Filters Tags */}
      <div className="flex flex-wrap gap-2">
        {filters.query && (
          <FilterTag label={`"${filters.query}"`} onRemove={() => { setLocalSearch(""); setFilters({ query: "" }); }} />
        )}
        {filters.propertyType !== "Tous" && (
          <FilterTag label={filters.propertyType} onRemove={() => setFilters({ propertyType: "Tous" })} />
        )}
        {filters.location !== "Tout le Maroc" && (
          <FilterTag label={filters.location} onRemove={() => setFilters({ location: "Tout le Maroc" })} />
        )}
        {filters.amenities.map(id => (
          <FilterTag 
            key={id} 
            label={AMENITIES.find(a => a.id === id)?.label || id} 
            onRemove={() => toggleAmenity(id)} 
          />
        ))}
        {filters.features?.map(id => (
          <FilterTag 
            key={id} 
            label={FEATURES.find(f => f.id === id)?.label || id} 
            onRemove={() => toggleFeature(id)} 
          />
        ))}
        {(filters.propertyType !== "Tous" || filters.location !== "Tout le Maroc" || filters.amenities.length > 0 || (filters.features && filters.features.length > 0)) && (
          <button 
            onClick={resetFilters}
            className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:underline"
          >
            Effacer tout
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-black dark:text-white">Filtres</h3>
          <button onClick={resetFilters} className="text-gray-400 hover:text-luxury-gold transition-colors">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Listing Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type de Transaction</label>
          <div className="flex p-1 bg-gray-50 dark:bg-neutral-800 rounded-xl">
            <button
              onClick={() => setFilters({ listingType: "rent" })}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                filters.listingType === "rent" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-gray-500"
              )}
            >
              Location
            </button>
            <button
              onClick={() => setFilters({ listingType: "sale" })}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                filters.listingType === "sale" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-gray-500"
              )}
            >
              Vente
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type de Bien</label>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setFilters({ propertyType: type as any })}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center",
                  filters.propertyType === type
                    ? "border-luxury-gold bg-luxury-gold/5 text-luxury-gold"
                    : "border-gray-100 dark:border-neutral-800 hover:border-luxury-gold/50 text-gray-600 dark:text-gray-400"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ville</label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ location: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border-none outline-none text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prix (DH)</label>
            <span className="text-xs font-bold text-luxury-gold">
              {filters.priceRange[0]} - {filters.priceRange[1]}+
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
            className="w-full accent-luxury-gold"
          />
        </div>

        {/* Surface Range */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Surface (m²)</label>
            <span className="text-xs font-bold text-luxury-gold">
              {filters.surface?.[0]} - {filters.surface?.[1]}+
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filters.surface?.[1]}
            onChange={(e) => setFilters({ surface: [filters.surface?.[0] || 0, parseInt(e.target.value)] })}
            className="w-full accent-luxury-gold"
          />
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">État du Bien</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(cond => (
              <button
                key={cond}
                onClick={() => setFilters({ condition: cond as any })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                  filters.condition === cond
                    ? "border-luxury-gold bg-luxury-gold text-white"
                    : "border-gray-100 dark:border-neutral-800 text-gray-500 hover:border-luxury-gold/50"
                )}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* View */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vue</label>
          <div className="grid grid-cols-2 gap-2">
            {VIEWS.map(v => (
              <button
                key={v}
                onClick={() => setFilters({ view: v as any })}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                  filters.view === v
                    ? "border-luxury-gold bg-luxury-gold/5 text-luxury-gold"
                    : "border-gray-100 dark:border-neutral-800 text-gray-600 dark:text-gray-400"
                )}
              >
                {v === "Mer" && <Waves size={14} />}
                {v === "Montagne" && <Mountain size={14} />}
                {v === "Jardin" && <Palmtree size={14} />}
                {v === "Ville" && <Building2 size={14} />}
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Features Toggle */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Caractéristiques</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "furnished", label: "Meublé" },
              { id: "parking", label: "Parking" },
              { id: "security", label: "Sécurité" },
              { id: "pool", label: "Piscine" },
              { id: "garden", label: "Jardin" },
              { id: "terrace", label: "Terrasse" },
              { id: "elevator", label: "Ascenseur" },
            ].map(feature => (
              <button
                key={feature.id}
                onClick={() => setFilters({ [feature.id]: !((filters as any)[feature.id]) })}
                className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all group"
              >
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-luxury-black dark:group-hover:text-white">
                  {feature.label}
                </span>
                {(filters as any)[feature.id] ? (
                  <CheckSquare size={18} className="text-luxury-gold" />
                ) : (
                  <Square size={18} className="text-gray-300 dark:text-neutral-700" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Level */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Étage</label>
          <div className="flex flex-wrap gap-2">
            {["RDC", "1", "2", "3", "4+", "Dernier"].map(f => (
              <button
                key={f}
                onClick={() => setFilters({ floor: f as any })}
                className={cn(
                  "w-10 h-10 rounded-xl text-xs font-bold border transition-all flex items-center justify-center",
                  filters.floor === f
                    ? "border-luxury-gold bg-luxury-gold text-white"
                    : "border-gray-100 dark:border-neutral-800 text-gray-500 hover:border-luxury-gold/50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chambres</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters({ bedrooms: Math.max(0, (filters.bedrooms || 0) - 1) })}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >-</button>
              <span className="text-sm font-bold w-4 text-center">{filters.bedrooms || 0}</span>
              <button 
                onClick={() => setFilters({ bedrooms: (filters.bedrooms || 0) + 1 })}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >+</button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Salles de bain</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters({ bathrooms: Math.max(0, (filters.bathrooms || 0) - 1) })}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >-</button>
              <span className="text-sm font-bold w-4 text-center">{filters.bathrooms || 0}</span>
              <button 
                onClick={() => setFilters({ bathrooms: (filters.bathrooms || 0) + 1 })}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >+</button>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Équipements Premium</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {AMENITIES.map(amenity => (
              <button
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "flex items-center gap-3 w-full p-2 rounded-xl text-xs font-medium transition-all",
                  filters.amenities.includes(amenity.id)
                    ? "bg-luxury-gold/10 text-luxury-gold"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400"
                )}
              >
                <amenity.icon size={16} />
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Caractéristiques & Atouts</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {FEATURES.map(feature => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={cn(
                  "flex items-center gap-3 w-full p-2 rounded-xl text-xs font-medium transition-all",
                  filters.features?.includes(feature.id)
                    ? "bg-luxury-gold/10 text-luxury-gold"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400"
                )}
              >
                <feature.icon size={16} />
                {feature.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterTag = ({ label, onRemove }: { label: string; onRemove: () => void; key?: string }) => (
  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
    {label}
    <button onClick={onRemove} className="hover:text-luxury-gold">
      <X size={12} />
    </button>
  </span>
);
