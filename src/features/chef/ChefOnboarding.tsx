import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChefHat, MapPin, Camera, Plus, Trash2, Check, Upload, ShieldCheck, Lock, FileText, AlertCircle } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { Chef, ChefMenu } from "@/src/types";

export function ChefOnboarding() {
  const { isChefOnboardingOpen, setChefOnboardingOpen, user, setUser, addChef, addNotification, setAuthModalOpen } = useStore();
  const [step, setStep] = useState(1);
  
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [gallery, setGallery] = useState<string[]>([]);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [signatureDishes, setSignatureDishes] = useState<string[]>([]);
  const [newDish, setNewDish] = useState("");
  const [startingPrice, setStartingPrice] = useState(500);
  const [menus, setMenus] = useState<ChefMenu[]>([]);
  
  // Verification State
  const [idDocument, setIdDocument] = useState<string | null>(null);
  const [culinaryCertificate, setCulinaryCertificate] = useState<string | null>(null);
  const [hygieneCertificate, setHygieneCertificate] = useState<string | null>(null);
  const [referenceName, setReferenceName] = useState("");
  const [referenceContact, setReferenceContact] = useState("");
  const [consentBackgroundCheck, setConsentBackgroundCheck] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  
  // New Menu State
  const [menuTitle, setMenuTitle] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuPrice, setMenuPrice] = useState(0);

  if (!isChefOnboardingOpen) return null;

  const handleAddMenu = () => {
    if (menuTitle && menuDesc && menuPrice > 0) {
      setMenus([...menus, {
        id: Math.random().toString(36).substring(7),
        title: menuTitle,
        description: menuDesc,
        pricePerPerson: menuPrice,
        tags: []
      }]);
      setMenuTitle("");
      setMenuDesc("");
      setMenuPrice(0);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const newChef: Chef = {
      id: `chef-${Math.random().toString(36).substring(7)}`,
      userId: user.id,
      name,
      avatar: avatar || "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      specialties,
      experienceYears,
      rating: 0, // Initial rating
      reviewCount: 0,
      startingPrice,
      city,
      isPremium: false,
      bio,
      philosophy,
      signatureDishes,
      gallery,
      menus
    };

    addChef(newChef);
    setUser({ ...user, role: "chef" });
    setChefOnboardingOpen(false);
    addNotification("Votre dossier est en cours d'examen par notre équipe de sécurité.", "info");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setChefOnboardingOpen(false)} />
        
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-luxury-black dark:text-white">Devenir Chef Privé</h2>
                <p className="text-xs text-neutral-500">Étape {step} sur 5</p>
              </div>
            </div>
            <button onClick={() => setChefOnboardingOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-8">
              <div 
                className="h-full bg-luxury-gold rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-luxury-black dark:text-white mb-6">Informations de base</h3>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden mb-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-neutral-400" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setAvatar(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">Photo de profil</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Nom complet</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="+212 6XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Ville principale</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="Ex: Marrakech"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Années d'expérience</label>
                    <input 
                      type="number" 
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Instagram (Optionnel)</label>
                    <input 
                      type="text" 
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="@votre_compte"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">LinkedIn (Optionnel)</label>
                    <input 
                      type="text" 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="URL de votre profil"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Prix de départ (MAD)</label>
                  <input 
                    type="number" 
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(parseInt(e.target.value))}
                    className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                    min="0"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-luxury-black dark:text-white mb-6">Votre profil culinaire</h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Biographie</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                    rows={4}
                    placeholder="Parlez-nous de votre parcours..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Philosophie culinaire</label>
                  <textarea 
                    value={philosophy}
                    onChange={(e) => setPhilosophy(e.target.value)}
                    className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                    rows={2}
                    placeholder="Votre vision de la cuisine en une phrase..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Spécialités</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newSpecialty) {
                          setSpecialties([...specialties, newSpecialty]);
                          setNewSpecialty("");
                        }
                      }}
                      className="flex-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="Ex: Cuisine Marocaine"
                    />
                    <button 
                      onClick={() => {
                        if (newSpecialty) {
                          setSpecialties([...specialties, newSpecialty]);
                          setNewSpecialty("");
                        }
                      }}
                      className="p-3 bg-luxury-gold text-white rounded-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm flex items-center gap-2">
                        {s}
                        <button onClick={() => setSpecialties(specialties.filter((_, idx) => idx !== i))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Photos de vos plats (Galerie)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="relative aspect-square rounded-xl bg-neutral-50 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400 hover:text-luxury-gold hover:border-luxury-gold transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Ajouter</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => setGallery(prev => [...prev, reader.result as string]);
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-luxury-black dark:text-white mb-6">Vos Menus</h3>
                
                <div className="space-y-4 mb-8">
                  {menus.map((m, i) => (
                    <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{m.title}</h4>
                        <p className="text-sm text-neutral-500">{m.pricePerPerson} MAD / pers</p>
                      </div>
                      <button onClick={() => setMenus(menus.filter((_, idx) => idx !== i))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-4">
                  <h4 className="font-bold">Ajouter un menu</h4>
                  <input 
                    type="text" 
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold"
                    placeholder="Titre du menu"
                  />
                  <textarea 
                    value={menuDesc}
                    onChange={(e) => setMenuDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold resize-none"
                    rows={2}
                    placeholder="Description..."
                  />
                  <input 
                    type="number" 
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border-none focus:ring-2 focus:ring-luxury-gold"
                    placeholder="Prix par personne (MAD)"
                  />
                  <button 
                    onClick={handleAddMenu}
                    className="w-full py-3 bg-luxury-black text-white dark:bg-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-xs"
                  >
                    Ajouter ce menu
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-luxury-black dark:text-white">Vérification & Sécurité</h3>
                    <p className="text-sm text-neutral-500">Riviera maintient des standards stricts pour la sécurité de nos clients.</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3 mb-8">
                  <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    Toutes les informations et documents fournis sont chiffrés de bout en bout (AES-256). Ils ne seront utilisés que par notre équipe de conformité pour vérifier votre identité et vos qualifications.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-luxury-black dark:text-white">Documents Obligatoires</h4>
                  
                  {/* ID Upload */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">Pièce d'identité officielle</p>
                        <p className="text-xs text-neutral-500">Passeport ou CNI (Recto/Verso)</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${idDocument ? 'bg-green-100 text-green-600' : 'bg-luxury-black text-white dark:bg-white dark:text-black'}`}>
                        {idDocument ? 'Téléchargé' : 'Uploader'}
                      </button>
                      <input 
                        type="file" 
                        onChange={(e) => setIdDocument(e.target.files?.[0]?.name || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Culinary Certificate */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">Diplôme / Certificat Culinaire</p>
                        <p className="text-xs text-neutral-500">Preuve de formation professionnelle</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${culinaryCertificate ? 'bg-green-100 text-green-600' : 'bg-luxury-black text-white dark:bg-white dark:text-black'}`}>
                        {culinaryCertificate ? 'Téléchargé' : 'Uploader'}
                      </button>
                      <input 
                        type="file" 
                        onChange={(e) => setCulinaryCertificate(e.target.files?.[0]?.name || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Hygiene Certificate */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">Certificat d'Hygiène (HACCP)</p>
                        <p className="text-xs text-neutral-500">Ou équivalent local valide</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${hygieneCertificate ? 'bg-green-100 text-green-600' : 'bg-luxury-black text-white dark:bg-white dark:text-black'}`}>
                        {hygieneCertificate ? 'Téléchargé' : 'Uploader'}
                      </button>
                      <input 
                        type="file" 
                        onChange={(e) => setHygieneCertificate(e.target.files?.[0]?.name || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-luxury-black dark:text-white">Référence Professionnelle</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={referenceName}
                      onChange={(e) => setReferenceName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="Nom de l'établissement ou du chef"
                    />
                    <input 
                      type="text" 
                      value={referenceContact}
                      onChange={(e) => setReferenceContact(e.target.value)}
                      className="w-full p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder="Email ou Téléphone"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentBackgroundCheck ? 'bg-luxury-gold border-luxury-gold' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-luxury-gold'}`}>
                      {consentBackgroundCheck && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={consentBackgroundCheck} onChange={(e) => setConsentBackgroundCheck(e.target.checked)} />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      J'autorise Riviera à effectuer une vérification de mes antécédents professionnels et judiciaires dans le cadre de ma candidature.
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentTerms ? 'bg-luxury-gold border-luxury-gold' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-luxury-gold'}`}>
                      {consentTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Je certifie que toutes les informations fournies sont exactes et j'accepte les Conditions Générales de Service pour les Chefs Privés.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-luxury-black dark:text-white mb-4">Dossier en cours d'examen</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-6">
                  Merci pour votre candidature. Notre équipe de conformité va procéder à la vérification manuelle de vos documents et références.
                </p>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-2xl max-w-sm mx-auto text-left space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">Documents reçus et chiffrés</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-luxury-gold border-t-transparent animate-spin" />
                    <span className="text-luxury-black dark:text-white font-medium">Vérification des antécédents (24-48h)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600" />
                    <span className="text-neutral-400">Entretien téléphonique</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600" />
                    <span className="text-neutral-400">Validation finale</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex gap-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Retour
              </button>
            )}
            <button 
              onClick={() => {
                if (step === 4 && (!idDocument || !culinaryCertificate || !consentBackgroundCheck || !consentTerms)) {
                  addNotification("Veuillez fournir les documents obligatoires et accepter les conditions.", "error");
                  return;
                }
                if (step < 5) setStep(step + 1);
                else handleSubmit();
              }}
              className="flex-1 py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-luxury-gold/90 transition-colors"
            >
              {step === 5 ? "Terminer" : "Continuer"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
