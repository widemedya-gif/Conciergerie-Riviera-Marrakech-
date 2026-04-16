import React from "react";
import { useStore } from "@/src/store/useStore";
import { Settings, Shield, Database, Bell } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminSettings = () => {
  const addNotification = useStore((state) => state.addNotification);

  const handleSave = () => {
    addNotification("Paramètres système enregistrés", "success");
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Paramètres Système</h2>
          <p className="text-neutral-500">Configuration globale de la plateforme Elite.</p>
        </div>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Shield size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Sécurité & Accès</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="font-medium text-luxury-black dark:text-white">Code d'accès Administrateur</p>
                <p className="text-sm text-neutral-500">Modifier le code secret d'accès</p>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="font-medium text-luxury-black dark:text-white">Double Authentification (2FA)</p>
                <p className="text-sm text-neutral-500">Exiger une validation supplémentaire</p>
              </div>
              <input type="checkbox" className="accent-luxury-gold" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
              <Database size={20} />
            </div>
            <h3 className="font-medium text-lg text-luxury-black dark:text-white">Gestion des Données</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="font-medium text-luxury-black dark:text-white">Sauvegarde Automatique</p>
                <p className="text-sm text-neutral-500">Fréquence des backups système</p>
              </div>
              <select className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-sm">
                <option>Quotidienne</option>
                <option>Hebdomadaire</option>
                <option>Mensuelle</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="font-medium text-luxury-black dark:text-white">Vider le Cache</p>
                <p className="text-sm text-neutral-500">Forcer le rafraîchissement des données</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Vider</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
