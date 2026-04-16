import { CheckCircle2, ShieldCheck, Map, CreditCard, Headphones, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { EditableText } from "./ui/EditableText";
import { useStore } from "@/src/store/useStore";

const REASONS = [
  { icon: ShieldCheck, title: "Propriétés Vérifiées", desc: "Chaque annonce est inspectée personnellement pour garantir la qualité, quel que soit le prix." },
  { icon: Headphones, title: "Support 24/7", desc: "Notre équipe dédiée est disponible à tout moment pour répondre à vos besoins." },
  { icon: Map, title: "Emplacements Idéaux", desc: "Accès aux meilleurs quartiers et aux joyaux cachés de Marrakech." },
  { icon: CreditCard, title: "Paiements Sécurisés", desc: "Cryptage de pointe pour toutes vos transactions et réservations." },
  { icon: UserCheck, title: "Expérience Personnalisée", desc: "Des services sur-mesure conçus pour correspondre à votre style de vie et à votre budget." },
  { icon: CheckCircle2, title: "Transparence Totale", desc: "Des prix clairs, sans frais cachés, pour des options adaptées à chaque budget." }
];

export default function TrustSection() {
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);

  return (
    <section className="py-24 px-6 md:px-12 bg-gray-50 dark:bg-neutral-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            Le Standard Riviera
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-luxury-black dark:text-white">
            <EditableText 
              value={content["trust.title"] || "Pourquoi Choisir Concierge Riviera"}
              onChange={(val) => updateContent("trust.title", val)}
            />
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center mb-6 group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2 text-luxury-black dark:text-white">
                <reason.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif mb-3 text-luxury-black dark:text-white">{reason.title}</h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed max-w-xs">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ListPropertyCTA() {
  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden bg-[#F9F8F6] dark:bg-luxury-black transition-colors duration-500">
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#C6A75E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center text-luxury-black dark:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Transformez Votre Propriété en un <br />
            <span className="text-luxury-gold italic">Atout Rentable</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-12 font-light max-w-2xl mx-auto">
            Rejoignez notre collection de propriétés et touchez des voyageurs du monde entier, quel que soit le type de votre bien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-12 py-5 bg-luxury-black text-white dark:bg-white dark:text-luxury-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-gold transition-all duration-500 shadow-xl shadow-black/10">
              Commencer
            </button>
            <button className="px-12 py-5 border border-neutral-200 dark:border-neutral-800 hover:border-luxury-gold hover:text-luxury-gold rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 text-luxury-black dark:text-white">
              En Savoir Plus
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
