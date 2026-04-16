import React from "react";
import { useStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { ChevronDown, LayoutGrid, Map as MapIcon, SlidersHorizontal } from "lucide-react";

export const MarketplaceHeader = ({ totalResults }: { totalResults: number }) => {
  const { sortBy, setSortBy, isMapViewOpen, setMapViewOpen } = useStore();

  const sortOptions = [
    { value: "relevant", label: "Plus pertinents" },
    { value: "price_asc", label: "Prix croissant" },
    { value: "price_desc", label: "Prix décroissant" },
    { value: "newest", label: "Plus récents" },
    { value: "views", label: "Plus consultés" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white">
          Toutes les Propriétés
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          {totalResults} propriétés disponibles au Maroc
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Map Toggle */}
        <button
          onClick={() => setMapViewOpen(!isMapViewOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border",
            isMapViewOpen
              ? "bg-luxury-black text-white border-luxury-black dark:bg-white dark:text-luxury-black dark:border-white"
              : "bg-white text-luxury-black border-gray-200 hover:border-luxury-gold dark:bg-neutral-900 dark:text-white dark:border-neutral-800"
          )}
        >
          {isMapViewOpen ? <LayoutGrid size={14} /> : <MapIcon size={14} />}
          {isMapViewOpen ? "Afficher la Grille" : "Afficher la Carte"}
        </button>

        {/* Sort Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-widest text-luxury-black dark:text-white hover:border-luxury-gold transition-all">
            Trier par: {sortOptions.find(o => o.value === sortBy)?.label}
            <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={cn(
                  "w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800",
                  sortBy === option.value ? "text-luxury-gold bg-luxury-gold/5" : "text-gray-600 dark:text-gray-300"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
