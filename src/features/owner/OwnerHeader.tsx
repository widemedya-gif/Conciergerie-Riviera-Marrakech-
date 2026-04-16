import React, { useState } from "react";
import { Search, Bell, User, ChevronDown, Moon, Sun } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { motion, AnimatePresence } from "motion/react";

export const OwnerHeader = () => {
  const { user, theme, toggleTheme, ownerNotifications, setOwnerDashboardOpen } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = ownerNotifications.filter(n => !n.isRead).length;

  return (
    <header className="h-20 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between relative z-20">
      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-luxury-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un bien, un message..."
            className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900" />
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
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden z-40"
                >
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{unreadCount} Nouvelles</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {ownerNotifications.length > 0 ? (
                      ownerNotifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                          <p className="text-sm font-bold text-luxury-black dark:text-white mb-1">{n.title}</p>
                          <p className="text-xs text-neutral-500 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-neutral-400 mt-2 block">Il y a 2 min</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-neutral-400">Aucune notification</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-luxury-gold/10 flex items-center justify-center text-luxury-gold overflow-hidden border border-luxury-gold/20">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-luxury-black dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-neutral-500 leading-tight">Propriétaire</p>
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
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden z-40"
                >
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => setOwnerDashboardOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Retour au site
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      Paramètres
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
