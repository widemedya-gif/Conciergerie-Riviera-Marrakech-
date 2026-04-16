import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Property } from "@/src/types";
import { Plus, Edit2, Trash2, Search, X, Check } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminListings = () => {
  const properties = useStore((state) => state.properties);
  const addProperty = useStore((state) => state.addProperty);
  const updateProperty = useStore((state) => state.updateProperty);
  const deleteProperty = useStore((state) => state.deleteProperty);
  const addNotification = useStore((state) => state.addNotification);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (property: Property) => {
    setEditingId(property.id);
    setEditForm(property);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      updateProperty(editingId, editForm);
      setEditingId(null);
      addNotification("Propriété mise à jour", "success");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")) {
      deleteProperty(id);
      addNotification("Propriété supprimée", "info");
    }
  };

  const handleAddNew = () => {
    const newId = `prop_${Date.now()}`;
    const newProperty: Property = {
      id: newId,
      title: "Nouvelle Propriété",
      city: "Marrakech",
      region: "Marrakech-Safi",
      location: "Marrakech",
      price: 1000,
      rating: 5.0,
      images: ["https://picsum.photos/seed/newprop/800/600"],
      isSuperhost: false,
      type: "Villa",
      budgetCategory: "Premium",
      category: "luxury",
      travelIntents: ["Luxury"],
      amenities: ["Wifi"],
      description: "Description de la nouvelle propriété.",
      reviews: [],
      unavailableDates: [],
      capacity: 2,
      petFriendly: false,
    };
    addProperty(newProperty);
    setEditingId(newId);
    setEditForm(newProperty);
    addNotification("Nouvelle propriété créée", "success");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white">Gestion des Propriétés</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} /> Ajouter une Propriété
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom ou ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4 font-medium text-sm text-neutral-500">Titre</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Ville</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Prix/Nuit</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Type</th>
              <th className="p-4 font-medium text-sm text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                {editingId === property.id ? (
                  <td colSpan={5} className="p-4">
                    <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Titre</label>
                        <input
                          value={editForm.title || ""}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Ville</label>
                        <input
                          value={editForm.city || ""}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Prix (MAD)</label>
                        <input
                          type="number"
                          value={editForm.price || 0}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Type</label>
                        <select
                          value={editForm.type || "Villa"}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        >
                          <option value="Villa">Villa</option>
                          <option value="Appartement">Appartement</option>
                          <option value="Riad">Riad</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={editForm.petFriendly || false}
                          onChange={(e) => setEditForm({ ...editForm, petFriendly: e.target.checked })}
                          className="w-4 h-4 accent-luxury-gold"
                        />
                        <label className="text-sm text-neutral-700 dark:text-neutral-300">Animaux acceptés</label>
                      </div>
                      <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <Button variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white border-none">Sauvegarder</Button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-medium">{property.title}</td>
                    <td className="p-4 text-neutral-500">{property.city}</td>
                    <td className="p-4 text-luxury-gold">{property.price} MAD</td>
                    <td className="p-4 text-neutral-500">{property.type}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(property)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(property.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
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
