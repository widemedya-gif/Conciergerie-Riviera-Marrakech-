import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, SlidersHorizontal, Search } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { propertyService } from "@/src/services/api";
import { Skeleton } from "@/src/components/ui/BaseComponents";
import { PropertyCard } from "@/src/components/PropertyCard";
import { QuickViewModal } from "@/src/components/QuickViewModal";
import { BookingEngine } from "@/src/components/BookingEngine";

export default function ShortTermRentals() {
  const { filters, setFilters, properties, setProperties } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // Force rentalType to short-term for this page
  useEffect(() => {
    setFilters({ rentalType: "short-term" });
  }, [setFilters]);

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        // Ensure we only fetch short-term rentals
        const data = await propertyService.fetchProperties({ ...filters, rentalType: "short-term" });
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProperties();
  }, [filters, setProperties]);

  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-24 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Séjours Exclusifs
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-luxury-black dark:text-white mb-6">
              Location à Courte Durée
            </h1>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg mb-12">
              Découvrez notre sélection de propriétés de prestige disponibles pour des séjours inoubliables au Maroc.
            </p>
          </motion.div>
        </div>
        
        {/* Search Bar */}
        <div className="relative z-30 mt-8">
          <BookingEngine />
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4 text-neutral-400 dark:text-neutral-500 text-sm font-medium">
              <span>Affichage de {properties.length} résultats</span>
              <div className="w-12 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
              <button className="text-luxury-black dark:text-white hover:text-luxury-gold transition-colors">Trier par : Recommandé</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="space-y-4">
                    <Skeleton className="aspect-[4/5] w-full rounded-[2.5rem]" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : properties.length > 0 ? (
                properties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="text-neutral-300 dark:text-neutral-700" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif mb-2 text-luxury-black dark:text-white">Aucune propriété trouvée</h3>
                  <p className="text-neutral-400 dark:text-neutral-500">Essayez d'ajuster vos filtres pour trouver votre séjour idéal.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      <QuickViewModal />
    </div>
  );
}
