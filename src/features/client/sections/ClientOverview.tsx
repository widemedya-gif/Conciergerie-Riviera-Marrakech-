import React from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  MessageSquare, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  Star,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
          <TrendingUp size={14} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-luxury-black dark:text-white">{value}</p>
  </motion.div>
);

export const ClientOverview = () => {
  const { 
    user, 
    favorites, 
    clientConversations, 
    clientBookings, 
    recentlyViewed,
    properties,
    setActiveClientTab
  } = useStore();

  // Mock recommendations based on user preferences or behavior
  const recommendations = properties.slice(0, 3).map(p => ({
    ...p,
    matchScore: Math.floor(Math.random() * 20) + 80 // 80-100%
  }));

  const stats = [
    { title: "Favoris", value: favorites.length, icon: Heart, trend: "+2 cette semaine", color: "bg-pink-500" },
    { title: "Messages", value: clientConversations.length, icon: MessageSquare, trend: "3 non lus", color: "bg-blue-500" },
    { title: "Réservations", value: clientBookings.length, icon: CalendarCheck, trend: "1 en attente", color: "bg-luxury-gold" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">
            Bonjour, {user?.name?.split(" ")[0] || "Client"} 👋
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Voici un aperçu de votre recherche immobilière.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveClientTab("settings")}
            className="px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
          >
            Préférences
          </button>
          <button className="px-6 py-3 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all shadow-lg shadow-black/10">
            Nouvelle Recherche
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-luxury-black dark:text-white">Recommandé pour vous</h2>
            <button className="text-xs font-bold text-luxury-gold hover:underline flex items-center gap-1">
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((property) => (
              <motion.div 
                key={property.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden group shadow-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-luxury-gold fill-luxury-gold" />
                    <span className="text-[10px] font-bold text-luxury-black">{property.rating}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                    {property.matchScore}% Match
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="text-luxury-gold font-bold text-sm whitespace-nowrap">{property.price}€/nuit</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 text-xs mb-4">
                    <MapPin size={12} />
                    <span>{property.city}, {property.region}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50 dark:border-neutral-800">
                    <div className="flex gap-3 text-[10px] text-neutral-500 font-medium">
                      <span>{property.capacity} Voyageurs</span>
                      <span>{property.type}</span>
                    </div>
                    <button className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400 hover:text-luxury-gold transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Viewed */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold text-luxury-black dark:text-white">Consultés récemment</h2>
          <div className="space-y-4">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.slice(0, 4).map((rv) => {
                const property = properties.find(p => p.id === rv.propertyId);
                if (!property) return null;
                return (
                  <div key={rv.propertyId} className="flex gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-neutral-900 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 group cursor-pointer">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-luxury-black dark:text-white line-clamp-1 group-hover:text-luxury-gold transition-colors">{property.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1">{property.city}</p>
                      <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-2">
                        <Clock size={10} />
                        <span>{new Date(rv.viewedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
                <History size={32} className="mx-auto text-neutral-200 mb-2" />
                <p className="text-xs text-neutral-400">Aucun historique</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-luxury-gold/10 p-6 rounded-3xl border border-luxury-gold/20">
            <h3 className="text-sm font-bold text-luxury-gold mb-4 uppercase tracking-widest">Actions Rapides</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white dark:bg-neutral-900 rounded-xl text-[10px] font-bold uppercase tracking-widest text-luxury-black dark:text-white hover:bg-luxury-gold hover:text-white transition-all shadow-sm">
                Comparer mes favoris
              </button>
              <button className="w-full py-3 bg-white dark:bg-neutral-900 rounded-xl text-[10px] font-bold uppercase tracking-widest text-luxury-black dark:text-white hover:bg-luxury-gold hover:text-white transition-all shadow-sm">
                Télécharger mes factures
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
