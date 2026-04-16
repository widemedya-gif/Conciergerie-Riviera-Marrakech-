import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun, 
  Maximize, 
  ChevronDown,
  Settings,
  LogOut,
  Mail
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export const ClientHeader = () => {
  const { user, theme, toggleTheme, clientNotifications, markNotificationAsRead, setClientDashboardOpen, setUser } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = clientNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    setClientDashboardOpen(false);
  };

  return (
    <header className="h-20 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between shrink-0 z-20">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-700 w-96 group focus-within:ring-2 focus-within:ring-luxury-gold/20 transition-all">
        <Search size={18} className="text-neutral-400 group-focus-within:text-luxury-gold transition-colors" />
        <input 
          type="text" 
          placeholder="Rechercher dans votre espace..." 
          className="bg-transparent border-none outline-none text-sm w-full text-neutral-600 dark:text-neutral-300 placeholder:text-neutral-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-luxury-gold rounded-full border-2 border-white dark:border-neutral-900" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-40 overflow-hidden"
                >
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="font-bold text-sm">Notifications</span>
                    <span className="text-[10px] bg-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded-full font-bold uppercase">
                      {unreadCount} Nouvelles
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {clientNotifications.length > 0 ? (
                      clientNotifications.map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={cn(
                            "p-4 border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer",
                            !n.isRead && "bg-luxury-gold/5"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                              <Mail size={14} className="text-luxury-gold" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-luxury-black dark:text-white mb-1">{n.title}</p>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">{n.message}</p>
                              <p className="text-[9px] text-neutral-400 mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto text-neutral-200 mb-2" />
                        <p className="text-xs text-neutral-400">Aucune notification</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-luxury-gold text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-luxury-gold/20">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-luxury-black dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">Client Premium</p>
            </div>
            <ChevronDown size={14} className={cn("text-neutral-400 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 z-40 p-2"
                >
                  <button 
                    onClick={() => {
                      useStore.getState().setActiveClientTab("overview");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 transition-colors"
                  >
                    <User size={16} /> Mon Profil
                  </button>
                  <button 
                    onClick={() => {
                      useStore.getState().setActiveClientTab("settings");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 transition-colors"
                  >
                    <Settings size={16} /> Paramètres
                  </button>
                  <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-xs font-bold text-red-500 transition-colors"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
