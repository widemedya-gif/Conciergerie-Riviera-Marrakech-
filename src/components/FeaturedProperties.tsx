import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROPERTIES } from "@/src/constants";
import { cn } from "@/src/lib/utils";
import { PropertyCard } from "./PropertyCard";
import { QuickViewModal } from "./QuickViewModal";
import { useStore } from "../store/useStore";

const FILTERS = [
  "Tous", "Villa", "Appartement", "Riad", "Budget", "Standard", "Premium", "Luxe"
];

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const { setProperties, properties, setPropertiesPageOpen } = useStore();

  useEffect(() => {
    setProperties(PROPERTIES);
  }, [setProperties]);

  const filteredProperties = activeFilter === "Tous" 
    ? properties.filter(p => (p as any).status === "active")
    : properties.filter(p => 
        ((p as any).status === "active") && (p.type === activeFilter || p.budgetCategory === activeFilter)
      );

  return (
    <section id="featured-properties" className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-tight text-luxury-black dark:text-white">Propriétés en Vedette</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-lg font-light">
              Découvrez les dernières propriétés publiées par nos propriétaires partenaires.
            </p>
          </motion.div>
          
          {/* Quick Filters */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex overflow-x-auto pb-4 md:pb-0 gap-3 custom-scrollbar"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap border",
                  activeFilter === filter
                    ? "bg-luxury-black text-white border-luxury-black dark:bg-white dark:text-luxury-black dark:border-white"
                    : "bg-transparent text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-luxury-gold hover:text-luxury-gold"
                )}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[3rem] border border-dashed border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 dark:text-neutral-400 font-serif italic text-xl">
              Aucune propriété n'est encore disponible. <br />
              <span className="text-sm font-sans not-italic mt-2 block">Les propriétaires peuvent commencer à publier leurs biens.</span>
            </p>
          </div>
        )}
        
        <div className="mt-20 text-center">
          <motion.button 
            onClick={() => setPropertiesPageOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-5 bg-luxury-black text-white dark:bg-white dark:text-luxury-black rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-luxury-gold transition-all duration-500 shadow-xl"
          >
            Voir Toutes les Propriétés
          </motion.button>
        </div>
      </div>

      <QuickViewModal />
    </section>
  );
}
