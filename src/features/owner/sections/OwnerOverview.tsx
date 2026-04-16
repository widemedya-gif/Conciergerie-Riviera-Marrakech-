import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  Home, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Heart,
  Clock
} from "lucide-react";
import { useStore } from "@/src/store/useStore";

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
        <Icon size={24} />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}%
        </div>
      )}
    </div>
    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-luxury-black dark:text-white">{value}</h3>
  </div>
);

export const OwnerOverview = () => {
  const { user, ownerListings, ownerMessages, ownerBookings } = useStore();

  const stats = [
    { title: "Total Biens", value: ownerListings.length || 12, change: 8, trend: "up", icon: Home },
    { title: "Vues Totales", value: "2.4k", change: 12, trend: "up", icon: Eye },
    { title: "Favoris", value: "148", change: 5, trend: "up", icon: Heart },
    { title: "Messages", value: ownerMessages.length, change: 2, trend: "down", icon: MessageSquare },
  ];

  const activities = [
    { id: 1, type: "message", title: "Nouveau message", desc: "Sarah L. a envoyé une demande pour Villa Majorelle", time: "Il y a 5 min" },
    { id: 2, type: "view", title: "Pic de visibilité", desc: "Votre annonce 'Riad Dar Zina' a été vue 45 fois aujourd'hui", time: "Il y a 2h" },
    { id: 3, type: "booking", title: "Nouvelle demande", desc: "Marc A. souhaite réserver pour le 12 Mai", time: "Il y a 4h" },
    { id: 4, type: "system", title: "Annonce validée", desc: "Votre nouvelle annonce 'Appartement Marina' est en ligne", time: "Hier" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">
          Bonjour, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Voici un aperçu de la performance de votre patrimoine immobilier aujourd'hui.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Simulation */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Performance des Vues</h3>
            <select className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-xs font-bold px-3 py-2 outline-none">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 90, 75, 55, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="w-full bg-luxury-gold/20 group-hover:bg-luxury-gold transition-colors rounded-t-lg relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {height * 10}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Activité Récente</h3>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-luxury-black dark:text-white leading-tight mb-1">{activity.title}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-1">{activity.desc}</p>
                  <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-luxury-gold hover:bg-luxury-gold/5 rounded-xl transition-colors">
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  );
};
