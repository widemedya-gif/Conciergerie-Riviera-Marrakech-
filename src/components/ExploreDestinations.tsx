import React from "react";
import { motion } from "motion/react";
import { useStore } from "../store/useStore";
import { EditableText } from "./ui/EditableText";

export const ExploreDestinations = () => {
  const { locations, setFilters, content, updateContent, userBehaviorTracking } = useStore();

  // Personalization logic: Reorder cards based on favorite locations
  const sortedLocations = [...locations].sort((a, b) => {
    const aScore = userBehaviorTracking.favoriteLocations.filter(loc => loc.includes(a.city)).length;
    const bScore = userBehaviorTracking.favoriteLocations.filter(loc => loc.includes(b.city)).length;
    return bScore - aScore;
  });

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black dark:text-white mb-4">
            <EditableText 
              value={content["destinations.title"] || "Explorez le Maroc"}
              onChange={(val) => updateContent("destinations.title", val)}
            />
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            <EditableText 
              value={content["destinations.desc"] || "Découvrez nos sélections exclusives dans les plus belles villes du royaume."}
              onChange={(val) => updateContent("destinations.desc", val)}
              multiline
            />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedLocations.slice(0, 8).map((loc, index) => (
            <motion.button
              key={loc.id}
              whileHover={{ y: -10 }}
              onClick={() => {
                setFilters({ location: `${loc.city}, ${loc.region}` });
                useStore.getState().trackLocation(loc.city);
              }}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-neutral-300 dark:bg-neutral-800" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">{loc.city}</h3>
                <p className="text-sm text-white/80">{loc.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
