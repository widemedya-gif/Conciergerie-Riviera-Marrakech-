import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useStore } from "../store/useStore";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { addNotification } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      addNotification("Bienvenue dans le Cercle Riviera !", "success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Mail className="text-luxury-gold" size={32} />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-serif mb-6 text-luxury-black dark:text-white">Rejoignez le Cercle Riviera</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-10 text-lg font-light">
          Abonnez-vous pour recevoir des offres exclusives, de nouvelles alertes de propriétés et de l'inspiration lifestyle de Marrakech.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            className="flex-1 px-8 py-4 rounded-full bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-luxury-gold transition-all shadow-sm text-luxury-black dark:text-white"
            required
            disabled={status === "loading" || status === "success"}
          />
          <button 
            disabled={status === "loading" || status === "success"}
            className={cn(
              "px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 shadow-lg flex items-center justify-center gap-2",
              status === "success" ? "bg-green-500 text-white" : "bg-luxury-black text-white hover:bg-luxury-gold"
            )}
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : status === "success" ? (
              <>S'abonner <Check size={16} /></>
            ) : (
              "S'abonner"
            )}
          </button>
        </form>
        <p className="mt-6 text-[10px] text-neutral-400 uppercase tracking-widest">
          En vous abonnant, vous acceptez notre Politique de Confidentialité.
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-luxury-black text-luxury-black dark:text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Company Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-1">
                CONCIERGE <span className="text-luxury-gold">RIVIERA</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-neutral-400">
                Marrakech Lifestyle
              </p>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-light">
              La destination de choix pour l'immobilier et les services de conciergerie d'élite au cœur de Marrakech. Découvrez la Ville Rouge comme jamais auparavant.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full border border-neutral-100 dark:border-neutral-800 hover:border-luxury-gold hover:text-luxury-gold transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">Entreprise</h4>
            <ul className="space-y-4">
              {["À Propos", "Notre Équipe", "Carrières", "Presse", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm font-light">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">Services</h4>
            <ul className="space-y-4">
              {["Villas de Luxe", "Appartements Premium", "Riads Privés", "Conciergerie", "Événements VIP"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-luxury-gold transition-colors text-sm font-light">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-luxury-gold text-xs font-bold tracking-[0.2em] uppercase mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-luxury-gold shrink-0" size={20} />
                <span className="text-neutral-500 dark:text-neutral-400 text-sm font-light">Avenue Mohammed VI, Hivernage, Marrakech 40000, Maroc</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-luxury-gold shrink-0" size={20} />
                <span className="text-neutral-500 dark:text-neutral-400 text-sm font-light">+212 524 000 000</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-luxury-gold shrink-0" size={20} />
                <span className="text-neutral-500 dark:text-neutral-400 text-sm font-light">contact@rivieramarrakech.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-400 text-xs font-light">
            © {currentYear} Concierge Riviera Marrakech. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-neutral-400 hover:text-luxury-gold text-xs font-light transition-colors">Politique de Confidentialité</a>
            <a href="#" className="text-neutral-400 hover:text-luxury-gold text-xs font-light transition-colors">Conditions d'Utilisation</a>
            <a href="#" className="text-neutral-400 hover:text-luxury-gold text-xs font-light transition-colors">Politique des Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MapSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-luxury-black dark:text-white">Explorez la Ville Rouge</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Découvrez nos propriétés dans les quartiers les plus prestigieux de Marrakech.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-luxury-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-black dark:text-white">Villas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-luxury-bordeaux" />
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-black dark:text-white">Riads</span>
            </div>
          </div>
        </div>

        <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-100 dark:border-neutral-800">
          <ImagePlaceholder 
            src="" 
            alt="Marrakech Map" 
            className="w-full h-full opacity-40 grayscale" 
            aspectRatio="wide"
          />
          <div className="absolute inset-0 bg-luxury-gold/5 dark:bg-luxury-gold/10" />
          
          {/* Interactive Pins (Mock) */}
          <Pin x="30%" y="40%" title="Villa Majorelle" type="gold" />
          <Pin x="55%" y="60%" title="Riad El Fenn" type="bordeaux" />
          <Pin x="70%" y="30%" title="Domaine Rose des Sables" type="gold" />
          <Pin x="45%" y="25%" title="Appartement Vue Atlas" type="gold" />
          
          <div className="absolute bottom-10 right-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 dark:border-neutral-800 max-w-xs">
            <h4 className="font-serif text-xl mb-2 text-luxury-black dark:text-white">Quartier Hivernage</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Le quartier le plus exclusif avec des hôtels de luxe, des restaurants gastronomiques et des boutiques haut de gamme.</p>
            <button className="text-xs font-bold text-luxury-gold uppercase tracking-widest hover:text-luxury-bordeaux transition-colors">
              Explorer le Quartier
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pin({ x, y, title, type }: { x: string, y: string, title: string, type: "gold" | "bordeaux" }) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="absolute cursor-pointer group" 
      style={{ left: x, top: y }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "w-6 h-6 rounded-full border-4 border-white shadow-lg",
          type === "gold" ? "bg-luxury-gold" : "bg-luxury-bordeaux"
        )}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white dark:bg-neutral-900 px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap border border-gray-100 dark:border-neutral-800 z-20"
          >
            <p className="text-xs font-bold text-luxury-black dark:text-white">{title}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
