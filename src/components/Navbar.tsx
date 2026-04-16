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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        isScrolled 
          ? "bg-white/80 dark:bg-luxury-black/80 backdrop-blur-xl shadow-lg py-3 border-b border-neutral-100/50 dark:border-neutral-800/50" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
        {/* Logo */}
        <motion.div
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer flex flex-col shrink-0"
        >
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tighter leading-none flex items-center gap-2">
            <span className="text-luxury-black dark:text-white">CONCIERGE</span>
            <span className="text-luxury-gold">RIVIERA</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-[1px] w-4 bg-luxury-gold/50" />
            <p className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-sans font-medium text-neutral-500 dark:text-neutral-400">
              Marrakech Luxury Living
            </p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center bg-neutral-100/50 dark:bg-neutral-800/30 backdrop-blur-md px-6 py-2 rounded-full border border-neutral-200/50 dark:border-neutral-700/30">
          <div className="flex items-center gap-6 xl:gap-10">
            {navLinks.slice(0, 4).map((link) => (
              <button
                key={link.name}
                onClick={link.onClick}
                className={cn(
                  "text-[11px] xl:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative group",
                  "text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold dark:hover:text-luxury-gold"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            
            <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700" />
            
            <ServicesMegaMenu isScrolled={isScrolled} />
            
            {navLinks.slice(4).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[11px] xl:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative group",
                  "text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold dark:hover:text-luxury-gold"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Utility Group */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-800/30 backdrop-blur-md p-1 rounded-full border border-neutral-200/50 dark:border-neutral-700/30">
            <button className="p-2 text-neutral-500 hover:text-luxury-gold transition-colors rounded-full hover:bg-white dark:hover:bg-neutral-800">
              <Search size={16} />
            </button>

            {/* Comparison */}
            <button 
              onClick={() => setComparisonModalOpen(true)}
              className="relative p-2 text-neutral-500 hover:text-luxury-gold transition-colors rounded-full hover:bg-white dark:hover:bg-neutral-800"
            >
              <BarChart2 size={16} />
              {comparisonList.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-luxury-gold text-white text-[8px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-neutral-900">
                  {comparisonList.length}
                </span>
              )}
            </button>
            
            <button className="relative p-2 text-neutral-500 hover:text-luxury-gold transition-colors rounded-full hover:bg-white dark:hover:bg-neutral-800">
              <Heart size={16} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-luxury-bordeaux text-white text-[8px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-neutral-900">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-neutral-500 hover:text-luxury-gold transition-colors rounded-full hover:bg-white dark:hover:bg-neutral-800"
              >
                <ShoppingCart size={16} />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-luxury-black dark:bg-white text-white dark:text-black text-[8px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-neutral-900">
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-full border-2 border-luxury-gold p-0.5 cursor-pointer bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center hover:shadow-lg hover:shadow-luxury-gold/20 transition-all"
                >
                  <User size={20} className="text-luxury-gold" />
                </motion.div>
                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-2">
                    <p className="text-xs font-bold dark:text-white truncate">{user.name}</p>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">
                      {user.role === "owner" ? "Propriétaire" : user.role === "chef" ? "Chef" : "Client Privilégié"}
                    </p>
                  </div>
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 transition-colors"
                  >
                    <User size={16} /> Mon Profil
                  </button>
                  {user.role === "client" ? (
                    <>
                      <button 
                        onClick={() => useStore.getState().setClientDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                    </>
                  ) : user.role === "chef" ? (
                    <>
                      <button 
                        onClick={() => useStore.getState().setChefDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard Chef
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => useStore.getState().setOwnerDashboardOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                    </>
                  )}
                  <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-2" />
                  <button 
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem("auth_token");
                      addNotification("Déconnexion réussie", "info");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-[10px] font-bold uppercase tracking-widest text-red-600 transition-colors"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
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
                    "hidden sm:block px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300",
                    "text-neutral-600 hover:text-luxury-black dark:text-neutral-400 dark:hover:text-white"
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
                    "px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500",
                    "bg-luxury-black text-white hover:bg-luxury-gold dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold shadow-lg shadow-black/10"
                  )}
                >
                  S'inscrire
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-luxury-black dark:text-white transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-luxury-black lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col">
                  <h1 className="text-lg font-serif font-bold tracking-tight">
                    CONCIERGE <span className="text-luxury-gold">RIVIERA</span>
                  </h1>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-6">
                  {navLinks.slice(0, 4).map((link, idx) => (
                    <motion.button
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-3xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </div>

                <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800" />

                {/* Mobile Services Accordion */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setMobileAccordion(mobileAccordion === "services" ? null : "services")}
                    className="flex items-center justify-between w-full text-3xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                  >
                    Nos Services
                    <ChevronDown size={24} className={cn("transition-transform duration-300", mobileAccordion === "services" && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileAccordion === "services" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-8 pt-6 pb-2 border-l border-luxury-gold/30 ml-2">
                          {/* Concierge */}
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">Conciergerie</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {conciergeServices.map(s => (
                                <button key={s.name} onClick={() => handleMobileServiceClick(s.name)} className="text-left text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                                    <s.icon size={14} />
                                  </div>
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Property */}
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">Propriété</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {propertyServices.map(s => (
                                <button key={s.name} onClick={() => handleMobileServiceClick(s.name)} className="text-left text-neutral-600 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                                    <s.icon size={14} />
                                  </div>
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-6">
                  {navLinks.slice(4).map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-3xl font-serif text-luxury-black dark:text-white hover:text-luxury-gold transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="p-8 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800">
                {!user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        useStore.getState().setAuthModalView("login");
                        setAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] border border-neutral-200 dark:border-neutral-700"
                    >
                      Connexion
                    </button>
                    <button 
                      onClick={() => {
                        useStore.getState().setAuthModalView("register");
                        setAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-luxury-black text-white dark:bg-white dark:text-black"
                    >
                      S'inscrire
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-luxury-gold p-0.5">
                        <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center">
                          <User size={20} className="text-luxury-gold" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setUser(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

