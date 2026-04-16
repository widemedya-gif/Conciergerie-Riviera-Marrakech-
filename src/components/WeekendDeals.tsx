import React from "react";
import { motion } from "motion/react";
import { useStore } from "../store/useStore";
import { PropertyCard } from "./PropertyCard";
import { Clock } from "lucide-react";

export const WeekendDeals = () => {
  const { properties, organizedTrips } = useStore();

  // Filter logic: Short duration properties and trips
  const weekendProperties = properties.filter(p => p.priceInsight === "Good deal" || p.priceInsight === "Best value").slice(0, 2);
  const weekendTrips = organizedTrips.filter(t => t.duration === "1 day" || t.duration === "2 days").slice(0, 2);

  if (weekendProperties.length === 0 && weekendTrips.length === 0) return null;

  return (
    <section className="py-24 bg-[#F9F8F6] dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Clock className="w-4 h-4" /> Offres limitées
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-black dark:text-white">
              Évasions du week-end
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            Profitez de nos meilleures offres pour des séjours courts et des escapades inoubliables.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weekendProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -15% Week-end
              </div>
              <PropertyCard property={property} />
            </motion.div>
          ))}

          {weekendTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 2) * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Offre Spéciale
                </div>
                <img src={trip.images[0]} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                  {trip.duration}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">{trip.destination}</div>
                <h5 className="font-bold text-lg mb-2 text-luxury-black dark:text-white line-clamp-1">{trip.title}</h5>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 line-through">{trip.price + 200} €</span>
                    <span className="text-luxury-gold font-bold text-lg">{trip.price} €</span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-luxury-black dark:text-white hover:bg-luxury-gold hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
