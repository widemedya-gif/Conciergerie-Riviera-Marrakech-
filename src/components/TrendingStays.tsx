import React from "react";
import { motion } from "motion/react";
import { useStore } from "../store/useStore";
import { PropertyCard } from "./PropertyCard";

export const TrendingStays = () => {
  const { properties, userBehaviorTracking } = useStore();

  // Personalization logic: Reorder based on simulated engagement + pet friendly preference
  const sortedProperties = [...properties].sort((a, b) => {
    let scoreA = (a.viewCountToday || 0) + (a.matchScore || 0);
    let scoreB = (b.viewCountToday || 0) + (b.matchScore || 0);
    
    if (userBehaviorTracking.petFriendlySelected > 0) {
      if (a.petFriendly) scoreA += 50;
      if (b.petFriendly) scoreB += 50;
    }
    
    return scoreB - scoreA;
  });

  if (sortedProperties.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-luxury-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black dark:text-white mb-4">
            Les hébergements que les clients adorent
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Découvrez les propriétés les plus populaires et les mieux notées.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties.slice(0, 3).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 -right-4 z-10 bg-luxury-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Most loved ❤️
              </div>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
