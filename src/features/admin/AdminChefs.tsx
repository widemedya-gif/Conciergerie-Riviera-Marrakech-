import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Chef } from "@/src/types";
import { Plus, Edit2, Trash2, Search, X, Check } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminChefs = () => {
  const chefs = useStore((state) => state.chefs);
  const addChef = useStore((state) => state.addChef);
  const updateChef = useStore((state) => state.updateChef);
  const addNotification = useStore((state) => state.addNotification);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Chef>>({});

  const filteredChefs = chefs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (chef: Chef) => {
    setEditingId(chef.id);
    setEditForm(chef);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      updateChef(editingId, editForm);
      setEditingId(null);
      addNotification("Chef mis à jour", "success");
    }
  };

  const handleAddNew = () => {
    const newId = `chef_${Date.now()}`;
    const newChef: Chef = {
      id: newId,
      name: "Nouveau Chef",
      specialties: ["Cuisine Marocaine"],
      experienceYears: 5,
      rating: 5.0,
      image: "https://picsum.photos/seed/newchef/400/400",
      bio: "Biographie du chef...",
      menus: []
    };
    addChef(newChef);
    setEditingId(newId);
    setEditForm(newChef);
    addNotification("Nouveau chef ajouté", "success");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white">Gestion des Chefs Privés</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} /> Ajouter un Chef
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom ou spécialité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4 font-medium text-sm text-neutral-500">Nom</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Spécialités</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Expérience</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Note</th>
              <th className="p-4 font-medium text-sm text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChefs.map((chef) => (
              <tr key={chef.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                {editingId === chef.id ? (
                  <td colSpan={5} className="p-4">
                    <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Nom</label>
                        <input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Expérience (années)</label>
                        <input
                          type="number"
                          value={editForm.experienceYears || 0}
                          onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-xs text-neutral-500">Spécialités (séparées par des virgules)</label>
                        <input
                          value={editForm.specialties?.join(", ") || ""}
                          onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value.split(",").map(s => s.trim()) })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <Button variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white border-none">Sauvegarder</Button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-medium">{chef.name}</td>
                    <td className="p-4 text-neutral-500">{chef.specialties.join(", ")}</td>
                    <td className="p-4 text-neutral-500">{chef.experienceYears} ans</td>
                    <td className="p-4 text-luxury-gold">{chef.rating} ★</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(chef)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
