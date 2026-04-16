import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useStore } from "@/src/store/useStore";

export const LoginForm = () => {
  const { setAuthModalView, mockUsers, setUser, setAuthModalOpen, addNotification } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Check against mockUsers
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        setError("Aucun compte trouvé avec cet e-mail.");
        return;
      }

      // In a real app, we'd check the password hash. Here we just simulate success if user exists.
      // For simulation, let's assume any password works for existing mock users, or we could store passwords in mockUsers.
      // Since we don't store passwords in the mock user object for security simulation, we'll just accept it if the user exists.
      // Actually, let's just accept it.
      
      // Generate a fake token
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const loggedInUser = { ...user, token };
      
      setUser(loggedInUser);
      localStorage.setItem("auth_token", token);
      
      addNotification("Connexion réussie", "success");
      setAuthModalOpen(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-3">Bon retour</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Connectez-vous pour accéder à votre espace exclusif.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
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
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all text-luxury-black dark:text-white"
              placeholder="vous@exemple.com"
              autoFocus
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">Mot de passe</label>
            <button type="button" className="text-xs font-bold text-luxury-gold hover:underline">Mot de passe oublié ?</button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none transition-all text-luxury-black dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-neutral-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
            Se souvenir de moi
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-4 bg-luxury-black hover:bg-luxury-gold text-white dark:bg-white dark:text-luxury-black dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Se Connecter <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-4 text-neutral-500 font-bold tracking-widest">Ou continuer avec</span>
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

      <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Vous n'avez pas de compte ?{" "}
          <button
            onClick={() => setAuthModalView("register")}
            className="font-bold text-luxury-black dark:text-white hover:text-luxury-gold dark:hover:text-luxury-gold transition-colors"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
};
