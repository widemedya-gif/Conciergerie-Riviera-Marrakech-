import React from "react";
import { useStore } from "@/src/store/useStore";
import { Palette, Type, Layout } from "lucide-react";

export const AdminUICustomization = () => {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const addNotification = useStore((state) => state.addNotification);

  const handleThemeChange = () => {
    toggleTheme();
    addNotification(`Thème changé en ${theme === "light" ? "Sombre" : "Clair"}`, "success");
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Personnalisation de l'Interface</h2>
        <p className="text-neutral-500">Gérez les couleurs, la typographie et l'apparence globale de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Palette size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Thème Global</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div>
              <p className="font-medium text-luxury-black dark:text-white">Mode Sombre</p>
              <p className="text-sm text-neutral-500">Activer le thème sombre par défaut</p>
            </div>
            <button 
              onClick={handleThemeChange}
              className={`w-12 h-6 rounded-full transition-colors relative ${theme === "dark" ? "bg-luxury-gold" : "bg-neutral-300 dark:bg-neutral-600"}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* Typography Settings (Placeholder for future expansion) */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4 opacity-50 pointer-events-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Type size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Typographie</h3>
          </div>
          <p className="text-sm text-neutral-500">Configuration des polices (Bientôt disponible)</p>
        </div>
      </div>
    </div>
  );
};
