import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const AnalyticsCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
        <Icon size={28} />
      </div>
      <div className={cn(
        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
        trend === "up" ? "bg-green-100 text-green-600 dark:bg-green-900/20" : "bg-red-100 text-red-600 dark:bg-red-900/20"
      )}>
        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}%
      </div>
    </div>
    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-bold uppercase tracking-widest mb-2">{title}</p>
    <h3 className="text-4xl font-serif font-bold text-luxury-black dark:text-white">{value}</h3>
  </div>
);

export const OwnerAnalytics = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Analytiques Avancées</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Analysez le comportement de vos clients et optimisez vos revenus.</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-bold outline-none shadow-sm">
            <option>30 derniers jours</option>
            <option>90 derniers jours</option>
            <option>Année en cours</option>
          </select>
          <button className="px-6 py-2.5 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-xl font-bold text-sm hover:bg-luxury-gold transition-all shadow-lg shadow-black/10">
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnalyticsCard title="Taux de conversion" value="4.2%" change={1.5} trend="up" icon={TrendingUp} />
        <AnalyticsCard title="Visiteurs uniques" value="12,480" change={12} trend="up" icon={Users} />
        <AnalyticsCard title="Clics sur annonces" value="842" change={3} trend="down" icon={MousePointer2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Graph */}
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold">Engagement par Ville</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-luxury-gold" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Vues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-luxury-black dark:bg-white" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Demandes</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { city: "Marrakech", views: 85, inquiries: 45 },
              { city: "Casablanca", views: 65, inquiries: 30 },
              { city: "Tanger", views: 45, inquiries: 20 },
              { city: "Rabat", views: 35, inquiries: 15 },
              { city: "Agadir", views: 25, inquiries: 10 },
            ].map((item) => (
              <div key={item.city} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{item.city}</span>
                  <span className="text-[10px] font-bold text-neutral-400">{item.views}% de l'audience</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.views}%` }}
                    className="h-full bg-luxury-gold"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.inquiries}%` }}
                    className="h-full bg-luxury-black dark:bg-white border-l border-white dark:border-neutral-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Source */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Appareils utilisés</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-luxury-gold mb-4 mx-auto">
                  <Smartphone size={32} />
                </div>
                <p className="text-2xl font-bold">65%</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Mobile</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4 mx-auto">
                  <Monitor size={32} />
                </div>
                <p className="text-2xl font-bold">28%</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Desktop</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4 mx-auto">
                  <Globe size={32} />
                </div>
                <p className="text-2xl font-bold">7%</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Autres</p>
              </div>
            </div>
          </div>

          <div className="bg-luxury-black text-white p-10 rounded-[2.5rem] shadow-xl shadow-black/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Optimisation IA</h3>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                Selon nos analyses, augmenter vos photos de 5 à 10 pourrait booster vos demandes de 25%.
              </p>
              <button className="px-6 py-3 bg-luxury-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all">
                Appliquer les conseils
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-luxury-gold/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
