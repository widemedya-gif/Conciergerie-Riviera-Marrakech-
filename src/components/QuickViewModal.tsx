import React, { useState } from "react";
import { X, Star, MapPin, ShoppingCart, Check, Shield, Info, Users, Home, Maximize, MessageSquare, ExternalLink, Share2, ShieldCheck, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../store/useStore";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { cn } from "../lib/utils";
import { Button } from "./ui/BaseComponents";

export const QuickViewModal = () => {
  const { 
    quickViewPropertyId, setQuickViewPropertyId,
    isQuickViewOpen, setQuickViewOpen,
    properties, 
    cart, addToCart, removeFromCart,
    addNotification,
    user,
    setAuthModalOpen,
    setClientDashboardOpen,
    setActiveClientTab
  } = useStore();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const property = properties.find((p) => p.id === quickViewPropertyId);

  if (!property) return null;

  const isInCart = cart.includes(property.id);

  const handleClose = () => {
    setQuickViewOpen(false);
    setQuickViewPropertyId(null);
  };

  const handleToggleCart = () => {
    if (isInCart) {
      removeFromCart(property.id);
      addNotification("Retiré du panier", "info");
    } else {
      addToCart(property.id);
      addNotification("Ajouté au panier", "success");
    }
  };

  const handleContact = () => {
    addNotification("La messagerie sera bientôt disponible", "info");
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      addNotification("Veuillez sélectionner vos dates de séjour", "error");
      return;
    }
    addNotification("Redirection vers le système de réservation...", "success");
    // In a real app, this would redirect to checkout or open a booking flow
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification("Lien copié dans le presse-papier", "success");
  };

  // Calculate nights and total
  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 5; // Default to 5 nights if no dates selected
  };

  const nights = calculateNights();
  const total = property.price * nights;
  const serviceFee = Math.round(total * 0.1); // 10% service fee
  const taxes = Math.round(total * 0.05); // 5% taxes
  const finalTotal = total + serviceFee + taxes;

  return (
    <AnimatePresence>
      {isQuickViewOpen && quickViewPropertyId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-7xl bg-white dark:bg-luxury-black rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[95vh] transition-colors duration-500"
          >
            <div className="absolute top-6 right-6 z-50 flex gap-2">
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-luxury-black dark:text-white"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={handleClose}
                className="p-3 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-luxury-black dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Left Side: Gallery & Info */}
            <div className="lg:w-3/5 h-full overflow-y-auto custom-scrollbar">
              {/* Hero Image */}
              <div className="relative h-[400px] w-full">
                <ImagePlaceholder src={property.images[0]} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {property.isSuperhost && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-black bg-luxury-gold px-3 py-1 rounded-full">
                          Superhost
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                        {property.type}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">{property.title}</h2>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin size={18} />
                      <span className="text-sm font-medium">{property.location || `${property.city}, ${property.region}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Host Info & Stats */}
                <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-neutral-800 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-serif text-xl border border-luxury-gold/30">
                      {property.ownerId ? property.ownerId.charAt(0).toUpperCase() : "H"}
                    </div>
                    <div>
                      <h3 className="font-bold text-luxury-black dark:text-white">Hôte d'exception</h3>
                      <p className="text-sm text-neutral-500">Membre depuis 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-luxury-black dark:text-white font-bold text-lg">
                        <Star size={18} className="fill-luxury-gold text-luxury-gold" />
                        {property.rating}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-widest">24 Avis</div>
                    </div>
                    <div className="w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />
                    <div className="text-center">
                      <div className="text-luxury-black dark:text-white font-bold text-lg">{property.viewsCount || 150}</div>
                      <div className="text-xs text-neutral-500 uppercase tracking-widest">Vues</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl flex flex-col items-center gap-2 border border-neutral-100 dark:border-neutral-800">
                    <Users size={24} className="text-luxury-gold" />
                    <span className="text-sm font-bold text-luxury-black dark:text-white">{property.capacity || 10} Voyageurs</span>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl flex flex-col items-center gap-2 border border-neutral-100 dark:border-neutral-800">
                    <Home size={24} className="text-luxury-gold" />
                    <span className="text-sm font-bold text-luxury-black dark:text-white">{property.capacity ? Math.ceil(property.capacity/2) : 5} Chambres</span>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl flex flex-col items-center gap-2 border border-neutral-100 dark:border-neutral-800">
                    <Maximize size={24} className="text-luxury-gold" />
                    <span className="text-sm font-bold text-luxury-black dark:text-white">{property.size} m²</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-luxury-black dark:text-white flex items-center gap-2">
                    <Info size={16} className="text-luxury-gold" /> À propos de ce logement
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                    {property.description} Profitez d'un séjour inoubliable dans ce cadre luxueux offrant tout le confort moderne et une vue imprenable. Conçu pour les voyageurs exigeants, ce bien exceptionnel allie design contemporain et touches traditionnelles marocaines.
                  </p>
                </div>

                {/* Amenities */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-luxury-black dark:text-white">Équipements & Caractéristiques</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {[...property.amenities, ...(property.features || [])].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <Check size={14} className="text-green-500" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-luxury-black dark:text-white">Emplacement</h3>
                  <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden relative border border-neutral-200 dark:border-neutral-700">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                      <MapPin size={32} className="mb-2 text-luxury-gold opacity-50" />
                      <span className="text-sm font-medium">Carte interactive de {property.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Booking Engine */}
            <div className="lg:w-2/5 bg-neutral-50 dark:bg-neutral-900 p-8 md:p-10 border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <ShieldCheck size={24} className="text-luxury-gold" />
                <span className="text-sm font-bold uppercase tracking-widest text-luxury-black dark:text-white">Réservation Sécurisée</span>
              </div>

              <div className="bg-white dark:bg-luxury-black p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-neutral-100 dark:border-neutral-800 mb-6">
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-4xl font-serif font-bold text-luxury-black dark:text-white">€{property.price}</span>
                  <span className="text-neutral-500 mb-1">/ nuit</span>
                </div>

                {/* Booking Form */}
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Arrivée</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-luxury-black dark:text-white outline-none"
                      />
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Départ</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-luxury-black dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Voyageurs</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-luxury-black dark:text-white outline-none appearance-none"
                    >
                      <option value="1">1 Voyageur</option>
                      <option value="2">2 Voyageurs</option>
                      <option value="3">3 Voyageurs</option>
                      <option value="4">4 Voyageurs</option>
                      <option value="5">5 Voyageurs</option>
                      <option value="6">6 Voyageurs</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>€{property.price} x {nights} nuits</span>
                    <span>€{total}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span className="underline decoration-dotted cursor-help">Frais de service Riviera</span>
                    <span>€{serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span className="underline decoration-dotted cursor-help">Taxes et frais</span>
                    <span>€{taxes}</span>
                  </div>
                  <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-800 my-4" />
                  <div className="flex justify-between font-bold text-lg text-luxury-black dark:text-white">
                    <span>Total</span>
                    <span>€{finalTotal}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full py-5 text-base shadow-lg shadow-luxury-gold/20 flex items-center justify-center gap-2"
                >
                  Réserver maintenant <ChevronRight size={18} />
                </Button>
                <p className="text-center text-xs text-neutral-500 mt-4">
                  Aucun montant ne vous sera débité pour le moment
                </p>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-4 mt-auto">
                <Button 
                  variant="outline"
                  onClick={handleContact}
                  className="flex-1 py-4 bg-white dark:bg-luxury-black border-neutral-200 dark:border-neutral-800"
                >
                  <MessageSquare size={18} /> Contacter l'hôte
                </Button>
                <Button 
                  onClick={handleToggleCart}
                  variant={isInCart ? "outline" : "secondary"}
                  className={cn(
                    "flex-1 py-4",
                    isInCart ? "bg-white dark:bg-luxury-black border-neutral-200 dark:border-neutral-800" : "bg-neutral-200 dark:bg-neutral-800"
                  )}
                >
                  <ShoppingCart size={18} /> {isInCart ? "Retirer" : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
