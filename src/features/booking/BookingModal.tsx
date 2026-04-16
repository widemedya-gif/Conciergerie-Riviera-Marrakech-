import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Info, CheckCircle2, ArrowRight, ArrowLeft, Star, MapPin } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { propertyService } from "@/src/services/api";
import { Modal, Button, Skeleton } from "@/src/components/ui/BaseComponents";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Property } from "@/src/types";
import DatePicker from "react-datepicker";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/src/lib/utils";

type BookingStep = "details" | "dates" | "guests" | "summary" | "confirmation";

export default function BookingModal() {
  const { selectedPropertyId, setSelectedPropertyId, addNotification, addClientBooking, user } = useStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [step, setStep] = useState<BookingStep>("details");
  const [isLoading, setIsLoading] = useState(false);
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (selectedPropertyId) {
      const load = async () => {
        setIsLoading(true);
        const data = await propertyService.getPropertyById(selectedPropertyId);
        if (data) setProperty(data);
        setIsLoading(false);
      };
      load();
    } else {
      setProperty(null);
      setStep("details");
    }
  }, [selectedPropertyId]);

  const handleClose = () => {
    setSelectedPropertyId(null);
    setStep("details");
  };

  const calculateTotal = () => {
    if (!property || !startDate || !endDate) return 0;
    const nights = differenceInDays(endDate, startDate);
    const subtotal = property.price * nights;
    const serviceFee = subtotal * 0.1;
    return subtotal + serviceFee;
  };

  const handleConfirm = async () => {
    if (!property || !startDate || !endDate) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add to store
    addClientBooking({
      id: `b-${Date.now()}`,
      userId: user?.id || "guest",
      userName: user?.name || "Guest",
      propertyId: property.id,
      propertyName: property.title,
      propertyImage: property.images[0],
      date: startDate.toISOString(),
      status: "pending",
      price: calculateTotal(),
      message: "Demande de réservation via le portail client."
    });

    setStep("confirmation");
    setIsLoading(false);
    addNotification("Réservation confirmée avec succès !", "success");
  };

  if (!selectedPropertyId) return null;

  return (
    <Modal 
      isOpen={!!selectedPropertyId} 
      onClose={handleClose}
      title={step === "confirmation" ? "Réservation Confirmée" : property?.title || "Détails de la Propriété"}
      className="max-w-4xl"
    >
      <div className="flex flex-col h-full">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </motion.div>
          ) : step === "details" && property ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-xl">
                  <ImagePlaceholder src={property.images[0]} alt={property.title} />
                </div>
                <div className="flex gap-2">
                  {property.images.slice(1).map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                      <ImagePlaceholder src={img} aspectRatio="square" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-luxury-gold">
                  <Star size={16} className="fill-current" />
                  <span className="font-bold">{property.rating}</span>
                  <span className="text-gray-400 dark:text-neutral-500 font-medium">({property.reviews.length} avis)</span>
                </div>
                <p className="text-gray-500 dark:text-neutral-400 leading-relaxed font-light">{property.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                      {a}
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-luxury-black dark:text-white">€{property.price}</span>
                    <span className="text-gray-400 dark:text-neutral-500 uppercase tracking-widest text-xs">/ nuit</span>
                  </div>
                  <Button onClick={() => setStep("dates")} className="w-full py-5">
                    Vérifier la Disponibilité <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : step === "dates" ? (
            <motion.div 
              key="dates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-2 text-luxury-black dark:text-white">Sélectionnez vos dates</h3>
                <p className="text-gray-400 dark:text-neutral-500">Choisissez vos dates d'arrivée et de départ</p>
              </div>
              <div className="flex justify-center">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date | null, Date | null];
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  monthsShown={2}
                  minDate={new Date()}
                  excludeDates={property?.unavailableDates.map(d => new Date(d))}
                />
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-neutral-800">
                <Button variant="ghost" onClick={() => setStep("details")}>
                  <ArrowLeft size={18} /> Retour
                </Button>
                <Button 
                  disabled={!startDate || !endDate} 
                  onClick={() => setStep("guests")}
                >
                  Continuer <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          ) : step === "guests" ? (
            <motion.div 
              key="guests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-2 text-luxury-black dark:text-white">Qui vous accompagne ?</h3>
                <p className="text-gray-400 dark:text-neutral-500">Sélectionnez le nombre de voyageurs</p>
              </div>
              <div className="max-w-xs mx-auto space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-neutral-900 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <Users className="text-luxury-gold" />
                    <span className="font-bold text-luxury-black dark:text-white">Voyageurs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-800 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors text-luxury-black dark:text-white"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-luxury-black dark:text-white">{guests}</span>
                    <button 
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-800 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors text-luxury-black dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-neutral-800">
                <Button variant="ghost" onClick={() => setStep("dates")}>
                  <ArrowLeft size={18} /> Retour
                </Button>
                <Button onClick={() => setStep("summary")}>
                  Voir le Résumé <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          ) : step === "summary" ? (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-gray-50 dark:bg-neutral-900 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-serif mb-1 text-luxury-black dark:text-white">{property?.title}</h4>
                    <p className="text-sm text-gray-400 dark:text-neutral-500">{property?.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-luxury-gold">{guests} Voyageurs</p>
                    <p className="text-xs text-gray-400 dark:text-neutral-500">
                      {startDate && format(startDate, "d MMM")} - {endDate && format(endDate, "d MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-neutral-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-neutral-400">€{property?.price} x {startDate && endDate && differenceInDays(endDate, startDate)} nuits</span>
                    <span className="font-bold text-luxury-black dark:text-white">€{property && startDate && endDate && property.price * differenceInDays(endDate, startDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-neutral-400">Frais de Service (10%)</span>
                    <span className="font-bold text-luxury-black dark:text-white">€{property && startDate && endDate && (property.price * differenceInDays(endDate, startDate) * 0.1).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif pt-4 border-t border-gray-200 dark:border-neutral-800">
                    <span className="text-luxury-black dark:text-white">Total</span>
                    <span className="text-luxury-gold">€{calculateTotal().toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep("guests")}>
                  <ArrowLeft size={18} /> Retour
                </Button>
                <Button isLoading={isLoading} onClick={handleConfirm} className="px-12">
                  Confirmer la Réservation
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h3 className="text-4xl font-serif text-luxury-black dark:text-white">Réservation Confirmée !</h3>
              <p className="text-gray-500 dark:text-neutral-400 max-w-sm mx-auto">
                Votre séjour à {property?.title} a été réservé. Un e-mail de confirmation a été envoyé à votre adresse.
              </p>
              <div className="pt-8">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-neutral-500 font-bold mb-4">ID de Réservation : RIV-{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                <Button onClick={handleClose} variant="outline" className="px-12">
                  Fermer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
