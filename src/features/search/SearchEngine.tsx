import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Home, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/src/store/useStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/src/lib/utils";

const POPULAR_LOCATIONS = ["Marrakech", "Guéliz", "Hivernage", "Palmeraie", "Médina", "Ourika"];

export default function SearchEngine() {
  const { filters, setFilters } = useStore();
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [localLocation, setLocalLocation] = useState(filters.location);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ location: localLocation });
    }, 500);
    return () => clearTimeout(timer);
  }, [localLocation]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="glass p-2 rounded-[2.5rem] shadow-2xl border border-white/40">
        <div className="bg-white rounded-[2rem] p-2 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
          
          {/* Location Autocomplete */}
          <div className="relative flex items-center px-6 py-3 border-r border-gray-100 last:border-0 group">
            <MapPin className="text-luxury-gold mr-4 shrink-0" size={20} />
            <div className="text-left flex-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Destination</p>
              <input
                type="text"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                onFocus={() => setIsLocationFocused(true)}
                onBlur={() => setTimeout(() => setIsLocationFocused(false), 200)}
                placeholder="Où allez-vous ?"
                className="w-full text-sm font-medium focus:outline-none placeholder:text-gray-300 bg-transparent"
              />
            </div>
            
            <AnimatePresence>
              {isLocationFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50"
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 px-2">Destinations Populaires</p>
                  <div className="space-y-1">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocalLocation(loc)}
                        className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-3"
                      >
                        <MapPin size={14} className="text-gray-400" />
                        {loc}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Range */}
          <div className="flex items-center px-6 py-3 border-r border-gray-100 last:border-0 group">
            <Calendar className="text-luxury-gold mr-4 shrink-0" size={20} />
            <div className="text-left w-full">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Arrivée / Départ</p>
              <div className="flex gap-2">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null];
                    setFilters({ startDate: start, endDate: end });
                  }}
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  selectsRange
                  placeholderText="Ajouter dates"
                  className="w-full text-sm font-medium focus:outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Guests Selector */}
          <div className="flex items-center px-6 py-3 border-r border-gray-100 last:border-0 group">
            <Users className="text-luxury-gold mr-4 shrink-0" size={20} />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Voyageurs</p>
              <select 
                value={filters.guests.adults}
                onChange={(e) => setFilters({ guests: { ...filters.guests, adults: parseInt(e.target.value) } })}
                className="w-full text-sm font-medium focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value={1}>1 Adulte</option>
                <option value={2}>2 Adultes</option>
                <option value={4}>4 Adultes</option>
                <option value={6}>6+ Adultes</option>
              </select>
            </div>
          </div>

          {/* Budget Selector */}
          <div className="flex items-center px-6 py-3 border-r border-gray-100 last:border-0 group">
            <Wallet className="text-luxury-gold mr-4 shrink-0" size={20} />
            <div className="text-left flex-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Budget</p>
              <select 
                value={filters.budgetCategory}
                onChange={(e) => setFilters({ budgetCategory: e.target.value as any })}
                className="w-full text-sm font-medium focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="Tous">Tous les budgets</option>
                <option value="Budget">Abordable</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>
          </div>

          {/* Property Type & Search */}
          <div className="flex items-center pl-6 pr-2 group">
            <Home className="text-luxury-gold mr-4 shrink-0" size={20} />
            <div className="text-left flex-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Type</p>
              <select 
                value={filters.propertyType}
                onChange={(e) => setFilters({ propertyType: e.target.value as any })}
                className="w-full text-sm font-medium focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="Tous">Tous</option>
                <option value="Villa">Villa</option>
                <option value="Riad">Riad</option>
                <option value="Appartement">Appartement</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <button className="bg-luxury-black hover:bg-luxury-gold text-white p-4 rounded-2xl transition-all duration-500 shadow-xl shadow-black/20 flex items-center justify-center group-hover:scale-105">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
