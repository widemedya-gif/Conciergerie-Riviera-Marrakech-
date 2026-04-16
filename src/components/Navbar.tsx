import { useState, useEffect } from "react";
import { Search, User, Menu, X, Heart, LogOut, Settings, ChevronDown, ShoppingCart, BarChart2, Trash2, ChevronRight, Building2, LayoutDashboard, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useStore } from "@/src/store/useStore";
import { ServicesMegaMenu, conciergeServices, propertyServices, interiorDesignServices } from "./navigation/ServicesMegaMenu";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { ThemeToggle } from "./ui/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);
  
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const setAdminPanelOpen = useStore((state) => state.setAdminPanelOpen);
  const setAdminLoginModalOpen = useStore((state) => state.setAdminLoginModalOpen);
  const favorites = useStore((state) => state.favorites);
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const comparisonList = useStore((state) => state.comparisonList);
  const setComparisonModalOpen = useStore((state) => state.setComparisonModalOpen);
  const properties = useStore((state) => state.properties);
  const addNotification = useStore((state) => state.addNotification);
  const setLastVisitedService = useStore((state) => state.setLastVisitedService);

  const cartItems = properties.filter(p => cart.includes(p.id));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next === 5) {
        setAdminLoginModalOpen(true);
        return 0;
      }
      return next;
    });
    
    // Clear previous timeout and set a new one for 3 seconds
    if ((window as any).logoClickTimeout) {
      clearTimeout((window as any).logoClickTimeout);
    }
    (window as any).logoClickTimeout = setTimeout(() => setLogoClicks(0), 3000);
  };

  const setPropertiesPageOpen = useStore((state) => state.setPropertiesPageOpen);
  const setChefPrivePageOpen = useStore((state) => state.setChefPrivePageOpen);

  const navLinks = [
    { name: "Accueil", onClick: () => { setPropertiesPageOpen(false); setChefPrivePageOpen(false); } },
    { name: "Propriétés", onClick: () => setPropertiesPageOpen(true) },
    { name: "Villas", onClick: () => { setPropertiesPageOpen(true); useStore.getState().setFilters({ propertyType: "Villa" }); } },
    { name: "Appartements", onClick: () => { setPropertiesPageOpen(true); useStore.getState().setFilters({ propertyType: "Appartement" }); } },
    { name: "À Propos", href: "#about" },
  ];

  const setGestionImmobilierePageOpen = useStore((state) => state.setGestionImmobilierePageOpen);
  const setShortTermRentalsOpen = useStore((state) => state.setShortTermRentalsOpen);

  const handleMobileServiceClick = (serviceName: string) => {
    if (serviceName === "Chef Privé") {
      setChefPrivePageOpen(true);
    } else if (serviceName === "Gestion Immobilière") {
      setGestionImmobilierePageOpen(true);
    } else if (serviceName === "Location à Court Terme") {
      setShortTermRentalsOpen(true);
    } else {
      setLastVisitedService(serviceName);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4",
        isScrolled 
          ? "bg-white/90 dark:bg-luxury-black/90 backdrop-blur-md shadow-sm py-3 border-b border-neutral-100 dark:border-neutral-800" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className={cn(
            "cursor-pointer transition-transform duration-300 hover:scale-105 shrink-0",
            isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white"
          )}
        >
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight whitespace-nowrap">
            CONCIERGE <span className="text-luxury-gold">RIVIERA</span>
          </h1>
          <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-sans opacity-80 whitespace-nowrap">
            Marrakech Luxury Living
          </p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-12">
          <div className="flex items-center gap-4 xl:gap-8">
            {navLinks.slice(0, 4).map((link) => (
              <button
                key={link.name}
                onClick={link.onClick}
                className={cn(
                  "text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 relative group whitespace-nowrap",
                  isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>
          
          <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
          
          <div className="flex items-center gap-4 xl:gap-8">
            <ServicesMegaMenu isScrolled={isScrolled} />
            
            {navLinks.slice(4).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 relative group whitespace-nowrap",
                  isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 xl:gap-8">
          {/* Utility Group */}
          <div className="hidden xl:flex items-center gap-2 border-r border-neutral-100 dark:border-neutral-800 pr-4">
            <button className={cn("p-2 transition-colors hover:text-luxury-gold", isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white")}>
              <Search size={18} />
            </button>

            {/* Comparison */}
            <button 
              onClick={() => setComparisonModalOpen(true)}
              className={cn("relative p-2 transition-colors hover:text-luxury-gold", isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white")}
            >
              <BarChart2 size={18} />
              {comparisonList.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-luxury-gold text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                  {comparisonList.length}
                </span>
              )}
            </button>
            
            <button className={cn("relative p-2 transition-colors hover:text-luxury-gold", isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white")}>
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-luxury-bordeaux text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={cn("relative p-2 transition-colors hover:text-luxury-gold", isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white")}
              >
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-black dark:bg-white text-white dark:text-black text-[8px] rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Votre Sélection ({cart.length})</span>
                      <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-black"><X size={16} /></button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div key={item.id} className="p-4 flex gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <ImagePlaceholder src={item.images[0]} aspectRatio="square" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold truncate dark:text-white">{item.title}</h4>
                              <p className="text-[10px] text-neutral-500 truncate">{item.location}</p>
                              <span className="text-xs font-bold text-luxury-gold">€{item.price} / nuit</span>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-300 hover:text-luxury-bordeaux transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <ShoppingCart size={32} className="mx-auto text-neutral-200 mb-4" />
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Panier Vide</p>
                        </div>
                      )}
                    </div>
                    {cartItems.length > 0 && (
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-800">
                        <button 
                          onClick={() => { setComparisonModalOpen(true); setIsCartOpen(false); }}
                          className="w-full py-3 bg-luxury-black text-white dark:bg-white dark:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all flex items-center justify-center gap-2"
                        >
                          Comparer les propriétés <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <ThemeToggle />

          <div className="h-8 w-[1px] bg-neutral-100 dark:bg-neutral-800 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden xl:block text-right">
                <p className={cn("text-xs font-bold", isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white")}>{user.name}</p>
                <p className="text-[8px] text-gray-400 uppercase tracking-widest">{user.role === "owner" ? "Propriétaire" : user.role === "chef" ? "Chef" : "Client"}</p>
              </div>
              <div className="relative group">
                <div className="w-9 h-9 rounded-full border-2 border-luxury-gold p-0.5 cursor-pointer bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center hover:bg-luxury-gold/10 transition-colors">
                  <User size={18} className="text-luxury-gold" />
                </div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 z-50">
                  <button 
                    onClick={() => {
                      if (user.role === "owner") {
                        useStore.getState().setActiveOwnerTab("settings");
                        useStore.getState().setOwnerDashboardOpen(true);
                      } else {
                        useStore.getState().setActiveClientTab("settings");
                        useStore.getState().setClientDashboardOpen(true);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                  >
                    <User size={16} /> Mon Profil
                  </button>
                  {user.role === "client" ? (
                    <>
                      <button 
                        onClick={() => useStore.getState().setClientDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          useStore.getState().setActiveClientTab("favorites");
                          useStore.getState().setClientDashboardOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                      >
                        <Heart size={16} /> Mes Favoris
                      </button>
                    </>
                  ) : user.role === "chef" ? (
                    <>
                      <button 
                        onClick={() => useStore.getState().setChefDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard Chef
                      </button>
                      <button 
                        onClick={() => {
                          useStore.getState().setActiveChefTab("bookings");
                          useStore.getState().setChefDashboardOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                      >
                        <CalendarDays size={16} /> Réservations
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => useStore.getState().setOwnerDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          useStore.getState().setActiveOwnerTab("listings");
                          useStore.getState().setOwnerDashboardOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                      >
                        <Building2 size={16} /> Mes Biens
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      if (user.role === "owner") {
                        useStore.getState().setActiveOwnerTab("settings");
                        useStore.getState().setOwnerDashboardOpen(true);
                      } else {
                        useStore.getState().setActiveClientTab("settings");
                        useStore.getState().setClientDashboardOpen(true);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                  >
                    <Settings size={16} /> Paramètres
                  </button>
                  <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-2" />
                  <button 
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem("auth_token");
                      addNotification("Déconnexion réussie", "info");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold uppercase tracking-widest text-red-600 transition-colors"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  useStore.getState().setAuthModalView("login");
                  setAuthModalOpen(true);
                }}
                className={cn(
                  "hidden md:block px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 whitespace-nowrap",
                  "text-luxury-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                )}
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  useStore.getState().setAuthModalView("register");
                  setAuthModalOpen(true);
                }}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 border whitespace-nowrap",
                  "border-luxury-black bg-luxury-black text-white hover:bg-transparent hover:text-luxury-black shadow-lg shadow-black/10",
                  "dark:border-white dark:bg-white dark:text-luxury-black dark:hover:bg-transparent dark:hover:text-white"
                )}
              >
                S'inscrire
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-full transition-colors",
              isScrolled ? "text-luxury-black dark:text-white" : "text-luxury-black dark:text-white"
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-luxury-black shadow-xl lg:hidden border-t border-gray-100 dark:border-neutral-800 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.slice(0, 4).map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.onClick) link.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-2xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                >
                  {link.name}
                </button>
              ))}

              {/* Mobile Services Accordion */}
              <div className="space-y-4">
                <button 
                  onClick={() => setMobileAccordion(mobileAccordion === "services" ? null : "services")}
                  className="flex items-center justify-between w-full text-2xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                >
                  Services
                  <ChevronDown size={20} className={cn("transition-transform", mobileAccordion === "services" && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {mobileAccordion === "services" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-6 pt-4 pb-2 border-l-2 border-luxury-gold/20 ml-2">
                        
                        {/* Concierge */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-3">Conciergerie</h4>
                          <ul className="space-y-3">
                            {conciergeServices.map(s => (
                              <li key={s.name}>
                                <button onClick={() => handleMobileServiceClick(s.name)} className="text-left text-gray-600 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm flex items-center gap-2">
                                  <s.icon size={14} /> {s.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Property */}
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-3">Propriété</h4>
                          <ul className="space-y-3">
                            {propertyServices.map(s => (
                              <li key={s.name}>
                                <button onClick={() => handleMobileServiceClick(s.name)} className="text-left text-gray-600 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm flex items-center gap-2">
                                  <s.icon size={14} /> {s.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Interior Design */}
                        <div className="bg-luxury-gold/5 p-4 rounded-xl border border-luxury-gold/10">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-luxury-gold mb-3 flex items-center justify-between">
                            Design d'Intérieur <span className="text-[8px] bg-luxury-gold text-white px-2 py-0.5 rounded-full">PREMIUM</span>
                          </h4>
                          <ul className="space-y-3">
                            {interiorDesignServices.map(s => (
                              <li key={s.name}>
                                <button onClick={() => handleMobileServiceClick(s.name)} className="text-left text-luxury-bordeaux hover:text-luxury-gold transition-colors text-sm flex items-center gap-2">
                                  <s.icon size={14} /> {s.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(4).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}

              {user && user.role === "owner" && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <button 
                    onClick={() => {
                      useStore.getState().setOwnerDashboardOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xl font-serif text-luxury-gold flex items-center gap-3"
                  >
                    <LayoutDashboard size={20} /> Dashboard Propriétaire
                  </button>
                  <button 
                    onClick={() => {
                      useStore.getState().setActiveOwnerTab("settings");
                      useStore.getState().setOwnerDashboardOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xl font-serif text-luxury-black dark:text-white flex items-center gap-3"
                  >
                    <Settings size={20} /> Paramètres
                  </button>
                </div>
              )}

              {user && user.role === "chef" && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <button 
                    onClick={() => {
                      useStore.getState().setChefDashboardOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xl font-serif text-luxury-gold flex items-center gap-3"
                  >
                    <LayoutDashboard size={20} /> Dashboard Chef
                  </button>
                  <button 
                    onClick={() => {
                      useStore.getState().setActiveChefTab("settings");
                      useStore.getState().setChefDashboardOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xl font-serif text-luxury-black dark:text-white flex items-center gap-3"
                  >
                    <Settings size={20} /> Paramètres
                  </button>
                </div>
              )}

              <div className="h-[1px] bg-gray-100 dark:bg-neutral-800 w-full" />
              {!user && (
                <button 
                  onClick={() => {
                    setAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-5 bg-luxury-black text-white dark:bg-white dark:text-black rounded-2xl font-bold tracking-widest uppercase text-sm"
                >
                  Connexion
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

