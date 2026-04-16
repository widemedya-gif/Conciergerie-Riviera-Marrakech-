import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, Plane, Car, UserCheck, GlassWater, Map, Shield,
  Building, Key, TrendingUp, FileText, Wrench,
  Paintbrush, Sofa, LayoutDashboard, Cuboid, Hammer, ShoppingBag,
  ArrowRight, ChevronDown
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useStore } from "@/src/store/useStore";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export const conciergeServices = [
  { name: "Chef Privé", desc: "Dîner gastronomique dans votre villa", icon: ChefHat },
  { name: "Transferts Aéroport", desc: "Arrivée et départ sans faille", icon: Plane },
  { name: "Location de Voitures de Luxe", desc: "Véhicules premium à votre porte", icon: Car },
  { name: "Chauffeur Privé", desc: "Service de chauffeur 24/7", icon: UserCheck },
  { name: "Événements VIP et Vie Nocturne", desc: "Accès exclusif et réservations", icon: GlassWater, tag: "Populaire" },
  { name: "Visites Guidées", desc: "Expériences locales sur mesure", icon: Map },
  { name: "Services de Sécurité", desc: "Protection discrète et professionnelle", icon: Shield },
];

export const propertyServices = [
  { name: "Gestion Immobilière", desc: "Entretien complet du domaine", icon: Building, tag: "Premium" },
  { name: "Location à Court Terme", desc: "Maximisez votre rendement", icon: Key },
  { name: "Conseil en Investissement", desc: "Aperçus stratégiques du marché", icon: TrendingUp },
  { name: "Annonce Immobilière", desc: "Accès exclusif au portefeuille", icon: FileText },
  { name: "Entretien et Nettoyage", desc: "Normes impeccables", icon: Wrench },
];

export const interiorDesignServices = [
  { name: "Design d'Intérieur Complet", desc: "Transformation esthétique complète", icon: Paintbrush, tag: "Premium" },
  { name: "Ameublement de Luxe", desc: "Pièces haut de gamme sélectionnées", icon: Sofa },
  { name: "Aménagement de l'Espace", desc: "Agencements et flux optimisés", icon: LayoutDashboard },
  { name: "Visualisation 3D", desc: "Aperçus conceptuels photoréalistes", icon: Cuboid, tag: "Nouveau" },
  { name: "Rénovation et Style", desc: "Modernisez votre propriété", icon: Hammer },
  { name: "Recherche de Meubles sur Mesure", desc: "Articles rares et sur mesure", icon: ShoppingBag },
];

export function ServicesMegaMenu({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const setLastVisitedService = useStore((state) => state.setLastVisitedService);
  const setChefPrivePageOpen = useStore((state) => state.setChefPrivePageOpen);
  const setGestionImmobilierePageOpen = useStore((state) => state.setGestionImmobilierePageOpen);
  const setShortTermRentalsOpen = useStore((state) => state.setShortTermRentalsOpen);
  const setAirportTransferOpen = useStore((state) => state.setAirportTransferOpen);

  const handleServiceClick = React.useCallback((serviceName: string) => {
    if (serviceName === "Chef Privé") {
      setChefPrivePageOpen(true);
    } else if (serviceName === "Gestion Immobilière") {
      setGestionImmobilierePageOpen(true);
    } else if (serviceName === "Location à Court Terme") {
      setShortTermRentalsOpen(true);
    } else if (serviceName === "Transferts Aéroport") {
      setAirportTransferOpen(true);
    } else {
      setLastVisitedService(serviceName);
    }
    setIsOpen(false);
  }, [setLastVisitedService, setChefPrivePageOpen, setGestionImmobilierePageOpen, setShortTermRentalsOpen, setAirportTransferOpen]);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={cn(
          "flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 py-2 whitespace-nowrap",
          isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white"
        )}
      >
        Services
        <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[1000] cursor-default"
          >
            <div className="w-[1000px] xl:w-[1100px] bg-white dark:bg-neutral-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 dark:border-neutral-800 relative">
              {/* Pointer indicator */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-neutral-900 border-t border-l border-gray-100 dark:border-neutral-800 rotate-45" />
              
              <div className="p-8 relative z-10 bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 gap-8">
                
                {/* Column 1: Concierge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-serif font-bold text-luxury-black dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-4">Conciergerie</h3>
                  <ul className="space-y-4">
                    {conciergeServices.map((service) => (
                      <li key={service.name}>
                        <button 
                          onClick={() => handleServiceClick(service.name)}
                          className="group/item flex items-start gap-4 w-full text-left p-2 -ml-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 group-hover/item:bg-white dark:group-hover/item:bg-neutral-700 group-hover/item:shadow-sm transition-all group-hover/item:text-luxury-gold">
                            <service.icon size={18} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-800 dark:text-white group-hover/item:text-luxury-gold transition-colors">{service.name}</span>
                              {service.tag && (
                                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400">
                                  {service.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{service.desc}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Column 2: Property */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-serif font-bold text-luxury-black dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-4">Propriété</h3>
                  <ul className="space-y-4">
                    {propertyServices.map((service) => (
                      <li key={service.name}>
                        <button 
                          onClick={() => handleServiceClick(service.name)}
                          className="group/item flex items-start gap-4 w-full text-left p-2 -ml-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 group-hover/item:bg-white dark:group-hover/item:bg-neutral-700 group-hover/item:shadow-sm transition-all group-hover/item:text-luxury-gold">
                            <service.icon size={18} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-800 dark:text-white group-hover/item:text-luxury-gold transition-colors">{service.name}</span>
                              {service.tag && (
                                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                  {service.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{service.desc}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Column 3: Interior Design (Premium) */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="space-y-6 bg-luxury-gold/5 dark:bg-luxury-gold/10 -my-6 -mx-4 p-6 rounded-2xl border border-luxury-gold/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-luxury-gold text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">Premium</div>
                  <h3 className="text-lg font-serif font-bold text-luxury-gold border-b border-luxury-gold/20 pb-4">Design d'Intérieur</h3>
                  <ul className="space-y-4 relative z-10">
                    {interiorDesignServices.map((service) => (
                      <li key={service.name}>
                        <button 
                          onClick={() => handleServiceClick(service.name)}
                          className="group/item flex items-start gap-4 w-full text-left p-2 -ml-2 rounded-xl hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-white/50 dark:bg-neutral-700 group-hover/item:bg-white dark:group-hover/item:bg-neutral-600 group-hover/item:shadow-sm transition-all group-hover/item:text-luxury-bordeaux">
                            <service.icon size={18} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-800 dark:text-white group-hover/item:text-luxury-bordeaux transition-colors">{service.name}</span>
                              {service.tag && (
                                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-luxury-bordeaux/10 text-luxury-bordeaux">
                                  {service.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-neutral-400 mt-0.5">{service.desc}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Column 4: Promotional Panel */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="h-full"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden group/promo cursor-pointer" onClick={() => handleServiceClick("Interior Design Promo")}>
                    <ImagePlaceholder 
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" 
                      alt="Luxury Interior" 
                      className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover/promo:scale-105"
                      aspectRatio="video"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start">
                      <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mb-2">Service Vedette</span>
                      <h4 className="text-2xl font-serif text-white mb-2 leading-tight">Transformez Votre Espace en Chef-d'œuvre</h4>
                      <p className="text-sm text-gray-300 mb-6 font-light">Élevez votre propriété avec notre équipe de design d'intérieur primée.</p>
                      <button className="flex items-center gap-2 bg-white text-luxury-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all duration-300 group-hover/promo:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        Explorer le Design d'Intérieur <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
