import React from "react";
import { useStore } from "@/src/store/useStore";
import { Sparkles, Target, Star } from "lucide-react";

export const AdminRecommendations = () => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Moteur de Recommandation</h2>
        <p className="text-neutral-500">Configurez l'algorithme d'IA pour les suggestions de propriétés.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Target size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Pondération des Critères</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-neutral-400">Localisation</span>
                <span className="text-luxury-gold font-medium">40%</span>
              </div>
              <input type="range" className="w-full accent-luxury-gold" defaultValue={40} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-neutral-400">Prix vs Budget</span>
                <span className="text-luxury-gold font-medium">35%</span>
              </div>
              <input type="range" className="w-full accent-luxury-gold" defaultValue={35} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-neutral-400">Équipements</span>
                <span className="text-luxury-gold font-medium">25%</span>
              </div>
              <input type="range" className="w-full accent-luxury-gold" defaultValue={25} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Star size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Règles de Priorité</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Booster les "Coups de cœur"</span>
              <input type="checkbox" className="accent-luxury-gold" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Ignorer les propriétés non disponibles</span>
              <input type="checkbox" className="accent-luxury-gold" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Diversifier les types de propriétés</span>
              <input type="checkbox" className="accent-luxury-gold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
