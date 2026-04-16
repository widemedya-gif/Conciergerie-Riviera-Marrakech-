import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Users, Minus, Plus, Wallet, Home, Compass, SlidersHorizontal, Check, Info } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store/useStore";
import { PropertyType, TravelIntent } from "../types";

export const BookingEngine = () => {
  const { filters, setFilters, addNotification, locations, setPropertiesPageOpen } = useStore();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const locationRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) setIsLocationOpen(false);
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) setIsGuestsOpen(false);
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) setIsFiltersOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = locations.filter(loc => 
    loc.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.region.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSearch = () => {
    setIsLoading(true);
    if (filters.location && !recentSearches.includes(filters.location)) {
      const updated = [filters.location, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
    }
    useStore.getState().trackSearch(filters.location);
    useStore.getState().trackLocation(filters.location);
    
    setTimeout(() => {
      setIsLoading(false);
      setPropertiesPageOpen(true);
      addNotification("Recherche terminée avec succès", "success");
    }, 1000);
  };

  const updateGuests = (type: "adults" | "children" | "infants", delta: number) => {
    const current = filters.guests[type];
    const newValue = Math.max(type === "adults" ? 1 : 0, current + delta);
    setFilters({ guests: { ...filters.guests, [type]: newValue } });
  };

  const activeFiltersCount = (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0) + (filters.propertyType !== "Tous" ? 1 : 0) + (filters.travelIntent ? 1 : 0);

  return (
    <div className="w-full max-w-6xl mx-auto relative z-40">
      {/* Options & Info Row */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-5 h-5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 group-hover:border-luxury-gold transition-colors">
            <input 
              type="checkbox" 
              className="absolute opacity-0 w-full h-full cursor-pointer"
              checked={filters.entirePlace}
              onChange={(e) => setFilters({ entirePlace: e.target.checked })}
            />
            {filters.entirePlace && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
          </div>
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-luxury-black dark:group-hover:text-white transition-colors">
            Je recherche un logement entier
          </span>
        </label>
        
        <div className="relative group">
          <button className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center hover:bg-luxury-gold hover:text-white transition-colors">
            <Info className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-luxury-black text-white text-xs leading-relaxed rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
            Notre moteur de recherche vous permet de trouver le séjour idéal en filtrant par destination, dates, nombre de voyageurs et vos préférences de confort.
            <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-luxury-black rotate-45" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl lg:rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-neutral-200 dark:border-neutral-800 p-2 flex flex-col lg:flex-row items-center transition-colors duration-500 gap-2 lg:gap-0">
        
        {/* Location */}
        <div className="relative flex-1 w-full lg:w-auto min-w-0" ref={locationRef}>
          <div 
            className="w-full flex items-center gap-3 px-6 py-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            onClick={() => setIsLocationOpen(true)}
          >
            <MapPin className="w-5 h-5 text-luxury-gold shrink-0" />
            <div className="flex flex-col w-full overflow-hidden min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Destination</span>
              <input
                type="text"
                value={isLocationOpen ? locationSearch : (filters.location || "Tout le Maroc")}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Où allez-vous ?"
                className="bg-transparent border-none p-0 text-sm font-semibold text-luxury-black dark:text-white focus:ring-0 w-full placeholder:text-neutral-300 truncate"
              />
            </div>
          </div>
          
          <AnimatePresence>
            {isLocationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 w-full min-w-[320px] mt-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-[100] overflow-hidden p-2"
              >
                {locationSearch === "" && recentSearches.length > 0 && (
                  <div className="px-4 py-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Recherches récentes</span>
                    <div className="mt-2 space-y-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => {
                            setFilters({ location: search });
                            setIsLocationOpen(false);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl text-left text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-luxury-gold flex items-center gap-3 transition-colors"
                        >
                          <Search className="w-4 h-4" /> {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
                  <button
                    onClick={() => {
                      setFilters({ location: "Tout le Maroc" });
                      setIsLocationOpen(false);
                    }}
                    className="w-full p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors text-sm font-bold text-luxury-gold border-b border-neutral-100 dark:border-neutral-800"
                  >
                    Tout le Maroc
                  </button>
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setFilters({ location: `${loc.city}, ${loc.region}` });
                        setIsLocationOpen(false);
                      }}
                      className="w-full p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0 group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-luxury-gold transition-colors">{loc.city}</span>
                        <span className="text-[11px] text-neutral-400 mt-0.5">{loc.region} • {loc.category}</span>
                      </div>
                    </button>
                  ))}
                  {filteredLocations.length === 0 && (
                    <div className="p-8 text-center text-neutral-400 text-sm">Aucune destination trouvée</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />

        {/* Dates */}
        <div className="relative flex-[1.2] w-full lg:w-auto min-w-0">
          <div className="w-full flex items-center gap-3 px-6 py-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-luxury-gold/30">
            <Calendar className="w-5 h-5 text-luxury-gold shrink-0" />
            <div className="flex flex-col w-full min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Séjour</span>
              <div className="flex items-center gap-1">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters({ startDate: date })}
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  placeholderText="Arrivée"
                  className="bg-transparent border-none p-0 text-sm font-semibold text-luxury-black dark:text-white focus:ring-0 w-[65px] placeholder:text-neutral-300 dark:placeholder:text-neutral-600 cursor-pointer"
                />
                <span className="text-neutral-300 dark:text-neutral-600">-</span>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters({ endDate: date })}
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate || undefined}
                  placeholderText="Départ"
                  className="bg-transparent border-none p-0 text-sm font-semibold text-luxury-black dark:text-white focus:ring-0 w-[65px] placeholder:text-neutral-300 dark:placeholder:text-neutral-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />

        {/* Guests */}
        <div className="relative flex-1 w-full lg:w-auto min-w-0" ref={guestsRef}>
          <button
            onClick={() => setIsGuestsOpen(!isGuestsOpen)}
            className="w-full flex items-center gap-3 px-6 py-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-luxury-gold shrink-0" />
            <div className="flex flex-col w-full min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Voyageurs</span>
              <span className="text-sm font-semibold text-luxury-black dark:text-white truncate">
                {filters.guests.adults + filters.guests.children} pers.
                {filters.guests.infants > 0 && `, ${filters.guests.infants} bébés`}
              </span>
            </div>
          </button>
          
          <AnimatePresence>
            {isGuestsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 md:left-auto md:right-0 w-full md:w-80 mt-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-[100] p-6 space-y-6"
              >
                {[
                  { id: "adults", label: "Adultes", desc: "13 ans et plus" },
                  { id: "children", label: "Enfants", desc: "De 2 à 12 ans" },
                  { id: "infants", label: "Bébés", desc: "Moins de 2 ans" },
                ].map((type) => (
                  <div key={type.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-luxury-black dark:text-white">{type.label}</div>
                      <div className="text-xs text-neutral-500">{type.desc}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateGuests(type.id as any, -1)}
                        className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-luxury-gold hover:text-luxury-gold transition-colors disabled:opacity-30"
                        disabled={type.id === "adults" ? filters.guests.adults <= 1 : filters.guests[type.id as keyof typeof filters.guests] <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-4 text-center font-medium text-luxury-black dark:text-white">
                        {filters.guests[type.id as keyof typeof filters.guests]}
                      </span>
                      <button
                        onClick={() => updateGuests(type.id as any, 1)}
                        className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />

        {/* Pets */}
        <div className="relative flex-1 w-full lg:w-auto min-w-0">
          <div className="w-full flex items-center justify-between lg:justify-start gap-3 px-6 py-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Animaux</span>
              <span className="text-sm font-semibold text-luxury-black dark:text-white truncate">
                Acceptés
              </span>
            </div>
            <button 
              onClick={() => {
                const newValue = !filters.petFriendly;
                setFilters({ petFriendly: newValue });
                useStore.getState().trackPetFriendly(newValue);
              }}
              className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${filters.petFriendly ? "bg-luxury-gold" : "bg-neutral-300 dark:bg-neutral-600"}`}
            >
              <div 
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300" 
                style={{ left: filters.petFriendly ? 'calc(100% - 1.125rem)' : '0.125rem' }} 
              />
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />

        {/* Filters Toggle */}
        <div className="relative w-full lg:w-auto min-w-0" ref={filtersRef}>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-6 py-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
          >
            <div className="relative">
              <SlidersHorizontal className="w-5 h-5 text-luxury-gold shrink-0" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full border-2 border-white dark:border-neutral-900" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-0.5">Filtres</span>
              <span className="text-sm font-semibold text-luxury-black dark:text-white truncate">
                {activeFiltersCount > 0 ? `${activeFiltersCount} actif(s)` : "Avancés"}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 w-full md:w-[400px] mt-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-[100] p-6 space-y-8"
              >
                {/* Budget */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-luxury-black dark:text-white mb-4">
                    <Wallet className="w-4 h-4 text-luxury-gold" /> Budget par nuit
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">€</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0] || ""}
                        onChange={(e) => setFilters({ priceRange: [e.target.value ? Number(e.target.value) : 0, filters.priceRange[1]] })}
                        className="w-full pl-8 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold outline-none"
                      />
                    </div>
                    <span className="text-neutral-400">-</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">€</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1] < 10000 ? filters.priceRange[1] : ""}
                        onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], e.target.value ? Number(e.target.value) : 10000] })}
                        className="w-full pl-8 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-luxury-black dark:text-white mb-4">
                    <Home className="w-4 h-4 text-luxury-gold" /> Type de bien
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Villa", "Appartement", "Riad", "Penthouse", "Tous"] as PropertyType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ propertyType: type })}
                        className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                          filters.propertyType === type 
                            ? "bg-luxury-gold text-white" 
                            : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intent */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-luxury-black dark:text-white mb-4">
                    <Compass className="w-4 h-4 text-luxury-gold" /> Style de voyage
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(["Luxury", "Family", "Business", "Romantic", "Adventure"] as TravelIntent[]).map((intent) => (
                      <button
                        key={intent}
                        onClick={() => setFilters({ travelIntent: filters.travelIntent === intent ? undefined : intent })}
                        className={`py-2 px-4 rounded-full text-xs font-bold tracking-wide transition-colors ${
                          filters.travelIntent === intent 
                            ? "bg-luxury-black dark:bg-white text-white dark:text-luxury-black" 
                            : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {intent}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                  <button
                    onClick={() => {
                      setFilters({ priceRange: [0, 10000], propertyType: "Tous", travelIntent: undefined });
                    }}
                    className="text-sm font-medium text-neutral-500 hover:text-luxury-black dark:hover:text-white transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <div className="w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full lg:w-auto h-14 px-8 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg shadow-luxury-gold/20 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="lg:hidden xl:inline">Rechercher</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
