import { motion } from "motion/react";
import { BookingEngine } from "./BookingEngine";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { EditableText } from "./ui/EditableText";
import { useStore } from "@/src/store/useStore";

export default function Hero() {
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);

  return (
    <section className="relative min-h-[90vh] w-full overflow-visible flex flex-col items-center justify-center pt-40 md:pt-48 pb-20 bg-[#F9F8F6] dark:bg-[#0A0A0A] transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-luxury-gold/[0.03] dark:bg-luxury-gold/[0.02] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-luxury-gold/[0.03] dark:bg-luxury-gold/[0.02] blur-3xl" />
        
        {/* Subtle grid/pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" 
             style={{ backgroundImage: 'radial-gradient(#C6A75E 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center mb-16 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-transparent border border-luxury-gold/30 backdrop-blur-md mb-8 md:mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
            <EditableText 
              value={content["hero.subtitle"] || "L'Excellence au Maroc"}
              onChange={(val) => updateContent("hero.subtitle", val)}
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold"
            />
          </div>
          
          {/* Main Title */}
          <h1 className="text-[3rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7.5rem] 2xl:text-[9rem] text-luxury-black dark:text-white font-serif mb-8 leading-[0.85] tracking-tight text-balance flex flex-col items-center">
            <span className="opacity-90">
              <EditableText 
                value={content["hero.title1"] || "VOTRE RÉSIDENCE"}
                onChange={(val) => updateContent("hero.title1", val)}
              />
            </span>
            <span className="italic font-light text-luxury-gold mt-2 md:mt-4 block">
              <EditableText 
                value={content["hero.title2"] || "D'EXCEPTION"}
                onChange={(val) => updateContent("hero.title2", val)}
              />
            </span>
          </h1>
          
          {/* Description */}
          <div className="relative">
            {/* Decorative line top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-luxury-gold/30" />
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-sans max-w-2xl mx-auto mb-16 font-light tracking-wide leading-relaxed">
              <EditableText 
                value={content["hero.description"] || "Découvrez une collection exclusive de villas et d'appartements de prestige à travers le Maroc. Une expérience sur mesure pour une clientèle exigeante."}
                onChange={(val) => updateContent("hero.description", val)}
                multiline
              />
            </p>
          </div>
        </motion.div>
      </div>

      {/* Booking Engine */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 w-full px-6"
      >
        <BookingEngine />
      </motion.div>
    </section>
  );
}
