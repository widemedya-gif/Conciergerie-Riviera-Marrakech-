import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  User, 
  Check, 
  X, 
  MoreVertical, 
  MessageSquare, 
  Clock,
  Filter,
  Search,
  ChevronRight
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const OwnerBookings = () => {
  const { ownerBookings, addNotification } = useStore();
  const [filter, setFilter] = useState("all");

  const filteredBookings = ownerBookings.filter(b => filter === "all" || b.status === filter);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/50";
      case "rejected": return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/50";
      case "pending": return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/50";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Réservations & Demandes</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Gérez les demandes de séjour et les réservations confirmées.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
          {["all", "pending", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === s 
                  ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20" 
                  : "text-neutral-500 hover:text-luxury-black dark:hover:text-white"
              )}
            >
              {s === "all" ? "Toutes" : s === "pending" ? "En attente" : s === "accepted" ? "Acceptées" : "Refusées"}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table/List */}
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Client</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Bien Immobilier</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Prix</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Statut</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking) => (
                  <motion.tr 
                    key={booking.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                          {booking.userAvatar ? (
                            <img src={booking.userAvatar} alt={booking.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-luxury-black dark:text-white">{booking.userName}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">Client Vérifié</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-luxury-black dark:text-white">{booking.propertyName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                        <Calendar size={14} />
                        <span className="text-xs font-medium">{booking.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-luxury-gold">{booking.price}€</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        getStatusStyles(booking.status)
                      )}>
                        {booking.status === "pending" ? "En attente" : booking.status === "accepted" ? "Accepté" : "Refusé"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === "pending" && (
                          <>
                            <button 
                              onClick={() => addNotification("Réservation acceptée", "success")}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => addNotification("Réservation refusée", "info")}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-lg hover:bg-luxury-gold hover:text-white transition-colors">
                          <MessageSquare size={16} />
                        </button>
                        <button className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-neutral-300" />
            </div>
            <p className="text-neutral-500 font-medium">Aucune demande trouvée pour ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
};
