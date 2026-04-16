import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, LayoutDashboard, User, Utensils, CalendarDays, Settings, Star, TrendingUp, CheckCircle, Clock, Plus, Trash2, Edit2 } from "lucide-react";
import { useStore } from "@/src/store/useStore";

export function ChefDashboard() {
  const { isChefDashboardOpen, setChefDashboardOpen, activeChefTab, setActiveChefTab, user, chefs, chefBookings, updateChefBookingStatus } = useStore();

  const chefProfile = user ? chefs.find(c => c.userId === user.id) : undefined;

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(chefProfile);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({ title: "", description: "", pricePerPerson: 0 });

  // Update editedProfile when chefProfile changes
  React.useEffect(() => {
    if (chefProfile) {
      setEditedProfile(chefProfile);
    }
  }, [chefProfile]);

  if (!isChefDashboardOpen || !user) return null;

  const myBookings = chefBookings.filter(b => b.chefId === chefProfile?.id);

  const pendingBookings = myBookings.filter(b => b.status === "pending");
  const confirmedBookings = myBookings.filter(b => b.status === "confirmed");

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "profile", label: "Mon Profil", icon: User },
    { id: "menus", label: "Mes Menus", icon: Utensils },
    { id: "bookings", label: "Réservations", icon: CalendarDays },
    { id: "settings", label: "Paramètres", icon: Settings },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setChefDashboardOpen(false)} />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-100 dark:border-neutral-700 flex flex-col">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
              <h2 className="text-xl font-serif text-luxury-black dark:text-white">Espace Chef</h2>
              <button onClick={() => setChefDashboardOpen(false)} className="md:hidden p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChefTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeChefTab === tab.id 
                        ? "bg-luxury-gold/10 text-luxury-gold" 
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                    {tab.id === "bookings" && pendingBookings.length > 0 && (
                      <span className="ml-auto bg-luxury-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingBookings.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto relative">
            <button 
              onClick={() => setChefDashboardOpen(false)}
              className="hidden md:flex absolute top-6 right-6 z-10 w-10 h-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-10">
              {!chefProfile ? (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-serif mb-4">Vous n'avez pas encore de profil Chef</h2>
                  <button 
                    onClick={() => {
                      setChefDashboardOpen(false);
                      useStore.getState().setChefOnboardingOpen(true);
                    }}
                    className="px-6 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm"
                  >
                    Créer mon profil
                  </button>
                </div>
              ) : (
                <>
                  {activeChefTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-serif text-luxury-black dark:text-white mb-2">Bonjour, Chef {chefProfile.name.split(' ')[0]}</h2>
                        <p className="text-neutral-500">Voici un résumé de votre activité.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                              <Star className="w-6 h-6 text-luxury-gold" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Note Globale</p>
                              <p className="text-2xl font-bold dark:text-white">{chefProfile.rating}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <CalendarDays className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Réservations à venir</p>
                              <p className="text-2xl font-bold dark:text-white">{confirmedBookings.length}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Revenus (Mois)</p>
                              <p className="text-2xl font-bold dark:text-white">12 500 MAD</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {pendingBookings.length > 0 && (
                        <div>
                          <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-4">Demandes en attente</h3>
                          <div className="space-y-4">
                            {pendingBookings.map(booking => (
                              <div key={booking.id} className="p-6 rounded-2xl border border-luxury-gold/30 bg-luxury-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                      Nouveau
                                    </span>
                                    <span className="text-sm font-bold">{booking.date} à {booking.time}</span>
                                  </div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {booking.guests} personnes • {booking.locationType === 'property' ? 'En villa' : 'Adresse personnalisée'}
                                  </p>
                                  <p className="text-lg font-bold text-luxury-gold mt-2">{booking.totalPrice} MAD</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <button 
                                    onClick={() => updateChefBookingStatus(booking.id, "confirmed")}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-luxury-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors"
                                  >
                                    Accepter
                                  </button>
                                  <button 
                                    onClick={() => updateChefBookingStatus(booking.id, "cancelled")}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                                  >
                                    Refuser
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeChefTab === "bookings" && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-serif text-luxury-black dark:text-white mb-6">Toutes les réservations</h2>
                      
                      <div className="space-y-4">
                        {myBookings.length === 0 ? (
                          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                            <CalendarDays className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-500">Aucune réservation pour le moment.</p>
                          </div>
                        ) : (
                          myBookings.map(booking => (
                            <div key={booking.id} className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  {booking.status === "pending" && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-wider rounded-full">En attente</span>}
                                  {booking.status === "confirmed" && <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full">Confirmé</span>}
                                  {booking.status === "completed" && <span className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">Terminé</span>}
                                  {booking.status === "cancelled" && <span className="px-2 py-1 bg-red-500/20 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-full">Annulé</span>}
                                  <span className="text-sm font-bold">{booking.date} à {booking.time}</span>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {booking.guests} personnes • {booking.totalPrice} MAD
                                </p>
                              </div>
                              {booking.status === "pending" && (
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <button onClick={() => updateChefBookingStatus(booking.id, "confirmed")} className="flex-1 sm:flex-none px-4 py-2 bg-luxury-black text-white dark:bg-white dark:text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors">Accepter</button>
                                  <button onClick={() => updateChefBookingStatus(booking.id, "cancelled")} className="flex-1 sm:flex-none px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">Refuser</button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeChefTab === "profile" && chefProfile && editedProfile && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif text-luxury-black dark:text-white">Mon Profil</h2>
                        <button 
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          {isEditingProfile ? <><X className="w-4 h-4" /> Annuler</> : <><Edit2 className="w-4 h-4" /> Modifier</>}
                        </button>
                      </div>

                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 space-y-6">
                        <div className="flex items-center gap-6">
                          <img src={editedProfile.avatar} alt={editedProfile.name} className="w-24 h-24 rounded-full object-cover" />
                          <div>
                            <h3 className="text-xl font-bold dark:text-white">{editedProfile.name}</h3>
                            <p className="text-neutral-500">{editedProfile.city}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Biographie</label>
                            {isEditingProfile ? (
                              <textarea 
                                value={editedProfile.bio}
                                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                                className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                                rows={4}
                              />
                            ) : (
                              <p className="text-neutral-600 dark:text-neutral-400">{editedProfile.bio}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Philosophie</label>
                            {isEditingProfile ? (
                              <textarea 
                                value={editedProfile.philosophy}
                                onChange={(e) => setEditedProfile({...editedProfile, philosophy: e.target.value})}
                                className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                                rows={4}
                              />
                            ) : (
                              <p className="text-neutral-600 dark:text-neutral-400">{editedProfile.philosophy}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Spécialités</label>
                          <div className="flex flex-wrap gap-2">
                            {editedProfile.specialties.map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-white dark:bg-neutral-900 rounded-full text-sm border border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                                {s}
                                {isEditingProfile && (
                                  <button onClick={() => setEditedProfile({...editedProfile, specialties: editedProfile.specialties.filter((_, idx) => idx !== i)})}>
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isEditingProfile && (
                          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
                            <button 
                              onClick={() => {
                                // In a real app, we would update the store/backend here
                                setIsEditingProfile(false);
                                useStore.getState().addNotification("Profil mis à jour", "success");
                              }}
                              className="px-6 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-luxury-gold/90 transition-colors"
                            >
                              Enregistrer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeChefTab === "menus" && chefProfile && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif text-luxury-black dark:text-white">Mes Menus</h2>
                        <button 
                          onClick={() => setIsAddingMenu(!isAddingMenu)}
                          className="px-4 py-2 bg-luxury-black text-white dark:bg-white dark:text-black hover:bg-luxury-gold dark:hover:bg-luxury-gold rounded-full text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          {isAddingMenu ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Ajouter un menu</>}
                        </button>
                      </div>

                      {isAddingMenu && (
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 mb-6 space-y-4">
                          <h3 className="font-bold text-lg dark:text-white">Nouveau Menu</h3>
                          <input 
                            type="text" 
                            value={newMenu.title}
                            onChange={(e) => setNewMenu({...newMenu, title: e.target.value})}
                            className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold"
                            placeholder="Titre du menu"
                          />
                          <textarea 
                            value={newMenu.description}
                            onChange={(e) => setNewMenu({...newMenu, description: e.target.value})}
                            className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                            rows={3}
                            placeholder="Description..."
                          />
                          <input 
                            type="number" 
                            value={newMenu.pricePerPerson}
                            onChange={(e) => setNewMenu({...newMenu, pricePerPerson: parseInt(e.target.value)})}
                            className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold"
                            placeholder="Prix par personne (MAD)"
                          />
                          <div className="flex justify-end">
                            <button 
                              onClick={() => {
                                if (newMenu.title && newMenu.pricePerPerson > 0) {
                                  // In a real app, update store/backend
                                  setIsAddingMenu(false);
                                  setNewMenu({ title: "", description: "", pricePerPerson: 0 });
                                  useStore.getState().addNotification("Menu ajouté", "success");
                                }
                              }}
                              className="px-6 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-luxury-gold/90 transition-colors"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chefProfile.menus.map((menu, i) => (
                          <div key={i} className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold dark:text-white">{menu.title}</h3>
                                <p className="text-luxury-gold font-bold">{menu.pricePerPerson} MAD / pers</p>
                              </div>
                              <button className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm flex-1">{menu.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeChefTab === "settings" && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-serif text-luxury-black dark:text-white mb-6">Paramètres</h2>
                      
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700 space-y-6">
                        <div>
                          <h3 className="font-bold text-lg mb-4 dark:text-white">Préférences de réservation</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium dark:text-white">Accepter automatiquement</p>
                                <p className="text-sm text-neutral-500">Accepter les demandes si vous êtes disponible</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-luxury-gold"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium dark:text-white">Délai de préavis</p>
                                <p className="text-sm text-neutral-500">Temps minimum avant une prestation</p>
                              </div>
                              <select className="p-2 rounded-lg bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold">
                                <option>24 heures</option>
                                <option>48 heures</option>
                                <option>72 heures</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                          <h3 className="font-bold text-lg mb-4 dark:text-white">Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium dark:text-white">Nouvelles demandes</p>
                                <p className="text-sm text-neutral-500">Recevoir un email pour chaque demande</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-luxury-gold"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
