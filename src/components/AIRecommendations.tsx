import React, { useEffect, useState } from "react";
import { Sparkles, Brain, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store/useStore";
import { PropertyCard } from "./PropertyCard";
import { Property } from "../types";
import { EditableText } from "./ui/EditableText";

export const AIRecommendations = () => {
  const { properties, recentlyViewed, user, content, updateContent } = useStore();
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis based on recently viewed and user preferences
    const timer = setTimeout(() => {
      let filtered = [...properties];
      
      // Simple "AI" logic: if they viewed something, prioritize similar types or locations
      if (recentlyViewed.length > 0) {
        const lastViewed = properties.find(p => p.id === recentlyViewed[0].propertyId);
        if (lastViewed) {
          filtered = properties.filter(p => p.id !== lastViewed.id)
            .sort((a, b) => {
              let scoreA = 0;
              let scoreB = 0;
              if (a.type === lastViewed.type) scoreA += 2;
              if (b.type === lastViewed.type) scoreB += 2;
              if (a.location === lastViewed.location) scoreA += 1;
              if (b.location === lastViewed.location) scoreB += 1;
              return scoreB - scoreA;
            });
        }
      } else {
        // Default to high match scores
        filtered = properties.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }

      setRecommendations(filtered.slice(0, 4));
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [properties, recentlyViewed]);

  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black text-luxury-black dark:text-white transition-colors duration-500 overflow-hidden relative">
      {/* Decorative AI background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-gold rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxury-gold/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-luxury-gold mb-4">
              <Sparkles size={20} className="animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-[0.4em]">Moteur de Recommandation IA</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">
              <EditableText 
                value={content["ai.title"] || "Recommandations Intelligentes"}
                onChange={(val) => updateContent("ai.title", val)}
              />
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-lg font-light">
              <EditableText 
                value={content["ai.desc"] || "Notre algorithme analyse vos préférences et votre comportement pour vous proposer les séjours les plus adaptés à vos envies."}
                onChange={(val) => updateContent("ai.desc", val)}
                multiline
              />
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center w-40 shadow-sm">
              <Brain className="text-luxury-gold mb-3" size={32} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Analyse</span>
              <span className="text-lg font-serif">Prédictive</span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex flex-col items-center text-center w-40 shadow-sm">
              <Zap className="text-luxury-gold mb-3" size={32} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Match</span>
              <span className="text-lg font-serif">Instantané</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-luxury-gold/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-luxury-gold rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-luxury-gold animate-pulse" size={32} />
              </div>
              <p className="text-xl font-serif italic text-luxury-gold animate-pulse">
                Analyse de votre profil en cours...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {recommendations.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-center">
          <button className="group flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-luxury-black dark:text-white hover:text-luxury-gold transition-colors">
            Découvrir plus de pépites <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
