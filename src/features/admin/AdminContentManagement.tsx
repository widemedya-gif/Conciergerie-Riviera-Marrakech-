import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { FileText, Save, Search } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminContentManagement = () => {
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);
  const addNotification = useStore((state) => state.addNotification);
  const [searchTerm, setSearchTerm] = useState("");

  const [localContent, setLocalContent] = useState(content);

  const handleSave = () => {
    Object.entries(localContent).forEach(([key, value]) => {
      updateContent(key, value as string);
    });
    addNotification("Contenu mis à jour avec succès", "success");
  };

  const filteredKeys = Object.keys(localContent).filter(key => 
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    localContent[key].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Gestion du Contenu</h2>
          <p className="text-neutral-500">Modifiez tous les textes de la plateforme depuis cet espace centralisé.</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} /> Enregistrer les modifications
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un texte ou une clé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 font-medium text-sm text-neutral-500">
          <div className="col-span-4">Identifiant (Clé)</div>
          <div className="col-span-8">Contenu</div>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {filteredKeys.map((key) => (
            <div key={key} className="grid grid-cols-12 gap-4 p-4 items-start hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
              <div className="col-span-4">
                <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-luxury-gold">
                  {key}
                </code>
              </div>
              <div className="col-span-8">
                {localContent[key].length > 50 ? (
                  <textarea
                    value={localContent[key]}
                    onChange={(e) => setLocalContent({ ...localContent, [key]: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-luxury-gold outline-none min-h-[100px] resize-y text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={localContent[key]}
                    onChange={(e) => setLocalContent({ ...localContent, [key]: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-luxury-gold outline-none text-sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
