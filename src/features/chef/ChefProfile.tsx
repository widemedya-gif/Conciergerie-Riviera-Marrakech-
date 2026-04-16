import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, MapPin, ChefHat, Calendar, Clock, Users, ChevronRight, Check, Info } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { ChefBooking } from "@/src/types";

export function ChefProfile() {
  const { chefs, selectedChefId, setSelectedChefId, addChefBooking, user, setAuthModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<"menus" | "about" | "reviews">("menus");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Booking State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [locationType, setLocationType] = useState<"property" | "custom">("property");
  const [locationAddress, setLocationAddress] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [customRequest, setCustomRequest] = useState("");
  const [occasion, setOccasion] = useState("");
  const [kitchenEquipment, setKitchenEquipment] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [petFriendly, setPetFriendly] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const chef = chefs.find(c => c.id === selectedChefId);

  if (!chef) return null;

  const selectedMenu = chef.menus.find(m => m.id === selectedMenuId);
  const basePrice = selectedMenu ? selectedMenu.pricePerPerson * guests : chef.startingPrice * guests;
  const serviceFee = basePrice * 0.1;
  const totalPrice = basePrice + serviceFee;

  const handleBookingSubmit = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const newBooking: ChefBooking = {
      id: Math.random().toString(36).substring(7),
      chefId: chef.id,
      userId: user.id,
      date: bookingDate,
      time: bookingTime,
      guests,
      locationType,
      locationAddress,
      menuId: selectedMenuId || undefined,
      customRequest: selectedMenuId ? undefined : customRequest,
      occasion,
      kitchenEquipment,
      clientPhone,
      notes: `${dietaryRestrictions.length > 0 ? `Restrictions: ${dietaryRestrictions.join(', ')}\n` : ''}${notes}`,
      petFriendly,
      basePrice,
      extrasPrice: 0,
      serviceFee,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    addChefBooking(newBooking);
    setIsBookingModalOpen(false);
    useStore.getState().addNotification("Demande de réservation envoyée avec succès", "success");
  };

  return (
    <AnimatePresence>
      {selectedChefId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedChefId(null)} />
          
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedChefId(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="relative h-64 sm:h-80">
                <ImagePlaceholder 
                  src={chef.gallery[0] || chef.avatar}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={chef.avatar} 
                      alt={chef.name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover shadow-xl"
                    />
                    <div className="text-white">
                      <h2 className="text-3xl sm:text-4xl font-serif mb-1">{chef.name}</h2>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-luxury-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold">{chef.rating}</span>
                          <span className="text-white/80">({chef.reviewCount} avis)</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/80">
                          <MapPin className="w-4 h-4" />
                          {chef.city}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="hidden sm:flex px-8 py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg"
                  >
                    Réserver
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Trust Elements */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-300">
                    <ChefHat className="w-4 h-4 text-luxury-gold" />
                    {chef.experienceYears} ans d'expérience
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-300">
                    <Check className="w-4 h-4 text-green-500" />
                    Très demandé cette semaine
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-300">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Répond en moins d'une heure
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-neutral-100 dark:border-neutral-800 mb-8">
                  {(["menus", "about", "reviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                        activeTab === tab ? "text-luxury-gold" : "text-neutral-400 hover:text-luxury-black dark:hover:text-white"
                      }`}
                    >
                      {tab === "menus" ? "Menus" : tab === "about" ? "À Propos" : "Avis"}
                      {activeTab === tab && (
                        <motion.div layoutId="chef-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === "menus" && (
                    <div className="space-y-6">
                      {chef.menus.map(menu => (
                        <div key={menu.id} className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-luxury-gold/30 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-2">{menu.title}</h3>
                              <div className="flex gap-2">
                                {menu.tags.map(tag => (
                                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="block text-2xl font-bold text-luxury-gold">{menu.pricePerPerson} MAD</span>
                              <span className="text-xs text-neutral-500">par personne</span>
                            </div>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                            {menu.description}
                          </p>
                          <button 
                            onClick={() => {
                              setSelectedMenuId(menu.id);
                              setIsBookingModalOpen(true);
                            }}
                            className="px-6 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-full text-sm font-bold uppercase tracking-widest transition-colors"
                          >
                            Sélectionner ce menu
                          </button>
                        </div>
                      ))}
                      
                      <div className="p-6 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-center">
                        <h3 className="text-lg font-serif text-luxury-black dark:text-white mb-2">Demande sur mesure</h3>
                        <p className="text-neutral-500 text-sm mb-4">Vous avez des envies particulières ? Le chef peut créer un menu personnalisé pour vous.</p>
                        <button 
                          onClick={() => {
                            setSelectedMenuId(null);
                            setIsBookingModalOpen(true);
                          }}
                          className="text-luxury-gold font-bold text-sm uppercase tracking-widest hover:underline"
                        >
                          Faire une demande spéciale
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "about" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-4">Biographie</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{chef.bio}</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-4">Philosophie</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed italic border-l-2 border-luxury-gold pl-4">"{chef.philosophy}"</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-4">Plats Signatures</h3>
                        <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-400 space-y-2">
                          {chef.signatureDishes.map(dish => (
                            <li key={dish}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-4">Galerie</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {chef.gallery.map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden">
                              <ImagePlaceholder src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
                      <h3 className="text-2xl font-serif text-luxury-black dark:text-white mb-2">{chef.rating} sur 5</h3>
                      <p className="text-neutral-500 mb-8">Basé sur {chef.reviewCount} avis vérifiés</p>
                      {/* Simulated reviews would go here */}
                      <div className="space-y-6 text-left max-w-2xl mx-auto">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                              <div>
                                <h4 className="font-bold text-luxury-black dark:text-white">Client {i}</h4>
                                <div className="flex text-luxury-gold">
                                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">"Une expérience incroyable. Le chef a été très professionnel et le repas était délicieux. Je recommande vivement !"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile Sticky CTA */}
            <div className="sm:hidden p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm"
              >
                Réserver
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBookingModalOpen(false)} />
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-luxury-black dark:text-white">Réserver {chef?.name}</h2>
                <p className="text-xs text-neutral-500">Étape {bookingStep} sur 4</p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-8">
                <div 
                  className="h-full bg-luxury-gold rounded-full transition-all duration-500"
                  style={{ width: `${(bookingStep / 4) * 100}%` }}
                />
              </div>

              {bookingStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg font-bold text-luxury-black dark:text-white">Détails de l'événement</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Date</label>
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Heure</label>
                      <input 
                        type="time" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Nombre de convives</label>
                      <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-xl">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center shadow-sm">-</button>
                        <span className="text-lg font-bold flex-1 text-center">{guests}</span>
                        <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center shadow-sm">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Occasion</label>
                      <select 
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold h-[48px]"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Dîner romantique">Dîner romantique</option>
                        <option value="Anniversaire">Anniversaire</option>
                        <option value="Repas d'affaires">Repas d'affaires</option>
                        <option value="Réception entre amis">Réception entre amis</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {bookingStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg font-bold text-luxury-black dark:text-white">Lieu & Équipement</h3>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Lieu de la prestation</label>
                    <div className="flex gap-4 mb-4">
                      <button 
                        onClick={() => setLocationType("property")}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors border ${locationType === "property" ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold" : "bg-neutral-50 border-transparent text-neutral-500 dark:bg-neutral-800"}`}
                      >
                        Ma réservation Riviera
                      </button>
                      <button 
                        onClick={() => setLocationType("custom")}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors border ${locationType === "custom" ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold" : "bg-neutral-50 border-transparent text-neutral-500 dark:bg-neutral-800"}`}
                      >
                        Autre adresse
                      </button>
                    </div>
                    {locationType === "custom" && (
                      <input 
                        type="text" 
                        placeholder="Adresse complète (Code postal, Ville, etc.)"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Équipement de cuisine disponible</label>
                    <select 
                      value={kitchenEquipment}
                      onChange={(e) => setKitchenEquipment(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                    >
                      <option value="">Sélectionner le niveau d'équipement...</option>
                      <option value="Cuisine basique (Plaques, Four, Frigo)">Cuisine basique (Plaques, Four, Frigo)</option>
                      <option value="Cuisine bien équipée (Robots, Grand four, etc.)">Cuisine bien équipée (Robots, Grand four, etc.)</option>
                      <option value="Cuisine professionnelle">Cuisine professionnelle</option>
                      <option value="Je ne sais pas">Je ne sais pas</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-2">Cela aide le chef à savoir s'il doit apporter son propre matériel spécifique.</p>
                  </div>
                </motion.div>
              )}

              {bookingStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg font-bold text-luxury-black dark:text-white">Menu & Préférences</h3>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Menu choisi</label>
                    <select 
                      value={selectedMenuId || ""}
                      onChange={(e) => setSelectedMenuId(e.target.value || null)}
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                    >
                      <option value="">Demande sur mesure</option>
                      {chef?.menus.map(m => (
                        <option key={m.id} value={m.id}>{m.title} - {m.pricePerPerson} MAD/pers</option>
                      ))}
                    </select>
                  </div>

                  {!selectedMenuId && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Votre demande sur mesure</label>
                      <textarea 
                        rows={3}
                        placeholder="Décrivez vos envies, le type de cuisine souhaité, les produits que vous aimez..."
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Restrictions alimentaires</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Végétarien", "Vegan", "Sans gluten", "Sans lactose", "Halal", "Casher"].map(diet => (
                        <button
                          key={diet}
                          onClick={() => {
                            if (dietaryRestrictions.includes(diet)) {
                              setDietaryRestrictions(dietaryRestrictions.filter(d => d !== diet));
                            } else {
                              setDietaryRestrictions([...dietaryRestrictions, diet]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                            dietaryRestrictions.includes(diet) 
                              ? "bg-luxury-gold border-luxury-gold text-white" 
                              : "bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-luxury-gold"
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Notes supplémentaires (Optionnel)</label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Précisions sur l'accès, allergies spécifiques, etc."
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    <div>
                      <span className="font-bold text-sm block dark:text-white">Animaux de compagnie</span>
                      <span className="text-xs text-neutral-500">Le chef doit-il être informé de la présence d'animaux ?</span>
                    </div>
                    <button 
                      onClick={() => setPetFriendly(!petFriendly)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${petFriendly ? 'bg-luxury-gold' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${petFriendly ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </motion.div>
              )}

              {bookingStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg font-bold text-luxury-black dark:text-white">Récapitulatif & Contact</h3>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Votre Téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="+212 6XX XX XX XX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold mb-2"
                    />
                    <p className="text-xs text-neutral-500">Le chef vous contactera pour confirmer les détails de la prestation.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Date & Heure</span>
                      <span className="font-bold dark:text-white">{bookingDate} à {bookingTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Convives</span>
                      <span className="font-bold dark:text-white">{guests} personnes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Menu</span>
                      <span className="font-bold dark:text-white">{selectedMenu ? selectedMenu.title : "Sur mesure"}</span>
                    </div>
                    
                    <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-4" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Prix de base ({guests}x)</span>
                      <span className="font-bold dark:text-white">{basePrice} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Frais de service (10%)</span>
                      <span className="font-bold dark:text-white">{serviceFee} MAD</span>
                    </div>
                    
                    <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-4" />
                    
                    <div className="flex justify-between text-lg">
                      <span className="font-bold dark:text-white">Total</span>
                      <span className="font-bold text-luxury-gold">{totalPrice} MAD</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex gap-4">
              {bookingStep > 1 && (
                <button 
                  onClick={() => setBookingStep(bookingStep - 1)}
                  className="px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Retour
                </button>
              )}
              <button 
                onClick={() => {
                  if (bookingStep === 1 && (!bookingDate || !bookingTime)) {
                    useStore.getState().addNotification("Veuillez sélectionner une date et une heure.", "error");
                    return;
                  }
                  if (bookingStep === 2 && locationType === "custom" && !locationAddress) {
                    useStore.getState().addNotification("Veuillez indiquer l'adresse.", "error");
                    return;
                  }
                  if (bookingStep === 4 && !clientPhone) {
                    useStore.getState().addNotification("Veuillez indiquer votre numéro de téléphone.", "error");
                    return;
                  }
                  
                  if (bookingStep < 4) setBookingStep(bookingStep + 1);
                  else handleBookingSubmit();
                }}
                className="flex-1 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
              >
                {bookingStep === 4 ? "Envoyer la demande" : "Continuer"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
