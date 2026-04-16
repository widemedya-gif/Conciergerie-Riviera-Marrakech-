import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Lock, Bell, Shield, CreditCard, Globe, Camera } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const OwnerSettings = () => {
  const { user, addNotification } = useStore();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "billing", label: "Facturation", icon: CreditCard },
  ];

  const handleSave = () => {
    addNotification("Paramètres mis à jour avec succès", "success");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Paramètres du compte</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Gérez vos informations personnelles et vos préférences de dashboard.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                activeTab === tab.id 
                  ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20" 
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 p-8 sm:p-10 shadow-xl shadow-black/5">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 overflow-hidden border-2 border-neutral-100 dark:border-neutral-700">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-luxury-gold text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-900 hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-luxury-black dark:text-white">{user?.name}</h3>
                  <p className="text-sm text-neutral-500">Propriétaire depuis Avril 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Adresse E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="tel" 
                      placeholder="+212 6XX XX XX XX"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Langue préférée</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <select className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm appearance-none">
                      <option>Français</option>
                      <option>English</option>
                      <option>العربية</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <button 
                  onClick={handleSave}
                  className="px-10 py-4 bg-luxury-black dark:bg-white text-white dark:text-luxury-black hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold mb-6">Préférences de notification</h3>
              <div className="space-y-6">
                {[
                  { id: "n1", title: "Nouvelles demandes", desc: "Recevoir une alerte pour chaque nouvelle demande de réservation." },
                  { id: "n2", title: "Messages clients", desc: "Être notifié lorsqu'un client vous envoie un message." },
                  { id: "n3", title: "Rapports hebdomadaires", desc: "Recevoir un résumé de la performance de vos biens chaque lundi." },
                  { id: "n4", title: "Offres promotionnelles", desc: "Recevoir des conseils et offres pour booster vos annonces." },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <div>
                      <p className="font-bold text-sm text-luxury-black dark:text-white">{item.title}</p>
                      <p className="text-xs text-neutral-500">{item.desc}</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-luxury-gold relative transition-all">
                      <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold mb-6">Sécurité du compte</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3.5 bg-luxury-black dark:bg-white text-white dark:text-luxury-black hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
