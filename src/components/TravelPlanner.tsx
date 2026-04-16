import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Wallet, Compass, Sparkles } from "lucide-react";
import { useStore } from "../store/useStore";
import { PropertyCard } from "./PropertyCard";
import { TravelIntent } from "../types";

export const TravelPlanner = () => {
  const { properties, organizedTrips, setFilters, setPropertiesPageOpen } = useStore();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [plan, setPlan] = useState({
    destination: "",
    budget: "",
    withPets: false,
    travelType: "" as TravelIntent | ""
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      // Track behavior
      useStore.getState().trackPetFriendly(plan.withPets);
      if (plan.destination) useStore.getState().trackLocation(plan.destination);
    }, 1500);
  };

  const suggestedProperties = properties.filter(p => 
    (!plan.withPets || p.petFriendly) &&
    (!plan.destination || p.city.toLowerCase().includes(plan.destination.toLowerCase()))
  ).slice(0, 2);

  const suggestedTrips = organizedTrips.filter(t => 
    (!plan.withPets || t.petFriendly) &&
    (!plan.travelType || t.activityTags.includes(plan.travelType as TravelIntent))
  ).slice(0, 2);

  return (
    <section className="py-24 bg-luxury-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-luxury-gold via-transparent to-transparent" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-luxury-gold" />
            Planificateur de voyage IA
          </h2>
          <p className="text-neutral-400">
            Laissez notre intelligence artificielle créer votre itinéraire parfait au Maroc.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Destination */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Destination (Optionnel)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="text"
                    value={plan.destination}
                    onChange={(e) => setPlan({ ...plan, destination: e.target.value })}
                    placeholder="Ex: Marrakech, Agadir..."
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Budget estimé</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <select 
                    value={plan.budget}
                    onChange={(e) => setPlan({ ...plan, budget: e.target.value })}
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-luxury-gold outline-none transition-all appearance-none"
                  >
                    <option value="">Sélectionner un budget</option>
                    <option value="budget">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="luxe">Luxe absolu</option>
                  </select>
                </div>
              </div>

              {/* Travel Type */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Style de voyage</label>
                <div className="flex flex-wrap gap-3">
                  {(["Relax", "Adventure", "Luxury", "Cultural", "Romantic"] as TravelIntent[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPlan({ ...plan, travelType: type })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        plan.travelType === type 
                          ? "bg-luxury-gold text-white" 
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pets */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Animaux de compagnie</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPlan({ ...plan, withPets: true })}
                    className={`flex-1 py-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                      plan.withPets 
                        ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold" 
                        : "bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    🐾 Avec animaux
                  </button>
                  <button
                    onClick={() => setPlan({ ...plan, withPets: false })}
                    className={`flex-1 py-4 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                      !plan.withPets 
                        ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold" 
                        : "bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    Sans animaux
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-5 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Générer mon itinéraire
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif">Votre itinéraire sur mesure</h3>
              <button 
                onClick={() => setShowResults(false)}
                className="text-luxury-gold hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Modifier
              </button>
            </div>

            {/* Suggested Properties */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-luxury-gold/20 text-luxury-gold flex items-center justify-center text-sm">1</span>
                Où séjourner
              </h4>
              {suggestedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-center text-neutral-400">
                  Aucun hébergement ne correspond exactement à ces critères.
                </div>
              )}
            </div>

            {/* Suggested Trips */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-luxury-gold/20 text-luxury-gold flex items-center justify-center text-sm">2</span>
                Expériences recommandées
              </h4>
              {suggestedTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedTrips.map(trip => (
                    <div key={trip.id} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 group">
                      <div className="relative h-48">
                        <img src={trip.images[0]} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                          {trip.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <h5 className="font-bold text-lg mb-2">{trip.title}</h5>
                        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{trip.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-luxury-gold font-bold">{trip.price} €</span>
                          <button className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-luxury-gold hover:text-white transition-colors">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-center text-neutral-400">
                  Aucune expérience ne correspond exactement à ces critères.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
