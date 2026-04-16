import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserIcon, Building2, ArrowRight, ArrowLeft, Mail, Lock, CheckCircle2, Loader2, Eye, EyeOff, MapPin, Wallet, Home } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { UserRole, User, PropertyType } from "@/src/types";
import { Select } from "@/src/components/ui/Select";

const steps = [
  { id: 1, title: "Rôle" },
  { id: 2, title: "Compte" },
  { id: 3, title: "Préférences" },
  { id: 4, title: "Confirmation" }
];

export const RegisterFlow = () => {
  const { setAuthModalView, mockUsers, setMockUsers, setUser, setAuthModalOpen, addNotification } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Client Preferences
  const [clientCity, setClientCity] = useState("");
  const [clientBudget, setClientBudget] = useState("");
  const [clientType, setClientType] = useState("");
  
  // Owner Data
  const [ownerType, setOwnerType] = useState("");
  const [ownerRentalType, setOwnerRentalType] = useState<"short-term" | "long-term" | "sale" | "">("");
  const [ownerCity, setOwnerCity] = useState("");
  const [ownerCount, setOwnerCount] = useState("");

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const canProceedToStep3 = name.length > 2 && isEmailValid && isPasswordStrong && passwordsMatch;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Check if email exists
      if (mockUsers.some(u => u.email === email)) {
        addNotification("Cet e-mail est déjà utilisé.", "error");
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: role as UserRole,
        onboardingCompleted: false,
        clientPreferences: role === "client" ? {
          preferredCities: clientCity ? [clientCity] : [],
          budgetRange: [0, clientBudget === "> 1000€" ? 10000 : 1000],
          propertyTypes: clientType ? [clientType as PropertyType] : [],
          amenities: []
        } : undefined,
        ownerData: role === "owner" ? {
          propertyType: ownerType,
          rentalType: ownerRentalType as any,
          city: ownerCity,
          propertyCount: ownerCount
        } : undefined
      };

      // Save to mock users
      setMockUsers([...mockUsers, newUser]);
      
      // Log user in
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const loggedInUser = { ...newUser, token };
      
      setUser(loggedInUser);
      localStorage.setItem("auth_token", token);
      
      addNotification("Compte créé avec succès ! Bienvenue.", "success");
      setAuthModalOpen(false);
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
              currentStep === step.id 
                ? "bg-luxury-gold text-white" 
                : currentStep > step.id 
                  ? "bg-luxury-black dark:bg-white text-white dark:text-luxury-black" 
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
            <span className="text-[10px] uppercase tracking-wider mt-2 text-neutral-500 font-medium hidden sm:block">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 sm:w-16 h-[2px] mx-2 sm:mx-4 -mt-6 sm:-mt-4 transition-colors duration-300 ${
              currentStep > step.id ? "bg-luxury-black dark:bg-white" : "bg-neutral-100 dark:bg-neutral-800"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-3">Créer un compte</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Rejoignez l'expérience Concierge Riviera.</p>
      </div>

      {renderStepIndicator()}

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* STEP 1: ROLE SELECTION */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-luxury-black dark:text-white">Comment souhaitez-vous utiliser la plateforme ?</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("client")}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                    role === "client" 
                      ? "border-luxury-gold bg-luxury-gold/5" 
                      : "border-neutral-200 dark:border-neutral-800 hover:border-luxury-gold/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    role === "client" ? "bg-luxury-gold text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-luxury-gold"
                  }`}>
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-luxury-black dark:text-white mb-2">Client</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Je cherche à louer ou acheter des propriétés d'exception au Maroc.</p>
                  
                  {role === "client" && (
                    <div className="absolute top-4 right-4 text-luxury-gold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setRole("owner")}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                    role === "owner" 
                      ? "border-luxury-gold bg-luxury-gold/5" 
                      : "border-neutral-200 dark:border-neutral-800 hover:border-luxury-gold/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    role === "owner" ? "bg-luxury-gold text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-luxury-gold"
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-luxury-black dark:text-white mb-2">Propriétaire</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Je souhaite proposer mes biens de prestige à une clientèle exigeante.</p>
                  
                  {role === "owner" && (
                    <div className="absolute top-4 right-4 text-luxury-gold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!role}
                  className="px-8 py-4 bg-luxury-black hover:bg-luxury-gold text-white dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-neutral-900 px-4 text-neutral-500 font-bold tracking-widest">Ou s'inscrire avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" referrerPolicy="no-referrer" />
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4" referrerPolicy="no-referrer" />
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Facebook</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ACCOUNT INFO */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Nom complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none transition-all text-luxury-black dark:text-white"
                    placeholder="Jean Dupont"
                    autoFocus
                  />
                  {name.length > 2 && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Adresse E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-11 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none transition-all text-luxury-black dark:text-white ${
                      email.length > 0 && !isEmailValid ? "border-red-500 focus:ring-red-500" : "border-neutral-200 dark:border-neutral-700"
                    }`}
                    placeholder="vous@exemple.com"
                  />
                  {isEmailValid && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-11 pr-12 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none transition-all text-luxury-black dark:text-white ${
                        password.length > 0 && !isPasswordStrong ? "border-orange-500 focus:ring-orange-500" : "border-neutral-200 dark:border-neutral-700"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${password.length > 0 && !isPasswordStrong ? "text-orange-500" : "text-neutral-500"}`}>
                    Min. 8 caractères, 1 majuscule, 1 chiffre.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Confirmer</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-11 pr-12 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none transition-all text-luxury-black dark:text-white ${
                        confirmPassword.length > 0 && !passwordsMatch ? "border-red-500 focus:ring-red-500" : "border-neutral-200 dark:border-neutral-700"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="text-xs mt-2 text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Correspond
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-4 text-neutral-500 hover:text-luxury-black dark:hover:text-white font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToStep3}
                  className="px-8 py-4 bg-luxury-black hover:bg-luxury-gold text-white dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREFERENCES / OWNER DATA */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-luxury-black dark:text-white">
                  {role === "client" ? "Vos préférences (Optionnel)" : "Vos propriétés (Optionnel)"}
                </h3>
              </div>

              {role === "client" ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Ville préférée</label>
                    <div className="relative z-50">
                      <Select
                        value={clientCity}
                        onChange={setClientCity}
                        icon={<MapPin className="h-5 w-5" />}
                        placeholder="Toutes les villes"
                        options={[
                          { value: "", label: "Toutes les villes" },
                          { value: "Marrakech", label: "Marrakech" },
                          { value: "Casablanca", label: "Casablanca" },
                          { value: "Rabat", label: "Rabat" },
                          { value: "Tanger", label: "Tanger" }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Budget par nuit</label>
                      <div className="relative z-40">
                        <Select
                          value={clientBudget}
                          onChange={setClientBudget}
                          icon={<Wallet className="h-5 w-5" />}
                          placeholder="Non défini"
                          options={[
                            { value: "", label: "Non défini" },
                            { value: "< 200€", label: "Moins de 200€" },
                            { value: "200€ - 500€", label: "200€ - 500€" },
                            { value: "500€ - 1000€", label: "500€ - 1000€" },
                            { value: "> 1000€", label: "Plus de 1000€" }
                          ]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Type de bien</label>
                      <div className="relative z-40">
                        <Select
                          value={clientType}
                          onChange={setClientType}
                          icon={<Home className="h-5 w-5" />}
                          placeholder="Tous les types"
                          options={[
                            { value: "", label: "Tous les types" },
                            { value: "Villa", label: "Villa" },
                            { value: "Appartement", label: "Appartement" },
                            { value: "Riad", label: "Riad" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Type de propriétés</label>
                    <div className="relative z-50">
                      <Select
                        value={ownerType}
                        onChange={setOwnerType}
                        icon={<Home className="h-5 w-5" />}
                        placeholder="Sélectionner"
                        options={[
                          { value: "", label: "Sélectionner" },
                          { value: "Villas", label: "Villas" },
                          { value: "Appartements", label: "Appartements" },
                          { value: "Riads", label: "Riads" },
                          { value: "Mixte", label: "Mixte" }
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Type de location</label>
                    <div className="relative z-40">
                      <Select
                        value={ownerRentalType}
                        onChange={setOwnerRentalType}
                        icon={<Building2 className="h-5 w-5" />}
                        placeholder="Sélectionner"
                        options={[
                          { value: "", label: "Sélectionner" },
                          { value: "short-term", label: "Courte durée" },
                          { value: "long-term", label: "Longue durée" },
                          { value: "sale", label: "Vente" }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Ville principale</label>
                      <div className="relative z-30">
                        <Select
                          value={ownerCity}
                          onChange={setOwnerCity}
                          icon={<MapPin className="h-5 w-5" />}
                          placeholder="Sélectionner"
                          options={[
                            { value: "", label: "Sélectionner" },
                            { value: "Marrakech", label: "Marrakech" },
                            { value: "Casablanca", label: "Casablanca" },
                            { value: "Rabat", label: "Rabat" },
                            { value: "Tanger", label: "Tanger" }
                          ]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Nombre de biens</label>
                      <div className="relative z-30">
                        <Select
                          value={ownerCount}
                          onChange={setOwnerCount}
                          icon={<Building2 className="h-5 w-5" />}
                          placeholder="Sélectionner"
                          options={[
                            { value: "", label: "Sélectionner" },
                            { value: "1", label: "1 bien" },
                            { value: "2-5", label: "2 à 5 biens" },
                            { value: "5+", label: "Plus de 5 biens" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-8 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-4 text-neutral-500 hover:text-luxury-black dark:hover:text-white font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-4 bg-luxury-black hover:bg-luxury-gold text-white dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-luxury-black dark:text-white">Vérification</h3>
                <p className="text-sm text-neutral-500">Veuillez confirmer vos informations.</p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-6 space-y-4 border border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <span className="text-sm text-neutral-500">Rôle</span>
                  <span className="font-bold text-luxury-black dark:text-white capitalize">{role === "owner" ? "Propriétaire" : "Client"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <span className="text-sm text-neutral-500">Nom</span>
                  <span className="font-bold text-luxury-black dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <span className="text-sm text-neutral-500">E-mail</span>
                  <span className="font-bold text-luxury-black dark:text-white">{email}</span>
                </div>
                
                {role === "client" && (clientCity || clientBudget || clientType) && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-2 block">Préférences</span>
                    <div className="text-sm text-luxury-black dark:text-white">
                      {clientCity && <span className="mr-3">📍 {clientCity}</span>}
                      {clientBudget && <span className="mr-3">💰 {clientBudget}</span>}
                      {clientType && <span>🏠 {clientType}</span>}
                    </div>
                  </div>
                )}

                {role === "owner" && (ownerCity || ownerCount || ownerType || ownerRentalType) && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-2 block">Détails Propriétaire</span>
                    <div className="text-sm text-luxury-black dark:text-white">
                      {ownerCity && <span className="mr-3">📍 {ownerCity}</span>}
                      {ownerType && <span className="mr-3">🏠 {ownerType}</span>}
                      {ownerRentalType && <span className="mr-3">🔑 {ownerRentalType === "short-term" ? "Courte durée" : ownerRentalType === "long-term" ? "Longue durée" : "Vente"}</span>}
                      {ownerCount && <span>🏢 {ownerCount} biens</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8 pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isLoading}
                  className="px-6 py-4 text-neutral-500 hover:text-luxury-black dark:hover:text-white font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-luxury-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Créer mon compte <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentStep === 1 && (
        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Vous avez déjà un compte ?{" "}
            <button
              onClick={() => setAuthModalView("login")}
              className="font-bold text-luxury-black dark:text-white hover:text-luxury-gold dark:hover:text-luxury-gold transition-colors"
            >
              Se connecter
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
