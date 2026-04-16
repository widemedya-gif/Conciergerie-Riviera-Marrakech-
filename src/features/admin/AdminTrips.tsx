import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { OrganizedTrip } from "@/src/types";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";

export const AdminTrips = () => {
  const trips = useStore((state) => state.organizedTrips);
  const setOrganizedTrips = useStore((state) => state.setOrganizedTrips);
  const addNotification = useStore((state) => state.addNotification);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<OrganizedTrip>>({});

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (trip: OrganizedTrip) => {
    setEditingId(trip.id);
    setEditForm(trip);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      const updatedTrips = trips.map(t => t.id === editingId ? { ...t, ...editForm } as OrganizedTrip : t);
      setOrganizedTrips(updatedTrips);
      setEditingId(null);
      addNotification("Voyage mis à jour", "success");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce voyage ?")) {
      setOrganizedTrips(trips.filter(t => t.id !== id));
      addNotification("Voyage supprimé", "info");
    }
  };

  const handleAddNew = () => {
    const newId = `trip_${Date.now()}`;
    const newTrip: OrganizedTrip = {
      id: newId,
      title: "Nouveau Voyage",
      destination: "Marrakech",
      duration: "1 jour",
      price: 500,
      includedServices: ["Transport"],
      activityTags: ["Cultural"],
      rating: 5.0,
      images: ["https://picsum.photos/seed/newtrip/800/600"],
      description: "Description du voyage...",
      petFriendly: false
    };
    setOrganizedTrips([...trips, newTrip]);
    setEditingId(newId);
    setEditForm(newTrip);
    addNotification("Nouveau voyage ajouté", "success");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white">Gestion des Voyages Organisés</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} /> Ajouter un Voyage
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par titre ou destination..."
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
              <th className="p-4 font-medium text-sm text-neutral-500">Destination</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Durée</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Prix</th>
              <th className="p-4 font-medium text-sm text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                {editingId === trip.id ? (
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
                        <label className="text-xs text-neutral-500">Destination</label>
                        <input
                          value={editForm.destination || ""}
                          onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                          className="w-full p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-neutral-500">Durée</label>
                        <input
                          value={editForm.duration || ""}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
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
                      <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <Button variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white border-none">Sauvegarder</Button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-medium">{trip.title}</td>
                    <td className="p-4 text-neutral-500">{trip.destination}</td>
                    <td className="p-4 text-neutral-500">{trip.duration}</td>
                    <td className="p-4 text-luxury-gold">{trip.price} MAD</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(trip)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(trip.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
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
