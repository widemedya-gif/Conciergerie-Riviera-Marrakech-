import React from "react";
import { useStore } from "@/src/store/useStore";
import { SlidersHorizontal, Settings2 } from "lucide-react";

export const AdminFiltersLogic = () => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Filtres & Logique</h2>
        <p className="text-neutral-500">Configurez le comportement du moteur de recherche et des filtres.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <SlidersHorizontal size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Catégories de Budget</h3>
          </div>
          
          <div className="space-y-3">
            {["Budget", "Standard", "Premium", "Luxe"].map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{cat}</span>
                <button className="text-xs text-luxury-gold hover:underline">Modifier</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Settings2 size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Logique de Recherche</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Recherche stricte (tous les critères)</span>
              <input type="checkbox" className="accent-luxury-gold" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Afficher les propriétés indisponibles</span>
              <input type="checkbox" className="accent-luxury-gold" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Prioriser les Superhosts</span>
              <input type="checkbox" className="accent-luxury-gold" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
