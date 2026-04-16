import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";
import { EditableText } from "./ui/EditableText";
import { useStore } from "@/src/store/useStore";
import { BudgetCategory } from "@/src/types";

const BUDGET_CATEGORIES = [
  {
    id: "budget",
    title: "Séjours Abordables",
    desc: "Des studios et appartements confortables pour les voyageurs malins.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    tag: "Budget" as BudgetCategory
  },
  {
    id: "standard",
    title: "Confort & Style",
    desc: "Des appartements modernes idéaux pour les familles et les couples.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5250ad99?auto=format&fit=crop&w=800&q=80",
    tag: "Standard" as BudgetCategory
  },
  {
    id: "premium",
    title: "Évasions Premium",
    desc: "Des riads et maisons de haute qualité avec des services exceptionnels.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tag: "Premium" as BudgetCategory
  },
  {
    id: "luxury",
    title: "Expériences de Luxe",
    desc: "Des villas exclusives avec piscines privées et personnel de maison.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    tag: "Luxe" as BudgetCategory
  }
];

export default function BrowseByBudget() {
  const content = useStore((state) => state.content);
  const updateContent = useStore((state) => state.updateContent);
  const setFilters = useStore((state) => state.setFilters);
  const setPropertiesPageOpen = useStore((state) => state.setPropertiesPageOpen);

  const handleExplore = (category: BudgetCategory) => {
    setFilters({ budgetCategory: category });
    setPropertiesPageOpen(true);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-luxury-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            Pour Tous Les Lifestyles
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black dark:text-white">
            <EditableText 
              value={content["budget.title"] || "Parcourir par Budget"}
              onChange={(val) => updateContent("budget.title", val)}
            />
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light">
            <EditableText 
              value={content["budget.desc"] || "Découvrez notre sélection de propriétés soigneusement choisies, allant des séjours économiques aux expériences de luxe ultimes."}
              onChange={(val) => updateContent("budget.desc", val)}
              multiline
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUDGET_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleExplore(category.tag)}
              className="group cursor-pointer relative rounded-[2rem] overflow-hidden aspect-[3/4]"
            >
              <ImagePlaceholder
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-110"
                aspectRatio="portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-luxury-black dark:text-white shadow-sm">
                  {category.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-serif text-white mb-2">{category.title}</h3>
                <p className="text-sm text-white/80 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {category.desc}
                </p>
                <button className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest hover:text-luxury-gold transition-colors">
                  Explorer <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
