import { motion } from "motion/react";
import { SERVICES } from "@/src/constants";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { EditableText } from "./ui/EditableText";
import { useStore } from "@/src/store/useStore";

export default function ConciergeServices() {
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);
  const setChefPrivePageOpen = useStore((state) => state.setChefPrivePageOpen);

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black text-luxury-black dark:text-white transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Services Sur-Mesure
            </span>
            <h2 className="text-4xl md:text-6xl font-serif">
              <EditableText 
                value={content["concierge.title"] || "Conciergerie Premium"}
                onChange={(val) => updateContent("concierge.title", val)}
              />
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-lg font-light">
            <EditableText 
              value={content["concierge.desc"] || "Au-delà de l'hébergement, nous organisons des expériences qui définissent l'essence de Marrakech, adaptées à vos envies et à votre budget."}
              onChange={(val) => updateContent("concierge.desc", val)}
              multiline
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer"
              onClick={() => {
                if (service.id === "chef") {
                  setChefPrivePageOpen(true);
                  window.scrollTo(0, 0);
                }
              }}
            >
              <ImagePlaceholder
                src={service.image}
                alt={service.title}
                className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-serif mb-2 text-white group-hover:text-luxury-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-white/80 mb-6 line-clamp-2 font-light leading-relaxed">
                  {service.description}
                </p>
                <button 
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white group-hover:text-luxury-gold transition-all"
                  onClick={(e) => {
                    if (service.id === "chef") {
                      e.stopPropagation();
                      setChefPrivePageOpen(true);
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  Réserver <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[3rem] bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-serif mb-2">Demandes Spéciales</h3>
            <p className="text-neutral-500 dark:text-neutral-400">Un événement particulier ou une exigence unique ? Notre équipe est à votre service 24/7.</p>
          </div>
          <button className="px-10 py-4 bg-luxury-black text-white dark:bg-white dark:text-luxury-black rounded-full text-sm font-bold tracking-widest uppercase hover:bg-luxury-gold transition-all duration-500 whitespace-nowrap">
            Contacter le Service VIP
          </button>
        </div>
      </div>
    </section>
  );
}
