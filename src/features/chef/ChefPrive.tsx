import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Star, MapPin, ChefHat, Users, Calendar, Clock, ChevronRight, X } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Chef } from "@/src/types";

// Mock data for initial chefs if empty
const MOCK_CHEFS: Chef[] = [
  {
    id: "chef-1",
    userId: "user-1",
    name: "Youssef Alaoui",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    specialties: ["Gastronomie Marocaine", "Fusion Française"],
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 124,
    startingPrice: 1500,
    city: "Marrakech",
    isPremium: true,
    bio: "Ancien chef étoilé, je revisite les classiques marocains avec des techniques modernes.",
    philosophy: "Le respect du produit local avant tout.",
    signatureDishes: ["Pastilla au homard", "Tajine de canard confit"],
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
    ],
    menus: [
      {
        id: "menu-1",
        title: "Dégustation Royale",
        description: "Un voyage en 7 services à travers les saveurs du Maroc.",
        pricePerPerson: 1200,
        tags: ["Premium", "Dégustation"]
      }
    ]
  },
  {
    id: "chef-2",
    userId: "user-2",
    name: "Sofia Benjelloun",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    specialties: ["Cuisine Méditerranéenne", "Végétarien"],
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 89,
    startingPrice: 800,
    city: "Casablanca",
    isPremium: false,
    bio: "Passionnée par la cuisine saine et ensoleillée de la Méditerranée.",
    philosophy: "Manger sain ne veut pas dire manger triste.",
    signatureDishes: ["Risotto au safran de Taliouine", "Ceviche de daurade"],
    gallery: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80"
    ],
    menus: [
      {
        id: "menu-2",
        title: "Fraîcheur Estivale",
        description: "Menu léger en 4 services, parfait pour les soirées d'été.",
        pricePerPerson: 600,
        tags: ["Végétarien", "Léger"]
      }
    ]
  },
  {
    id: "chef-3",
    userId: "user-3",
    name: "Karim Tazi",
    avatar: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    specialties: ["Cuisine Asiatique", "Sushi Master"],
    experienceYears: 15,
    rating: 5.0,
    reviewCount: 210,
    startingPrice: 2000,
    city: "Rabat",
    isPremium: true,
    bio: "Formé au Japon pendant 10 ans, je propose une expérience Omakase authentique.",
    philosophy: "La perfection dans la simplicité et la précision du geste.",
    signatureDishes: ["Omakase 12 services", "Wagyu A5 au binchotan"],
    gallery: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80"
    ],
    menus: [
      {
        id: "menu-3",
        title: "Expérience Omakase",
        description: "Laissez le chef choisir les meilleurs produits du jour pour vous.",
        pricePerPerson: 2500,
        tags: ["Premium", "Japonais", "Exclusif"]
      }
    ]
  },
  {
    id: "chef-4",
    userId: "user-4",
    name: "Leila Chraibi",
    avatar: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&w=800&q=80",
    specialties: ["Pâtisserie Fine", "Brunch"],
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 56,
    startingPrice: 400,
    city: "Marrakech",
    isPremium: false,
    bio: "Spécialisée dans la création de brunchs luxueux et de pâtisseries sur mesure.",
    philosophy: "Le visuel doit être aussi exceptionnel que le goût.",
    signatureDishes: ["Pavlova aux fruits exotiques", "Brunch Royal"],
    gallery: [
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80"
    ],
    menus: [
      {
        id: "menu-4",
        title: "Brunch d'Exception",
        description: "Assortiment de viennoiseries, plats salés raffinés et desserts.",
        pricePerPerson: 450,
        tags: ["Brunch", "Sucré/Salé"]
      }
    ]
  }
];

