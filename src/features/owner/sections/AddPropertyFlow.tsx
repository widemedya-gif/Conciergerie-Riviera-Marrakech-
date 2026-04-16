import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  X, 
  MapPin, 
  Home, 
  DollarSign, 
  Info,
  Image as ImageIcon,
  Layout,
  Star,
  Loader2
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";
import { OwnerListing } from "@/src/types";

const steps = [
  { id: 1, title: "Infos de base", icon: Info },
  { id: 2, title: "Localisation", icon: MapPin },
  { id: 3, title: "Tarification", icon: DollarSign },
  { id: 4, title: "Détails", icon: Home },
  { id: 5, title: "Médias", icon: ImageIcon },
  { id: 6, title: "Révision", icon: CheckCircle2 },
];

export const AddPropertyFlow = () => {
  const { setActiveOwnerTab, addNotification, ownerListings, setOwnerListings, user } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Villa",
    status: "Rent",
    rentalType: "short-term",
    city: "",
    area: "",
    address: "",
    price: "",
    priceType: "par nuit",
    isNegotiable: false,
    bedrooms: "1",
    bathrooms: "1",
    surface: "",
    floor: "",
    amenities: [] as string[],
    features: [] as string[],
    images: [] as string[],
    coverImage: "",
    petFriendly: false
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePublish = (status: "active" | "draft" = "active") => {
    setIsLoading(true);
    setTimeout(() => {
      const newListing: OwnerListing = {
        id: `p-${Date.now()}`,
        ownerId: user?.id || "unknown",
        title: formData.title || "Nouvelle Propriété",
        price: Number(formData.price) || 0,
        city: formData.city || "Marrakech",
        region: "Marrakech-Safi",
        location: formData.city || "Marrakech",
        type: formData.type as any,
        rentalType: formData.status === "Rent" ? formData.rentalType as any : "sale",
        images: formData.images.length > 0 ? formData.images : ["https://picsum.photos/seed/placeholder/800/600?blur=2"],
        status: status,
        viewsCount: 0,
        favoritesCount: 0,
        createdAt: new Date().toISOString(),
        description: formData.description,
        amenities: formData.amenities,
        features: formData.features,
        rating: 5,
        reviews: [],
        isSuperhost: false,
        budgetCategory: "Premium",
        category: "luxury",
        travelIntents: ["Luxury"],
        unavailableDates: [],
        capacity: Number(formData.bedrooms) * 2 || 2,
        size: Number(formData.surface) || 0,
        condition: "Neuf",
        view: "Ville",
        floor: formData.floor as any,
        petFriendly: formData.petFriendly,
      };

      useStore.getState().addProperty(newListing);
      setIsLoading(false);
      addNotification(
        status === "active" 
          ? "Votre bien a été publié avec succès !" 
          : "Annonce enregistrée en tant que brouillon", 
        "success"
      );
      setActiveOwnerTab("listings");
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4 custom-scrollbar">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center shrink-0">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              currentStep === step.id 
                ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20 scale-110" 
                : currentStep > step.id 
                  ? "bg-luxury-black dark:bg-white text-white dark:text-luxury-black" 
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
            )}>
              {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold mt-3",
              currentStep === step.id ? "text-luxury-gold" : "text-neutral-400"
            )}>
              {step.title}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              "h-[2px] flex-1 min-w-[30px] mx-4 -mt-8",
              currentStep > step.id ? "bg-luxury-black dark:bg-white" : "bg-neutral-100 dark:bg-neutral-800"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Ajouter un nouveau bien</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Étape {currentStep} sur {steps.length}: {steps[currentStep-1].title}</p>
        </div>
        <button 
          onClick={() => setActiveOwnerTab("listings")}
          className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"
        >
          <X size={24} />
        </button>
      </div>

      {renderStepIndicator()}

      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-black/5 p-8 sm:p-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Titre de l'annonce</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="Ex: Villa de Luxe avec Vue Mer"
                    className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={6}
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Décrivez votre bien en détail..."
                    className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Type de bien</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => updateFormData("type", e.target.value)}
                      className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all appearance-none"
                    >
                      <option>Villa</option>
                      <option>Appartement</option>
                      <option>Riad</option>
                      <option>Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Transaction</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex p-1 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                        <button 
                          onClick={() => updateFormData("status", "Rent")}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                            formData.status === "Rent" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-neutral-400"
                          )}
                        >
                          Location
                        </button>
                        <button 
                          onClick={() => updateFormData("status", "Sale")}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                            formData.status === "Sale" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-neutral-400"
                          )}
                        >
                          Vente
                        </button>
                      </div>
                      
                      {formData.status === "Rent" && (
                        <div className="flex p-1 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                          <button 
                            onClick={() => updateFormData("rentalType", "short-term")}
                            className={cn(
                              "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                              formData.rentalType === "short-term" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-neutral-400"
                            )}
                          >
                            Courte Durée
                          </button>
                          <button 
                            onClick={() => updateFormData("rentalType", "long-term")}
                            className={cn(
                              "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                              formData.rentalType === "long-term" ? "bg-white dark:bg-neutral-700 shadow-sm text-luxury-gold" : "text-neutral-400"
                            )}
                          >
                            Longue Durée
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Ville</label>
                    <select 
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all appearance-none"
                    >
                      <option value="">Sélectionner une ville</option>
                      <option>Marrakech</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Tanger</option>
                      <option>Agadir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Quartier</label>
                    <input 
                      type="text" 
                      value={formData.area}
                      onChange={(e) => updateFormData("area", e.target.value)}
                      placeholder="Ex: Hivernage, Gauthier..."
                      className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Adresse complète</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Numéro, rue..."
                    className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all"
                  />
                </div>
                <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 relative overflow-hidden">
                  <div className="text-center z-10">
                    <MapPin className="w-10 h-10 text-luxury-gold mx-auto mb-3" />
                    <p className="text-sm font-bold text-neutral-500">Simulation de carte interactive</p>
                    <p className="text-xs text-neutral-400 mt-1">Cliquez pour placer le marqueur</p>
                  </div>
                  <img src="https://picsum.photos/seed/map/800/400?blur=5" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Map" />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PRICING */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Prix</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="text-luxury-gold font-bold">€</span>
                      </div>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => updateFormData("price", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-widest">Unité de prix</label>
                    <select 
                      value={formData.priceType}
                      onChange={(e) => updateFormData("priceType", e.target.value)}
                      className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all appearance-none"
                    >
                      <option>par nuit</option>
                      <option>par mois</option>
                      <option>prix total</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-luxury-black dark:text-white">Prix négociable</p>
                    <p className="text-xs text-neutral-500">Autoriser les clients à proposer un prix différent.</p>
                  </div>
                  <button 
                    onClick={() => updateFormData("isNegotiable", !formData.isNegotiable)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.isNegotiable ? "bg-luxury-gold" : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.isNegotiable ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DETAILS */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-widest">Chambres</label>
                  <select 
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData("bedrooms", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-widest">Salles de bain</label>
                  <select 
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData("bathrooms", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  >
                    {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-widest">Surface (m²)</label>
                  <input 
                    type="number" 
                    value={formData.surface}
                    onChange={(e) => updateFormData("surface", e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-widest">Étage</label>
                  <input 
                    type="text" 
                    value={formData.floor}
                    onChange={(e) => updateFormData("floor", e.target.value)}
                    placeholder="RDC, 1er..."
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-4 uppercase tracking-widest">Équipements Premium</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    "Piscine privée", "Piscine chauffée", "Climatisation centrale", "Wi-Fi haut débit", 
                    "Cuisine équipée", "Salle de sport", "Spa / Jacuzzi", "Hammam", "Parking privé", 
                    "Sécurité 24/7", "Jardin paysager", "Terrasse", "Barbecue", "Cheminée", 
                    "Ascenseur", "Accès PMR", "Borne de recharge VE"
                  ].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium",
                        formData.amenities.includes(amenity)
                          ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold"
                          : "bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-luxury-gold/50"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                        formData.amenities.includes(amenity) ? "bg-luxury-gold border-luxury-gold" : "border-neutral-300"
                      )}>
                        {formData.amenities.includes(amenity) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className="text-left">{amenity}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-4 uppercase tracking-widest mt-8">Caractéristiques & Atouts</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    "Vue sur mer", "Vue sur montagne", "Vue sur ville", "Front de mer", 
                    "Accès direct plage", "Sans vis-à-vis", "Maison connectée", "Éco-responsable", 
                    "Architecture traditionnelle", "Design moderne", "Événements autorisés"
                  ].map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium",
                        formData.features.includes(feature)
                          ? "bg-luxury-gold/10 border-luxury-gold text-luxury-gold"
                          : "bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 hover:border-luxury-gold/50"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                        formData.features.includes(feature) ? "bg-luxury-gold border-luxury-gold" : "border-neutral-300"
                      )}>
                        {formData.features.includes(feature) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className="text-left">{feature}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 flex items-center justify-between mt-8">
                  <div>
                    <p className="font-bold text-luxury-black dark:text-white">Animaux acceptés</p>
                    <p className="text-xs text-neutral-500">Autoriser les clients à venir avec leurs animaux de compagnie.</p>
                  </div>
                  <button 
                    onClick={() => updateFormData("petFriendly", !formData.petFriendly)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.petFriendly ? "bg-luxury-gold" : "bg-neutral-300 dark:bg-neutral-600"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.petFriendly ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
            </motion.div>
          )}

          {/* STEP 5: MEDIA */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-[2rem] p-12 text-center hover:border-luxury-gold transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h4 className="text-lg font-bold text-luxury-black dark:text-white mb-2">Glissez vos photos ici</h4>
                <p className="text-sm text-neutral-500">ou cliquez pour parcourir vos fichiers</p>
                <p className="text-[10px] text-neutral-400 mt-4 uppercase tracking-widest">PNG, JPG jusqu'à 10MB</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-2xl relative overflow-hidden group">
                    <img src={`https://picsum.photos/seed/prop${i}/400/300`} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white text-luxury-black rounded-lg hover:bg-luxury-gold hover:text-white transition-colors">
                        <Star size={16} />
                      </button>
                      <button className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: REVIEW */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl p-8 space-y-6 border border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-luxury-black dark:text-white">{formData.title || "Titre non défini"}</h3>
                    <p className="text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {formData.city}, {formData.area}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-luxury-gold">{formData.price || "0"}€</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{formData.priceType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-200 dark:border-neutral-700">
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Type</p>
                    <p className="font-bold text-sm">{formData.type}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Chambres</p>
                    <p className="font-bold text-sm">{formData.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Surface</p>
                    <p className="font-bold text-sm">{formData.surface} m²</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Description</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {formData.description || "Aucune description fournie."}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Équipements & Caractéristiques</p>
                  <div className="flex flex-wrap gap-2">
                    {[...formData.amenities, ...formData.features].map(a => (
                      <span key={a} className="px-3 py-1 bg-white dark:bg-neutral-700 rounded-full text-[10px] font-bold text-neutral-500 border border-neutral-100 dark:border-neutral-600">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-luxury-gold/5 rounded-2xl border border-luxury-gold/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0">
                  <Layout size={20} />
                </div>
                <div>
                  <p className="font-bold text-luxury-gold text-sm">Prêt pour la publication</p>
                  <p className="text-xs text-luxury-gold/70 mt-1">Votre annonce sera visible par des milliers de clients potentiels dès sa validation.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1 || isLoading}
            className={cn(
              "px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2",
              currentStep === 1 ? "opacity-0 pointer-events-none" : "text-neutral-500 hover:text-luxury-black dark:hover:text-white"
            )}
          >
            <ArrowLeft size={16} /> Précédent
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-10 py-4 bg-luxury-black dark:bg-white text-white dark:text-luxury-black hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-black/10"
            >
              Suivant <ArrowRight size={16} />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handlePublish("draft")}
                disabled={isLoading}
                className="px-8 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-70"
              >
                Brouillon
              </button>
              <button
                onClick={() => handlePublish("active")}
                disabled={isLoading}
                className="px-10 py-4 bg-luxury-gold text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-luxury-gold/20 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Publier l'annonce <CheckCircle2 size={18} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
