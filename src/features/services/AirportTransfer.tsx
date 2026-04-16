import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plane, MapPin, Calendar, Clock, Users, Briefcase, 
  Shield, Star, CheckCircle, ChevronDown, ArrowRight, ArrowLeft,
  Car, ShieldCheck, Check, Info, X, Navigation, CreditCard,
  Ticket, Map, Compass, Coffee
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/BaseComponents";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Select } from "@/src/components/ui/Select";

export const AirportTransfer = () => {
  const { addNotification, flights, transferVehicles, tours } = useStore();
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Flight State
  const [flightMode, setFlightMode] = useState<"existing" | "custom" | "already_have">("existing");
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [selectedSeatClass, setSelectedSeatClass] = useState("economy");
  const [passengers, setPassengers] = useState(1);
  
  const [customFlight, setCustomFlight] = useState({ 
    departure: "", 
    arrival: "", 
    date: "", 
    returnDate: "",
    isRoundTrip: false,
    passengers: 1, 
    class: "economy",
    luggageLarge: 0,
    luggageSmall: 0,
    specialRequirements: "",
    budgetRange: ""
  });
  
  const [alreadyHaveFlight, setAlreadyHaveFlight] = useState({ 
    flightNumber: "", 
    airline: "",
    arrivalDate: "", 
    arrivalTime: "", 
    airport: "RAK", 
    terminal: "",
    destination: "", 
    passengers: 1,
    luggageLarge: 0,
    luggageSmall: 0
  });

  const [honeypot, setHoneypot] = useState("");

  // Step 2: Transfer State
  const [selectedTransferId, setSelectedTransferId] = useState("");
  const [transferOptions, setTransferOptions] = useState({ meetAndGreet: false, extraLuggage: false, childSeat: false });

  // Step 3: Tours State
  const [selectedTours, setSelectedTours] = useState<string[]>([]);

  const activeFlights = flights.filter(f => f.status === 'active' && f.type !== 'vtc');
  
  // Intelligent Transfer Logic: Filter by capacity
  const currentPassengers = flightMode === "custom" ? customFlight.passengers : flightMode === "already_have" ? alreadyHaveFlight.passengers : passengers;
  const activeTransfers = transferVehicles.filter(v => v.status === 'active' && v.capacity >= currentPassengers);

  const activeTours = tours.filter(t => t.status === 'active');

  const handleNext = () => {
    if (currentStep === 1) {
      if (flightMode === "existing" && !selectedFlightId) {
        addNotification("Veuillez sélectionner un vol", "error");
        return;
      }
      if (flightMode === "custom" && (!customFlight.departure || !customFlight.arrival || !customFlight.date)) {
        addNotification("Veuillez remplir les champs obligatoires", "error");
        return;
      }
      if (flightMode === "already_have" && (!alreadyHaveFlight.flightNumber || !alreadyHaveFlight.airport || !alreadyHaveFlight.destination)) {
        addNotification("Veuillez remplir les champs obligatoires", "error");
        return;
      }
    }
    if (currentStep === 2 && !selectedTransferId) {
      addNotification("Veuillez sélectionner un transfert", "error");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      const el = document.getElementById('booking-flow');
      if (el) {
        const yOffset = -100; 
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      handleCheckout();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      const el = document.getElementById('booking-flow');
      if (el) {
        const yOffset = -100; 
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleCheckout = () => {
    if (honeypot) {
      console.warn("Spam attempt blocked");
      return;
    }
    const { total, flightMargin, transferMargin, toursMargin, totalMargin } = calculateTotal();
    
    // Save custom flight request if applicable
    if (flightMode === "custom") {
      useStore.getState().addFlightRequest({
        id: Math.random().toString(36).substr(2, 9),
        userId: "user_1", // Mock user
        type: "custom",
        departure: customFlight.departure,
        arrival: customFlight.arrival,
        date: customFlight.date,
        returnDate: customFlight.isRoundTrip ? customFlight.returnDate : undefined,
        isRoundTrip: customFlight.isRoundTrip,
        passengers: customFlight.passengers,
        class: customFlight.class,
        luggageCount: {
          large: customFlight.luggageLarge,
          small: customFlight.luggageSmall
        },
        specialRequirements: customFlight.specialRequirements ? [customFlight.specialRequirements] : [],
        budgetRange: customFlight.budgetRange,
        status: "pending",
        createdAt: new Date().toISOString()
      });
    }

    if (flightMode === "already_have") {
      useStore.getState().addFlightRequest({
        id: Math.random().toString(36).substr(2, 9),
        userId: "user_1",
        type: "already_have",
        flightNumber: alreadyHaveFlight.flightNumber,
        airline: alreadyHaveFlight.airline,
        date: alreadyHaveFlight.arrivalDate,
        airport: alreadyHaveFlight.airport,
        terminal: alreadyHaveFlight.terminal,
        destination: alreadyHaveFlight.destination,
        passengers: alreadyHaveFlight.passengers,
        luggageCount: {
          large: alreadyHaveFlight.luggageLarge,
          small: alreadyHaveFlight.luggageSmall
        },
        status: "pending",
        createdAt: new Date().toISOString()
      });
    }

    // Save Booking
    useStore.getState().addTravelBooking({
      id: Math.random().toString(36).substr(2, 9),
      userId: "user_1",
      flightId: flightMode === "existing" ? selectedFlightId : undefined,
      seatClass: selectedSeatClass,
      transferId: selectedTransferId,
      transferOptions,
      tourIds: selectedTours,
      date: new Date().toISOString(),
      status: "pending",
      totalPrice: total,
      marginBreakdown: {
        flightMargin,
        transferMargin,
        toursMargin,
        totalMargin
      },
      payouts: {
        operatorAmount: total - totalMargin,
        driverAmount: 0 // Calculated later
      },
      createdAt: new Date().toISOString()
    });

    addNotification("Réservation confirmée avec succès !", "success");
    // Reset or redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const toggleTour = (id: string) => {
    setSelectedTours(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let subtotal = 0;
    let flightMargin = 0;
    let transferMargin = 0;
    let toursMargin = 0;
    
    // Flight
    if (flightMode === "existing" && selectedFlightId) {
      const flight = flights.find(f => f.id === selectedFlightId);
      if (flight) {
        let price = flight.price || 0;
        if (flight.seatClasses && flight.seatClasses.length > 0) {
          const seat = flight.seatClasses.find(s => s.type === selectedSeatClass);
          if (seat) price = seat.price;
        }
        subtotal += price;
        flightMargin = price * 0.15; // 15% default margin
      }
    }

    // Transfer
    if (selectedTransferId) {
      const transfer = transferVehicles.find(v => v.id === selectedTransferId);
      if (transfer) {
        let transferPrice = transfer.baseFare;
        if (transferOptions.meetAndGreet) transferPrice += 25;
        if (transferOptions.extraLuggage) transferPrice += 15;
        if (transferOptions.childSeat) transferPrice += 10;
        subtotal += transferPrice;
        transferMargin = transferPrice * 0.20; // 20% default margin
      }
    }

    // Tours
    selectedTours.forEach(tourId => {
      const tour = tours.find(t => t.id === tourId);
      if (tour) {
        subtotal += tour.price;
        toursMargin += tour.price * 0.25; // 25% default margin
      }
    });

    const totalMargin = flightMargin + transferMargin + toursMargin;
    const total = subtotal + totalMargin;

    return { subtotal, flightMargin, transferMargin, toursMargin, totalMargin, total };
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-luxury-black text-luxury-black dark:text-white pt-20 pb-32">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <ImagePlaceholder 
            src="https://picsum.photos/seed/airport/1920/1080" 
            className="w-full h-full object-cover brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-black/50 to-neutral-50 dark:to-luxury-black" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              Voyagez sans <span className="text-luxury-gold">Compromis</span>
            </h1>
            <p className="text-xl text-neutral-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              De votre porte à votre destination finale, nous orchestrons chaque détail de votre trajet avec une précision absolue.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => {
                const el = document.getElementById('booking-flow');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="px-8 py-4 rounded-full text-lg">
                Réserver maintenant
              </Button>
              <Button variant="outline" onClick={() => {
                const el = document.getElementById('guide-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="px-8 py-4 rounded-full text-lg border-white text-white hover:bg-white hover:text-luxury-black">
                Comment ça marche ?
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guide Section */}
      <section id="guide-section" className="max-w-6xl mx-auto px-4 mb-24">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
          >
            Excellence & Sérénité
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Comment Organiser Votre Arrivée</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg font-light">
            Nous avons conçu un processus en quatre étapes pour que votre transition vers votre destination soit aussi luxueuse que votre séjour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-y-1/2 z-0" />
          
          {[
            {
              icon: Plane,
              title: "1. Le Vol",
              desc: "Sélectionnez un vol existant ou demandez un jet privé. Si vous avez déjà vos billets, indiquez-nous simplement les détails pour synchroniser votre chauffeur."
            },
            {
              icon: Car,
              title: "2. Le Transfert",
              desc: "Choisissez parmi notre flotte premium. Chaque véhicule est conduit par un chauffeur professionnel bilingue, formé aux standards de la Riviera Collection."
            },
            {
              icon: Compass,
              title: "3. Expériences",
              desc: "Ne perdez pas une minute. Ajoutez des tours exclusifs ou des réservations de restaurants dès votre arrivée pour un séjour optimisé."
            },
            {
              icon: ShieldCheck,
              title: "4. Confirmation",
              desc: "Un récapitulatif transparent, un paiement sécurisé, et une assistance 24/7. Votre concierge vous contactera immédiatement après réservation."
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10 bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-luxury-black dark:bg-luxury-gold rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-luxury-gold/20 group-hover:rotate-6 transition-transform">
                <item.icon size={28} className="text-white" />
              </div>
              <div className="absolute top-8 right-8 text-4xl font-serif text-neutral-100 dark:text-neutral-800 font-bold">0{idx + 1}</div>
              <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-luxury-gold/5 rounded-[3rem] p-8 md:p-12 border border-luxury-gold/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="flex-1">
              <h3 className="text-3xl font-serif mb-6">Besoin d'un vol sur mesure ?</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg font-light">
                Si nos vols réguliers ne correspondent pas à votre emploi du temps, notre service de conciergerie aérienne peut organiser un vol privé ou un transfert en hélicoptère. 
                Utilisez l'option <span className="font-bold text-luxury-gold">"Demande Sur Mesure"</span> dans la première étape pour recevoir un devis personnalisé sous 2 heures.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Horaires flexibles selon vos besoins",
                  "Accès aux terminaux privés (FBO)",
                  "Service à bord personnalisé",
                  "Transfert direct vers votre villa",
                  "Discrétion absolue",
                  "Assistance bagages VIP"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={18} className="text-luxury-gold shrink-0" />
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl rotate-3 group">
              <ImagePlaceholder src="https://picsum.photos/seed/jet/800/800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Progress Bar */}
      <div id="booking-flow" className="sticky top-20 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-b border-neutral-100 dark:border-neutral-800/50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex justify-between items-center">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-neutral-200 dark:bg-neutral-800 z-0" />
            
            {/* Active Line */}
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-luxury-gold z-10"
              initial={false}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
            
            {[
              { step: 1, icon: Plane, label: "Vol" },
              { step: 2, icon: Car, label: "Transfert" },
              { step: 3, icon: Compass, label: "Expériences" },
              { step: 4, icon: CreditCard, label: "Paiement" }
            ].map((s) => (
              <div key={s.step} className="relative z-20 flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: currentStep === s.step ? 1.1 : 1,
                    backgroundColor: currentStep >= s.step ? "#D4AF37" : "transparent",
                    borderColor: currentStep >= s.step ? "#D4AF37" : "rgba(163, 163, 163, 0.2)",
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 border-[1px]",
                    currentStep >= s.step 
                      ? "text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                      : "bg-white dark:bg-neutral-900 text-neutral-400"
                  )}
                >
                  <s.icon size={16} className="transition-all duration-500" />
                </motion.div>
                
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-700",
                    currentStep === s.step ? "text-luxury-gold opacity-100" : "text-neutral-400 opacity-40"
                  )}>
                    {s.label}
                  </span>
                </div>

                {/* Pulse effect for active step */}
                {currentStep === s.step && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-luxury-gold/30 rounded-full -z-10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: FLIGHT */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Informations de Vol</h1>
                <p className="text-neutral-500">Sélectionnez votre vol ou indiquez vos détails d'arrivée.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-2 md:p-4 shadow-xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col md:flex-row gap-2 mb-8 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                  <button 
                    onClick={() => setFlightMode("existing")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                      flightMode === "existing" ? "bg-white dark:bg-neutral-700 shadow-md text-luxury-gold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    )}
                  >
                    <Plane size={18} /> Vols Disponibles
                  </button>
                  <button 
                    onClick={() => setFlightMode("custom")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                      flightMode === "custom" ? "bg-white dark:bg-neutral-700 shadow-md text-luxury-gold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    )}
                  >
                    <Ticket size={18} /> Demande Sur Mesure
                  </button>
                  <button 
                    onClick={() => setFlightMode("already_have")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                      flightMode === "already_have" ? "bg-white dark:bg-neutral-700 shadow-md text-luxury-gold" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    )}
                  >
                    <CheckCircle size={18} /> J'ai déjà mon vol
                  </button>
                </div>

                <div className="p-4 md:p-8">
                  {flightMode === "existing" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
                        <Users className="text-neutral-400" />
                        <div className="flex-1">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">Passagers</label>
                          <div className="flex items-center gap-4">
                            <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600">-</button>
                            <span className="font-bold">{passengers}</span>
                            <button onClick={() => setPassengers(passengers + 1)} className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600">+</button>
                          </div>
                        </div>
                      </div>
                      {activeFlights.map(flight => (
                        <div 
                          key={flight.id} 
                          onClick={() => setSelectedFlightId(flight.id)}
                          className={cn(
                            "group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                            selectedFlightId === flight.id 
                              ? "border-luxury-gold bg-luxury-gold/5" 
                              : "border-neutral-100 dark:border-neutral-800 hover:border-luxury-gold/50 bg-white dark:bg-neutral-900"
                          )}
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 relative">
                              <ImagePlaceholder src={flight.image || flight.airlineLogo || "https://picsum.photos/seed/flight/400/300"} className="w-full h-full object-cover" />
                              {flight.isFeatured && (
                                <div className="absolute top-2 left-2 bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                                  Recommandé
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{flight.airlineName || flight.type}</span>
                                    {flight.flightNumber && <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-400">{flight.flightNumber}</span>}
                                  </div>
                                  <h3 className="text-xl font-serif">{flight.departure} <ArrowRight size={16} className="inline text-luxury-gold mx-1" /> {flight.arrival}</h3>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold font-serif text-luxury-gold">
                                    €{flight.price || (flight.seatClasses && flight.seatClasses[0]?.price)}
                                  </div>
                                  <span className="text-xs text-neutral-400">à partir de</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-neutral-500">
                                {flight.departureTime && (
                                  <div className="flex items-center gap-1"><Clock size={14} /> {flight.departureTime} - {flight.arrivalTime}</div>
                                )}
                                {flight.duration && (
                                  <div className="flex items-center gap-1"><Map size={14} /> {flight.duration}</div>
                                )}
                                <div className="flex items-center gap-1"><Users size={14} /> {flight.capacity ? `${flight.capacity} pax` : 'Commercial'}</div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedFlightId === flight.id && flight.seatClasses && (
                            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 p-4 flex gap-4">
                              {flight.seatClasses.map(seat => (
                                <button
                                  key={seat.type}
                                  onClick={(e) => { e.stopPropagation(); setSelectedSeatClass(seat.type); }}
                                  className={cn(
                                    "flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                                    selectedSeatClass === seat.type
                                      ? "border-luxury-gold bg-luxury-gold text-white"
                                      : "border-neutral-200 dark:border-neutral-700 hover:border-luxury-gold/50"
                                  )}
                                >
                                  <div className="capitalize mb-1">{seat.type}</div>
                                  <div className="font-bold">€{seat.price}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {flightMode === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Honeypot field - hidden from users */}
                      <div className="hidden">
                        <input 
                          type="text" 
                          value={honeypot} 
                          onChange={(e) => setHoneypot(e.target.value)} 
                          tabIndex={-1} 
                          autoComplete="off" 
                        />
                      </div>

                      <div className="relative group z-40">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Départ</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ville ou Aéroport"
                            value={customFlight.departure}
                            onChange={(e) => setCustomFlight({...customFlight, departure: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-30">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Destination</label>
                        <div className="relative">
                          <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ville ou Aéroport"
                            value={customFlight.arrival}
                            onChange={(e) => setCustomFlight({...customFlight, arrival: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-20">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Date de départ</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="date" 
                            value={customFlight.date}
                            onChange={(e) => setCustomFlight({...customFlight, date: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-10">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Classe de voyage</label>
                        <Select 
                          value={customFlight.class}
                          onChange={(val) => setCustomFlight({...customFlight, class: val})}
                          icon={<Star size={18} />}
                          options={[
                            { value: "economy", label: "Économique" },
                            { value: "business", label: "Business" },
                            { value: "first", label: "Première Classe" },
                            { value: "private", label: "Jet Privé" },
                            { value: "helicopter", label: "Hélicoptère" }
                          ]}
                        />
                      </div>

                      <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold">
                              <Users size={20} />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg">Passagers & Bagages</h4>
                              <p className="text-xs text-neutral-500">Précisez la taille de votre groupe</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Passagers</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setCustomFlight({ ...customFlight, passengers: Math.max(1, customFlight.passengers - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{customFlight.passengers}</span>
                              <button onClick={() => setCustomFlight({ ...customFlight, passengers: customFlight.passengers + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Gros Bagages</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setCustomFlight({ ...customFlight, luggageLarge: Math.max(0, customFlight.luggageLarge - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{customFlight.luggageLarge}</span>
                              <button onClick={() => setCustomFlight({ ...customFlight, luggageLarge: customFlight.luggageLarge + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Bagages Cabine</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setCustomFlight({ ...customFlight, luggageSmall: Math.max(0, customFlight.luggageSmall - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{customFlight.luggageSmall}</span>
                              <button onClick={() => setCustomFlight({ ...customFlight, luggageSmall: customFlight.luggageSmall + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <input 
                            type="checkbox" 
                            id="roundTrip"
                            checked={customFlight.isRoundTrip}
                            onChange={(e) => setCustomFlight({...customFlight, isRoundTrip: e.target.checked})}
                            className="w-4 h-4 accent-luxury-gold"
                          />
                          <label htmlFor="roundTrip" className="text-sm font-medium cursor-pointer">Ajouter un vol retour</label>
                        </div>
                        
                        {customFlight.isRoundTrip && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="relative group mb-6"
                          >
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Date de retour</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                              <input 
                                type="date" 
                                value={customFlight.returnDate}
                                onChange={(e) => setCustomFlight({...customFlight, returnDate: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Besoins Spécifiques (Catering, Animaux, etc.)</label>
                        <textarea 
                          placeholder="Dites-nous en plus sur vos attentes..."
                          value={customFlight.specialRequirements}
                          onChange={(e) => setCustomFlight({...customFlight, specialRequirements: e.target.value})}
                          className="w-full p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Budget Estimé (Optionnel)</label>
                        <Select 
                          value={customFlight.budgetRange}
                          onChange={(val) => setCustomFlight({...customFlight, budgetRange: val})}
                          icon={<Briefcase size={18} />}
                          options={[
                            { value: "", label: "Non spécifié" },
                            { value: "under_5k", label: "Moins de 5 000 €" },
                            { value: "5k_15k", label: "5 000 € - 15 000 €" },
                            { value: "15k_50k", label: "15 000 € - 50 000 €" },
                            { value: "over_50k", label: "Plus de 50 000 €" }
                          ]}
                        />
                      </div>
                    </div>
                  )}

                  {flightMode === "already_have" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Honeypot field - hidden from users */}
                      <div className="hidden">
                        <input 
                          type="text" 
                          value={honeypot} 
                          onChange={(e) => setHoneypot(e.target.value)} 
                          tabIndex={-1} 
                          autoComplete="off" 
                        />
                      </div>

                      <div className="relative group z-40">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Compagnie Aérienne</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ex: Air France, Emirates..."
                            value={alreadyHaveFlight.airline}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, airline: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-30">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Numéro de vol</label>
                        <div className="relative">
                          <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ex: AF1234"
                            value={alreadyHaveFlight.flightNumber}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, flightNumber: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-20">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Aéroport d'arrivée</label>
                        <Select 
                          value={alreadyHaveFlight.airport}
                          onChange={(val) => setAlreadyHaveFlight({...alreadyHaveFlight, airport: val})}
                          icon={<MapPin size={18} />}
                          options={[
                            { value: "RAK", label: "Marrakech Menara (RAK)" },
                            { value: "CMN", label: "Casablanca Mohammed V (CMN)" },
                            { value: "RBA", label: "Rabat-Salé (RBA)" },
                            { value: "TNG", label: "Tanger Ibn Battouta (TNG)" },
                            { value: "AGA", label: "Agadir Al Massira (AGA)" }
                          ]}
                        />
                      </div>
                      <div className="relative group z-10">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Terminal (Si connu)</label>
                        <div className="relative">
                          <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ex: Terminal 1"
                            value={alreadyHaveFlight.terminal}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, terminal: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-0">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Date d'arrivée</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="date" 
                            value={alreadyHaveFlight.arrivalDate}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, arrivalDate: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative group z-0">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Heure d'arrivée estimée</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="time" 
                            value={alreadyHaveFlight.arrivalTime}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, arrivalTime: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">Destination finale</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Hôtel, Villa, Adresse précise..."
                            value={alreadyHaveFlight.destination}
                            onChange={(e) => setAlreadyHaveFlight({...alreadyHaveFlight, destination: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Passagers</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, passengers: Math.max(1, alreadyHaveFlight.passengers - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{alreadyHaveFlight.passengers}</span>
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, passengers: alreadyHaveFlight.passengers + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Gros Bagages</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, luggageLarge: Math.max(0, alreadyHaveFlight.luggageLarge - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{alreadyHaveFlight.luggageLarge}</span>
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, luggageLarge: alreadyHaveFlight.luggageLarge + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Bagages Cabine</label>
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, luggageSmall: Math.max(0, alreadyHaveFlight.luggageSmall - 1) })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">-</button>
                              <span className="font-bold">{alreadyHaveFlight.luggageSmall}</span>
                              <button onClick={() => setAlreadyHaveFlight({ ...alreadyHaveFlight, luggageSmall: alreadyHaveFlight.luggageSmall + 1 })} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TRANSFER */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Sélection du Transfert</h1>
                <p className="text-neutral-500">Choisissez le véhicule idéal pour votre trajet.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeTransfers.map(vehicle => (
                  <div 
                    key={vehicle.id}
                    onClick={() => setSelectedTransferId(vehicle.id)}
                    className={cn(
                      "group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-900",
                      selectedTransferId === vehicle.id 
                        ? "border-luxury-gold shadow-[0_10px_30px_rgba(212,175,55,0.2)]" 
                        : "border-neutral-100 dark:border-neutral-800 hover:border-luxury-gold/50"
                    )}
                  >
                    <div className="h-48 relative">
                      <ImagePlaceholder src={vehicle.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        {vehicle.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif mb-2">{vehicle.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                        <div className="flex items-center gap-1"><Users size={16} className="text-luxury-gold" /> {vehicle.capacity}</div>
                        <div className="flex items-center gap-1"><Briefcase size={16} className="text-luxury-gold" /> {vehicle.capacity - 1}</div>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-xs text-neutral-400 uppercase tracking-widest">Prix fixe</span>
                        <span className="text-2xl font-bold font-serif text-luxury-gold">€{vehicle.baseFare}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTransferId && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 mt-8"
                >
                  <h3 className="text-lg font-serif mb-4">Options supplémentaires</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                      transferOptions.meetAndGreet ? "border-luxury-gold bg-luxury-gold/5" : "border-neutral-200 dark:border-neutral-700"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", transferOptions.meetAndGreet ? "border-luxury-gold bg-luxury-gold text-white" : "border-neutral-300")}>
                          {transferOptions.meetAndGreet && <Check size={12} />}
                        </div>
                        <span className="font-medium text-sm">Accueil VIP (Pancarte)</span>
                      </div>
                      <span className="text-luxury-gold font-bold">+25€</span>
                      <input type="checkbox" className="hidden" checked={transferOptions.meetAndGreet} onChange={() => setTransferOptions(p => ({...p, meetAndGreet: !p.meetAndGreet}))} />
                    </label>
                    <label className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                      transferOptions.extraLuggage ? "border-luxury-gold bg-luxury-gold/5" : "border-neutral-200 dark:border-neutral-700"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", transferOptions.extraLuggage ? "border-luxury-gold bg-luxury-gold text-white" : "border-neutral-300")}>
                          {transferOptions.extraLuggage && <Check size={12} />}
                        </div>
                        <span className="font-medium text-sm">Bagages supplémentaires</span>
                      </div>
                      <span className="text-luxury-gold font-bold">+15€</span>
                      <input type="checkbox" className="hidden" checked={transferOptions.extraLuggage} onChange={() => setTransferOptions(p => ({...p, extraLuggage: !p.extraLuggage}))} />
                    </label>
                    <label className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                      transferOptions.childSeat ? "border-luxury-gold bg-luxury-gold/5" : "border-neutral-200 dark:border-neutral-700"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", transferOptions.childSeat ? "border-luxury-gold bg-luxury-gold text-white" : "border-neutral-300")}>
                          {transferOptions.childSeat && <Check size={12} />}
                        </div>
                        <span className="font-medium text-sm">Siège enfant</span>
                      </div>
                      <span className="text-luxury-gold font-bold">+10€</span>
                      <input type="checkbox" className="hidden" checked={transferOptions.childSeat} onChange={() => setTransferOptions(p => ({...p, childSeat: !p.childSeat}))} />
                    </label>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: TOURS */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Expériences Exclusives</h1>
                <p className="text-neutral-500">Agrémentez votre séjour avec nos circuits et activités premium.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeTours.map(tour => (
                  <div key={tour.id} className="bg-white dark:bg-neutral-900 rounded-[2rem] overflow-hidden shadow-lg border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row">
                    <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                      <ImagePlaceholder src={tour.images[0]} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-luxury-gold">
                        {tour.category}
                      </div>
                    </div>
                    <div className="p-6 w-full md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-serif leading-tight pr-4">{tour.title}</h3>
                          <div className="flex items-center gap-1 text-sm font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                            <Star size={14} className="text-luxury-gold fill-luxury-gold" /> {tour.rating}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{tour.description}</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
                          <div className="flex items-center gap-1"><Clock size={14} /> {tour.duration}</div>
                          <div className="flex items-center gap-1"><Users size={14} /> Max {tour.maxParticipants}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold font-serif text-luxury-gold">€{tour.price}</div>
                        <Button 
                          variant={selectedTours.includes(tour.id) ? "primary" : "outline"}
                          onClick={() => toggleTour(tour.id)}
                          className="rounded-xl"
                        >
                          {selectedTours.includes(tour.id) ? "Ajouté" : "Ajouter"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: CHECKOUT */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Récapitulatif & Paiement</h1>
                <p className="text-neutral-500">Vérifiez vos sélections avant de finaliser la réservation.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Summary Cards */}
                  <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 shadow-lg border border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-xl font-serif mb-6 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                      <Plane className="text-luxury-gold" /> Détails du Vol
                    </h3>
                    {flightMode === "existing" && selectedFlightId ? (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{flights.find(f => f.id === selectedFlightId)?.departure} ➔ {flights.find(f => f.id === selectedFlightId)?.arrival}</p>
                          <p className="text-sm text-neutral-500 capitalize">Classe: {selectedSeatClass}</p>
                        </div>
                        <div className="font-bold text-luxury-gold">
                          €{flights.find(f => f.id === selectedFlightId)?.seatClasses?.find(s => s.type === selectedSeatClass)?.price || flights.find(f => f.id === selectedFlightId)?.price}
                        </div>
                      </div>
                    ) : flightMode === "already_have" ? (
                      <div>
                        <p className="font-bold">Vol {alreadyHaveFlight.flightNumber}</p>
                        <p className="text-sm text-neutral-500">Arrivée à {alreadyHaveFlight.airport} le {alreadyHaveFlight.arrivalDate}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">Demande sur mesure soumise.</p>
                    )}
                  </div>

                  <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 shadow-lg border border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-xl font-serif mb-6 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                      <Car className="text-luxury-gold" /> Transfert Privé
                    </h3>
                    {selectedTransferId && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="font-bold">{transferVehicles.find(v => v.id === selectedTransferId)?.name}</p>
                          <div className="font-bold text-luxury-gold">€{transferVehicles.find(v => v.id === selectedTransferId)?.baseFare}</div>
                        </div>
                        {(transferOptions.meetAndGreet || transferOptions.extraLuggage || transferOptions.childSeat) && (
                          <div className="pl-4 border-l-2 border-luxury-gold/30 space-y-2">
                            {transferOptions.meetAndGreet && <div className="flex justify-between text-sm text-neutral-500"><span>Accueil VIP</span><span>+25€</span></div>}
                            {transferOptions.extraLuggage && <div className="flex justify-between text-sm text-neutral-500"><span>Bagages supp.</span><span>+15€</span></div>}
                            {transferOptions.childSeat && <div className="flex justify-between text-sm text-neutral-500"><span>Siège enfant</span><span>+10€</span></div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedTours.length > 0 && (
                    <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 shadow-lg border border-neutral-100 dark:border-neutral-800">
                      <h3 className="text-xl font-serif mb-6 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                        <Compass className="text-luxury-gold" /> Expériences
                      </h3>
                      <div className="space-y-4">
                        {selectedTours.map(tourId => {
                          const tour = tours.find(t => t.id === tourId);
                          return tour ? (
                            <div key={tour.id} className="flex justify-between items-center">
                              <p className="font-medium text-sm">{tour.title}</p>
                              <div className="font-bold text-luxury-gold">€{tour.price}</div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Panel */}
                <div className="bg-luxury-black text-white rounded-[2rem] p-8 shadow-2xl h-fit sticky top-40">
                  <h3 className="text-xl font-serif mb-6">Total à régler</h3>
                  
                  <div className="space-y-3 mb-6 border-b border-neutral-800 pb-6">
                    <div className="flex justify-between text-neutral-400">
                      <span>Sous-total</span>
                      <span>€{calculateTotal().subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Frais de service & taxes</span>
                      <span>€{calculateTotal().totalMargin.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-8">
                    <span className="text-lg font-bold">Total TTC</span>
                    <div className="text-right">
                      <span className="text-5xl font-bold font-serif text-luxury-gold">€{calculateTotal().total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input type="text" placeholder="Numéro de carte" className="w-full pl-12 pr-4 py-4 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-luxury-gold outline-none transition-all text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/AA" className="w-full px-4 py-4 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-luxury-gold outline-none transition-all text-white" />
                      <input type="text" placeholder="CVC" className="w-full px-4 py-4 bg-neutral-900 rounded-xl border border-neutral-800 focus:border-luxury-gold outline-none transition-all text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-8">
                    <ShieldCheck size={16} className="text-green-500" />
                    Paiement sécurisé crypté 256-bit
                  </div>

                  <Button onClick={handleCheckout} className="w-full py-5 text-lg rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    Confirmer le paiement
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-8">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack} className="py-4 px-8 flex items-center gap-2 rounded-xl">
              <ArrowLeft size={18} /> Retour
            </Button>
          ) : <div />}
          
          {currentStep < totalSteps && (
            <Button onClick={handleNext} className="py-4 px-12 flex items-center gap-2 rounded-xl shadow-lg shadow-luxury-gold/20">
              Continuer <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
