import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Users, Play, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminSimulation = () => {
  const [activeProfile, setActiveProfile] = useState("tourist");
  const addNotification = useStore((state) => state.addNotification);

  const profiles = [
    { id: "tourist", name: "Touriste International", desc: "Recherche de luxe, court séjour, forte importance de la localisation." },
    { id: "investor", name: "Investisseur", desc: "Recherche de rentabilité, achat potentiel, importance des données de marché." },
    { id: "returning", name: "Client Fidèle", desc: "Connaît déjà la plateforme, recherche des expériences personnalisées." },
  ];

  const handleSimulate = () => {
    addNotification(`Simulation du profil "${profiles.find(p => p.id === activeProfile)?.name}" activée.`, "info");
    // In a real app, this would update global state to alter recommendations/UI
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Simulation Utilisateur</h2>
        <p className="text-neutral-500">Testez le comportement de la plateforme selon différents profils.</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
            <Users size={20} />
          </div>
          <h3 className="font-medium text-lg text-luxury-black dark:text-white">Profils de Test</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeProfile === profile.id 
                  ? "border-luxury-gold bg-luxury-gold/5" 
                  : "border-neutral-200 dark:border-neutral-800 hover:border-luxury-gold/30"
              }`}
            >
              <h4 className="font-medium text-luxury-black dark:text-white mb-2">{profile.name}</h4>
              <p className="text-xs text-neutral-500">{profile.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw size={16} /> Réinitialiser
          </Button>
          <Button onClick={handleSimulate} className="flex items-center gap-2">
            <Play size={16} /> Lancer la Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};