export function ChefPrive() {
  const { chefs, setChefs, setSelectedChefId, setChefOnboardingOpen, userBehaviorTracking, trackClick } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tous");
  const [selectedStyle, setSelectedStyle] = useState("Tous");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const culinaryStyles = ["Tous", "Gastronomique", "Méditerranéen", "Asiatique", "Fusion", "Marocain", "Italien", "Végétarien"];

  // Initialize mock chefs if empty
  React.useEffect(() => {
    if (chefs.length === 0) {
      setChefs(MOCK_CHEFS);
    }
  }, [chefs.length, setChefs]);

  const filteredChefs = useMemo(() => {
    let result = chefs.filter(chef => {
      const matchesSearch = chef.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            chef.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCity = selectedCity === "Tous" || chef.city === selectedCity;
      const matchesStyle = selectedStyle === "Tous" || chef.specialties.some(s => s.toLowerCase().includes(selectedStyle.toLowerCase()));
      const matchesPrice = chef.startingPrice >= priceRange[0] && chef.startingPrice <= priceRange[1];
      
      return matchesSearch && matchesCity && matchesStyle && matchesPrice;
    });

    // Personalization: Boost chefs in cities the user has searched for or viewed
    if (userBehaviorTracking?.searches?.length > 0 || userBehaviorTracking?.favoriteLocations?.length > 0) {
      const preferredCities = new Set([
        ...(userBehaviorTracking?.searches || []),
        ...(userBehaviorTracking?.favoriteLocations || [])
      ]);

      result = result.sort((a, b) => {
        const aPreferred = preferredCities.has(a.city) ? 1 : 0;
        const bPreferred = preferredCities.has(b.city) ? 1 : 0;
        
        // Sort by preference first, then by rating
        if (aPreferred !== bPreferred) {
          return bPreferred - aPreferred;
        }
        return b.rating - a.rating;
      });
    } else {
      // Default sort by rating
      result = result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [chefs, searchQuery, selectedCity, selectedStyle, priceRange, userBehaviorTracking]);

  const cities = ["Tous", ...Array.from(new Set(chefs.map(c => c.city)))];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-luxury-black pt-24 pb-20">
      {/* Bento Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]"
        >
          {/* Main Hero */}
          <div className="md:col-span-2 md:row-span-3 bg-luxury-black dark:bg-neutral-900 rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-luxury-gold/20 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-gold/20 text-luxury-gold text-xs font-bold tracking-widest uppercase mb-8">
                <Star className="w-3 h-3 fill-current" /> Riviera Exclusive
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
                L'art de la table, <br/><span className="text-luxury-gold italic">chez vous.</span>
              </h1>
              <p className="text-white/70 font-light mb-8 max-w-md text-lg">
                Transformez votre résidence en restaurant étoilé. Nos chefs privés créent des menus sur mesure pour vos moments d'exception.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  document.getElementById('chefs-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Explorer les chefs
              </button>
              <button 
                onClick={() => setChefOnboardingOpen(true)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all"
              >
                Devenir Chef
              </button>
            </div>
          </div>

          {/* Image 1 - Tall */}
          <div className="md:col-span-1 md:row-span-2 rounded-3xl overflow-hidden relative group hidden md:block">
            <ImagePlaceholder 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
              alt="Chef preparing"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-serif text-xl">Savoir-faire</p>
            </div>
          </div>

          {/* Stats Block */}
          <div className="md:col-span-1 md:row-span-1 bg-luxury-gold rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <ChefHat className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-4xl font-serif text-white mb-2">50+</h3>
            <p className="text-white/90 font-medium text-xs uppercase tracking-wider leading-snug">Chefs Étoilés &<br/>Indépendants</p>
          </div>

          {/* Image 2 - Small */}
          <div className="md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden relative group hidden md:block">
            <ImagePlaceholder 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Fine dining dish"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>

          {/* Bottom Wide Block */}
          <div className="md:col-span-2 md:row-span-1 bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 flex items-center justify-between border border-neutral-100 dark:border-neutral-700 group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                <Star className="w-8 h-8 text-luxury-gold" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-1">Service Premium 5 Étoiles</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Courses, préparation, service et nettoyage inclus.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text"
                placeholder="Rechercher par nom, spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold text-luxury-black dark:text-white"
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 md:w-48 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold text-luxury-black dark:text-white appearance-none"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl flex items-center gap-2 text-luxury-black dark:text-white transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>
          </div>

          {/* Culinary Styles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {culinaryStyles.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedStyle === style 
                    ? 'bg-luxury-black text-white dark:bg-white dark:text-black shadow-md' 
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <h3 className="font-serif text-xl mb-4 text-luxury-black dark:text-white">Prix de départ (MAD)</h3>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-luxury-gold"
                  />
                  <span className="text-luxury-black dark:text-white font-medium min-w-[80px]">
                    {priceRange[1]} MAD
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-luxury-gold text-sm font-bold tracking-widest uppercase mb-2 block">L'Expérience</span>
          <h2 className="text-3xl md:text-4xl font-serif text-luxury-black dark:text-white">Comment ça marche ?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent -translate-y-1/2 z-0" />
          
          {[
            {
              step: "01",
              title: "Choisissez votre Chef",
              desc: "Parcourez notre sélection de chefs étoilés et indépendants selon vos envies culinaires."
            },
            {
              step: "02",
              title: "Personnalisez le Menu",
              desc: "Échangez avec le chef pour créer un menu sur mesure adapté à vos goûts et restrictions."
            },
            {
              step: "03",
              title: "Profitez de l'Instant",
              desc: "Le chef s'occupe des courses, de la préparation, du service et laisse votre cuisine impeccable."
            }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center justify-center mb-6 group-hover:border-luxury-gold transition-colors">
                <span className="font-serif text-xl text-luxury-gold">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-3">{item.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-[250px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chefs Grid */}
      <section id="chefs-grid" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif text-luxury-black dark:text-white">
            Chefs Disponibles
          </h2>
          <span className="text-neutral-500 dark:text-neutral-400">
            {filteredChefs.length} résultat{filteredChefs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredChefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedChefId(chef.id);
                  if (trackClick) trackClick(chef.id);
                }}
                className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-neutral-100 dark:border-neutral-800 flex flex-col h-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative h-72 overflow-hidden">
                  <ImagePlaceholder 
                    src={chef.gallery[0] || chef.avatar}
                    alt={chef.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {chef.isPremium && (
                      <div className="bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" /> Premium
                      </div>
                    )}
                    {chef.reviewCount === 0 && (
                      <div className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                        Nouveau
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={chef.avatar} 
                          alt={chef.name} 
                          className="w-14 h-14 rounded-full border-2 border-luxury-gold object-cover shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-white font-serif text-2xl drop-shadow-md">{chef.name}</h3>
                        <div className="flex items-center gap-1.5 text-luxury-gold text-sm mt-0.5">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold">{chef.rating > 0 ? chef.rating.toFixed(1) : "Nouveau"}</span>
                          {chef.reviewCount > 0 && (
                            <span className="text-white/70 text-xs">({chef.reviewCount} avis)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {chef.specialties.slice(0, 3).map(specialty => (
                      <span key={specialty} className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded-full border border-neutral-100 dark:border-neutral-700">
                        {specialty}
                      </span>
                    ))}
                    {chef.specialties.length > 3 && (
                      <span className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 text-xs font-medium rounded-full border border-neutral-100 dark:border-neutral-700">
                        +{chef.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <span className="font-medium">{chef.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <ChefHat className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <span className="font-medium">{chef.experienceYears} ans d'expérience</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-0.5">À partir de</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-luxury-black dark:text-white">{chef.startingPrice}</span>
                        <span className="text-sm font-medium text-neutral-500">MAD</span>
                      </div>
                    </div>
                    <div className="px-5 py-2.5 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-full text-sm font-bold transition-transform group-hover:scale-105 shadow-md">
                      Voir le profil
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800">
            <ChefHat className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-luxury-black dark:text-white mb-2">Aucun chef trouvé</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">Essayez de modifier vos filtres de recherche.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("Tous");
                setPriceRange([0, 5000]);
              }}
              className="px-6 py-3 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-full font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
