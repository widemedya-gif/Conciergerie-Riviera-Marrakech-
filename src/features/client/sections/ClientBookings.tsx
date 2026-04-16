import React from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const ClientBookings = () => {
  const { clientBookings, setActiveClientTab } = useStore();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "accepted":
        return { 
          label: "Confirmé", 
          icon: CheckCircle2, 
          color: "text-green-500 bg-green-50 dark:bg-green-900/20",
          desc: "Votre demande a été acceptée par le propriétaire."
        };
      case "rejected":
        return { 
          label: "Refusé", 
          icon: XCircle, 
          color: "text-red-500 bg-red-50 dark:bg-red-900/20",
          desc: "Malheureusement, cette demande n'a pas pu être satisfaite."
        };
      default:
        return { 
          label: "En attente", 
          icon: AlertCircle, 
          color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
          desc: "Le propriétaire examine votre demande."
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Mes Demandes</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Suivez l'état de vos demandes de visite et de réservation.</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {clientBookings.length > 0 ? (
          clientBookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Property Info */}
                  <div className="lg:w-80 h-48 lg:h-auto relative shrink-0">
                    <img 
                      src={booking.propertyImage || "https://picsum.photos/seed/prop/800/600"} 
                      alt={booking.propertyName} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                    <div className="absolute bottom-4 left-4 lg:hidden">
                      <h3 className="text-white font-bold text-lg">{booking.propertyName}</h3>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                      <div className="hidden lg:block">
                        <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-2">{booking.propertyName}</h3>
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <MapPin size={14} />
                          <span>Marrakech, Maroc</span>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
                        statusInfo.color
                      )}>
                        <statusInfo.icon size={14} />
                        {statusInfo.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Date prévue</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-luxury-black dark:text-white">
                          <Calendar size={16} className="text-luxury-gold" />
                          {new Date(booking.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Budget estimé</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-luxury-gold">
                          {booking.price}€
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Type de demande</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-luxury-black dark:text-white">
                          <Clock size={16} className="text-luxury-gold" />
                          Visite guidée
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 mb-8">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                        "{booking.message || "Aucun message d'accompagnement."}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-50 dark:border-neutral-800">
                      <p className="text-xs text-neutral-400 italic">{statusInfo.desc}</p>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => setActiveClientTab("messages")}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
                        >
                          <MessageSquare size={14} /> Contacter
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all">
                          Détails <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-[40px] border border-dashed border-neutral-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} className="text-neutral-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-luxury-black dark:text-white mb-2">Aucune demande en cours</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
              Vos demandes de visite et vos réservations apparaîtront ici une fois envoyées aux propriétaires.
            </p>
            <button className="px-8 py-4 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold/90 transition-all shadow-lg shadow-luxury-gold/20">
              Explorer les biens
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
