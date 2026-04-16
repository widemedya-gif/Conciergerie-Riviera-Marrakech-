import React from "react";
import { useStore } from "@/src/store/useStore";
import { Users, Building2, Eye, TrendingUp, ChefHat, Map, CalendarCheck } from "lucide-react";

export const AdminDashboardOverview = () => {
  const properties = useStore((state) => state.properties);
  const chefs = useStore((state) => state.chefs);
  const trips = useStore((state) => state.organizedTrips);
  const chefBookings = useStore((state) => state.chefBookings);
  const mockUsers = useStore((state) => state.mockUsers);

  const stats = [
    { label: "Propriétés Actives", value: properties.length.toString(), icon: Building2, trend: "+12%" },
    { label: "Chefs Privés", value: chefs.length.toString(), icon: ChefHat, trend: "+5%" },
    { label: "Voyages Organisés", value: trips.length.toString(), icon: Map, trend: "+2" },
    { label: "Réservations Chefs", value: chefBookings.length.toString(), icon: CalendarCheck, trend: "+8%" },
    { label: "Utilisateurs Inscrits", value: mockUsers.length.toString(), icon: Users, trend: "+18%" },
    { label: "Vues Aujourd'hui", value: "1,240", icon: Eye, trend: "+5%" },
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">Vue d'Ensemble</h2>
        <p className="text-neutral-500">Bienvenue dans le panneau de contrôle Elite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-luxury-gold/10 rounded-lg text-luxury-gold">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-serif text-luxury-black dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-medium text-lg text-luxury-black dark:text-white mb-4">Activité Récente (Simulation)</h3>
        <div className="space-y-4">
          {chefBookings.slice(0, 3).map((booking, i) => (
            <div key={booking.id} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-luxury-gold" />
              <div>
                <p className="text-sm text-luxury-black dark:text-white">Nouvelle réservation Chef: {booking.chefName}</p>
                <p className="text-xs text-neutral-500">Statut: {booking.status}</p>
              </div>
            </div>
          ))}
          {chefBookings.length === 0 && (
            <p className="text-sm text-neutral-500">Aucune activité récente.</p>
          )}
        </div>
      </div>
    </div>
  );
};
