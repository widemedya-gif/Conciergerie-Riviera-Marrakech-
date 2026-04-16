import React, { useState, useMemo } from "react";
import { useStore } from "../../store/useStore";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceSidebar } from "./MarketplaceSidebar";
import { MarketplaceGrid } from "./MarketplaceGrid";
import { MarketplaceMap } from "./MarketplaceMap";
import { QuickViewModal } from "../../components/QuickViewModal";
import { ComparisonBar } from "./ComparisonBar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { ArrowLeft } from "lucide-react";

export const PropertiesPage = () => {
  const { 
    properties, 
    filters, 
    sortBy, 
    isMapViewOpen, 
    setPropertiesPageOpen 
  } = useStore();

  // Filter and Sort Logic
  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => {
      // Visibility Rule: Only show published (active) properties
      if ((p as any).status !== "active") return false;

      // Basic filters
      const matchesType = filters.propertyType === "Tous" || p.type === filters.propertyType;
      const matchesLocation = filters.location === "Tout le Maroc" || p.city === filters.location;
      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const matchesBedrooms = !filters.bedrooms || p.capacity >= filters.bedrooms;
      const matchesAmenities = filters.amenities.every(a => p.amenities.includes(a));
      const matchesQuery = !filters.query || 
        p.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        p.city.toLowerCase().includes(filters.query.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesSurface = !filters.surface || (p.size || 0) <= filters.surface[1];
      const matchesCondition = filters.condition === "Tous" || p.condition === filters.condition;
      const matchesView = filters.view === "Tous" || p.view === filters.view;
      const matchesFloor = !filters.floor || p.floor === filters.floor;
      
      const matchesFeatures = 
        (!filters.furnished || p.furnished) &&
        (!filters.parking || p.parking) &&
        (!filters.security || p.security) &&
        (!filters.pool || p.pool) &&
        (!filters.garden || p.garden) &&
        (!filters.terrace || p.terrace) &&
        (!filters.elevator || p.elevator);
      
      return matchesType && matchesLocation && matchesPrice && matchesBedrooms && matchesAmenities && matchesQuery && matchesSurface && matchesCondition && matchesView && matchesFloor && matchesFeatures;
    });

    // Sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Simulated newest
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "views":
        result.sort((a, b) => (b.viewCountToday || 0) - (a.viewCountToday || 0));
        break;
      default:
        // Relevant: sort by match score
        result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return result;
  }, [properties, filters, sortBy]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-luxury-black pt-24 pb-20">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        {/* Back Button */}
        <button 
          onClick={() => setPropertiesPageOpen(false)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <MarketplaceSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <MarketplaceHeader totalResults={filteredProperties.length} />

            <div className={cn(
              "transition-all duration-500",
              isMapViewOpen ? "h-[800px] flex gap-6" : "h-auto"
            )}>
              {/* Grid View */}
              <div className={cn(
                "transition-all duration-500",
                isMapViewOpen ? "w-1/2 overflow-y-auto pr-4 custom-scrollbar" : "w-full"
              )}>
                <MarketplaceGrid properties={filteredProperties} />
              </div>

              {/* Map View */}
              {isMapViewOpen && (
                <div className="w-1/2 h-full sticky top-24">
                  <MarketplaceMap properties={filteredProperties} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <QuickViewModal />
      <ComparisonBar />
    </div>
  );
};
