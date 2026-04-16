import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  MapPin, 
  Home, 
  DollarSign,
  Save,
  Camera
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const ClientSettings = () => {
  const { user, setUser, addNotification } = useStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+212 6 00 00 00 00",
    city: user?.clientPreferences?.preferredCities?.[0] || "Marrakech",
    budget: user?.clientPreferences?.budgetRange?.[1] || 5000,
    propertyType: user?.clientPreferences?.propertyTypes?.[0] || "Villa"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          clientPreferences: {
            ...user.clientPreferences!,
            preferredCities: [formData.city],
            budgetRange: [0, formData.budget],
            propertyTypes: [formData.propertyType as any]
          }
        });
      }
      setIsLoading(false);
      addNotification("Paramètres enregistrés avec succès !", "success");
    }, 1500);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "preferences", label: "Préférences", icon: Home },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Facturation", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Paramètres</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Gérez votre compte et vos préférences de recherche.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
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
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 p-8 lg:p-12 shadow-sm">
          <form onSubmit={handleSave} className="space-y-10">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-neutral-50 dark:border-neutral-800">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-luxury-gold font-bold text-4xl overflow-hidden border-4 border-white dark:border-neutral-900 shadow-xl">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-luxury-gold text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-1">{user?.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{user?.email}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-[10px] font-bold uppercase tracking-widest">Client Premium</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Compte Vérifié</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Ville préférée</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all appearance-none"
                      >
                        <option>Marrakech</option>
                        <option>Casablanca</option>
                        <option>Tanger</option>
                        <option>Agadir</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Type de bien</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <select 
                        value={formData.propertyType}
                        onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all appearance-none"
                      >
                        <option>Villa</option>
                        <option>Riad</option>
                        <option>Appartement</option>
                        <option>Studio</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Budget max (par nuit)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input 
                        type="range" 
                        min="100" 
                        max="10000" 
                        step="100"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                        className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold mt-6"
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-bold text-neutral-400">
                        <span>100€</span>
                        <span className="text-luxury-gold text-sm">{formData.budget}€</span>
                        <span>10 000€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-luxury-gold/10 text-luxury-gold rounded-xl">
                          <Shield size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-luxury-black dark:text-white">Authentification à deux facteurs</h4>
                          <p className="text-xs text-neutral-500">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                        </div>
                      </div>
                      <button type="button" className="px-4 py-2 bg-luxury-gold text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Activer</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Changer le mot de passe</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <input 
                        type="password" 
                        placeholder="Mot de passe actuel"
                        className="w-full px-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                      />
                      <input 
                        type="password" 
                        placeholder="Nouveau mot de passe"
                        className="w-full px-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                      />
                      <input 
                        type="password" 
                        placeholder="Confirmer le nouveau mot de passe"
                        className="w-full px-4 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-50 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest ml-1 mb-4">Zone de danger</h4>
                    <button type="button" className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Supprimer mon compte</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    { title: "Alertes de prix", desc: "Recevez une notification quand une propriété de vos favoris baisse de prix." },
                    { title: "Nouveaux messages", desc: "Soyez informé dès qu'un propriétaire vous répond." },
                    { title: "Confirmations de réservation", desc: "Notifications sur le statut de vos demandes de séjour." },
                    { title: "Offres exclusives", desc: "Recevez nos meilleures offres et promotions Riviera." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-2xl transition-all">
                      <div>
                        <h4 className="text-sm font-bold text-luxury-black dark:text-white">{item.title}</h4>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-luxury-gold"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-luxury-black to-neutral-800 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <CreditCard size={120} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-8">Carte enregistrée</p>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                          <span className="font-bold text-xs italic">VISA</span>
                        </div>
                        <p className="text-xl tracking-[0.2em] font-mono">•••• •••• •••• 4242</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1">Titulaire</p>
                          <p className="text-sm font-bold">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1">Expire le</p>
                          <p className="text-sm font-bold">12/26</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Historique des transactions</h4>
                    <div className="space-y-3">
                      {[
                        { id: "#INV-2024-001", date: "12 Mars 2024", amount: "1 200€", status: "Payé" },
                        { id: "#INV-2024-002", date: "05 Fév 2024", amount: "850€", status: "Payé" }
                      ].map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white dark:bg-neutral-700 rounded-xl">
                              <DollarSign size={16} className="text-luxury-gold" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-luxury-black dark:text-white">{inv.id}</p>
                              <p className="text-[10px] text-neutral-500">{inv.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-luxury-black dark:text-white">{inv.amount}</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{inv.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-8 border-t border-neutral-50 dark:border-neutral-800 flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Save size={18} />
                  </motion.div>
                ) : (
                  <Save size={18} />
                )}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
