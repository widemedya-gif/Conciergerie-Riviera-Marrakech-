import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2, ArrowRight, Home, Heart, Search } from "lucide-react";
import { useStore } from "@/src/store/useStore";

export const OnboardingModal = () => {
  const { user, setUser, mockUsers, setMockUsers } = useStore();

  if (!user || user.onboardingCompleted) return null;

  const handleComplete = () => {
    const updatedUser = { ...user, onboardingCompleted: true };
    setUser(updatedUser);
    
    // Update in mock users as well
    const updatedMockUsers = mockUsers.map(u => u.id === user.id ? updatedUser : u);
    setMockUsers(updatedMockUsers);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-luxury-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center"
        >
          <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-luxury-gold animate-pulse" />
          </div>

          <h2 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-4">
            Bienvenue chez Concierge Riviera, {user.name.split(' ')[0]} !
          </h2>
          
          <p className="text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed">
            Votre compte a été créé avec succès. Voici ce que vous pouvez faire dès maintenant :
          </p>

          <div className="grid grid-cols-1 gap-4 mb-10 text-left">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-bold text-luxury-black dark:text-white text-sm">Explorez le Maroc</h4>
                <p className="text-xs text-neutral-500">Découvrez nos villas et riads d'exception.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-bold text-luxury-black dark:text-white text-sm">Sauvegardez vos favoris</h4>
                <p className="text-xs text-neutral-500">Créez votre propre sélection de prestige.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h4 className="font-bold text-luxury-black dark:text-white text-sm">Gérez vos réservations</h4>
                <p className="text-xs text-neutral-500">Suivez vos demandes en temps réel.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full py-5 bg-luxury-black hover:bg-luxury-gold text-white dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold dark:hover:text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-black/10"
          >
            Commencer l'expérience <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
