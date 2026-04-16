import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";

export const AdminBookings = () => {
  const chefBookings = useStore((state) => state.chefBookings);
  const updateChefBookingStatus = useStore((state) => state.updateChefBookingStatus);
  const addNotification = useStore((state) => state.addNotification);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = chefBookings.filter(
    (b) =>
      b.chefName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, status: "pending" | "confirmed" | "cancelled") => {
    updateChefBookingStatus(id, status);
    addNotification(`Statut de la réservation mis à jour : ${status}`, "success");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Confirmé</span>;
      case "cancelled":
        return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12} /> Annulé</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> En attente</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white">Gestion des Réservations</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par ID ou nom du chef..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4 font-medium text-sm text-neutral-500">ID Réservation</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Chef</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Date</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Statut</th>
              <th className="p-4 font-medium text-sm text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-mono text-xs text-neutral-500">{booking.id}</td>
                <td className="p-4 font-medium">{booking.chefName}</td>
                <td className="p-4 text-neutral-500">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="p-4">{getStatusBadge(booking.status)}</td>
                <td className="p-4 text-right space-x-2">
                  <select 
                    className="p-2 rounded border dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmer</option>
                    <option value="cancelled">Annuler</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  Aucune réservation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
