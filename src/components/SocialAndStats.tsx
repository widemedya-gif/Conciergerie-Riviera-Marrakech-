import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TESTIMONIALS } from "@/src/constants";
import { Quote, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Quote className="text-luxury-gold mx-auto mb-6" size={48} strokeWidth={1} />
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black dark:text-white">Ce Que Disent Nos Clients</h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-xl md:text-3xl font-serif italic text-gray-700 dark:text-neutral-300 mb-10 leading-relaxed">
                "{TESTIMONIALS[currentIndex].text}"
              </p>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-luxury-gold p-1">
                  <ImagePlaceholder
                    src={TESTIMONIALS[currentIndex].photo}
                    alt={TESTIMONIALS[currentIndex].name}
                    aspectRatio="square"
                  />
                </div>
                <h4 className="text-lg font-bold text-luxury-black dark:text-white">{TESTIMONIALS[currentIndex].name}</h4>
                <p className="text-sm text-luxury-gold uppercase tracking-widest">{TESTIMONIALS[currentIndex].country}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-3 rounded-full border border-gray-100 dark:border-neutral-800 hover:border-luxury-gold hover:text-luxury-gold transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-3 rounded-full border border-gray-100 dark:border-neutral-800 hover:border-luxury-gold hover:text-luxury-gold transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { label: "Propriétés", value: 150, suffix: "+" },
    { label: "Clients Satisfaits", value: 2500, suffix: "+" },
    { label: "Réservations", value: 8500, suffix: "" },
    { label: "Villes Couvertes", value: 12, suffix: "" }
  ];

  return (
    <section className="py-20 bg-white dark:bg-luxury-black text-luxury-black dark:text-white border-y border-neutral-100 dark:border-neutral-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-6xl font-serif text-luxury-gold mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LifestyleGallery() {
  const images = [
    "https://images.unsplash.com/photo-1541971822443-3733009d3be6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-luxury-black dark:text-white">Lifestyle Riviera</h2>
          <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-luxury-black dark:text-white hover:text-luxury-gold transition-colors">
            <Instagram size={18} /> @rivieramarrakech
          </button>
        </div>
        
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group overflow-hidden rounded-[2rem]"
            >
              <ImagePlaceholder
                src={img}
                alt="Lifestyle"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <Instagram className="text-white" size={32} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
