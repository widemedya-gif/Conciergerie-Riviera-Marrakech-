import React, { useState } from "react";
import { motion, Reorder } from "motion/react";
import { Plus, Image as ImageIcon, MapPin, DollarSign, Tag, X, Layout, Edit3, Trash2, GripVertical } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { propertyService } from "@/src/services/api";
import { Modal, Button } from "@/src/components/ui/BaseComponents";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { PropertyType, BudgetCategory, Property, TravelIntent } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function AdminDashboard() {
  const { isAdminPanelOpen, setAdminPanelOpen, addNotification, setProperties, properties } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "edit" | "layout">("add");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const [sections, setSections] = useState([
    { id: "hero", name: "Hero Section" },
    { id: "budget", name: "Browse by Budget" },
    { id: "ai", name: "AI Recommendations" },
    { id: "properties", name: "Property Grid" },
    { id: "services", name: "Concierge Services" },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    region: "",
    neighborhood: "",
    price: "",
    type: "Villa" as PropertyType,
    budgetCategory: "Premium" as BudgetCategory,
    category: "luxury",
    travelIntents: [] as TravelIntent[],
    description: "",
    size: "250",
    capacity: "2",
    image: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const propertyData: Property = {
      id: editingProperty ? editingProperty.id : Math.random().toString(36).substring(7),
      title: formData.title,
      city: formData.city,
      region: formData.region,
      neighborhood: formData.neighborhood,
      location: `${formData.neighborhood}, ${formData.city}`,
      price: parseInt(formData.price),
      rating: editingProperty ? editingProperty.rating : 5.0,
      images: [formData.image],
      isSuperhost: true,
      type: formData.type,
      budgetCategory: formData.budgetCategory,
      category: formData.category,
      travelIntents: formData.travelIntents,
      amenities: ["WiFi", "Piscine", "Climatisation"],
      description: formData.description,
      size: parseInt(formData.size),
      capacity: parseInt(formData.capacity),
      matchScore: editingProperty ? editingProperty.matchScore : 95,
      viewCountToday: editingProperty ? editingProperty.viewCountToday : 0,
      priceInsight: editingProperty ? editingProperty.priceInsight : "Good value",
      reviews: editingProperty ? editingProperty.reviews : [],
      unavailableDates: editingProperty ? editingProperty.unavailableDates : []
    };

    try {
      if (editingProperty) {
        setProperties(properties.map(p => p.id === editingProperty.id ? propertyData : p));
        addNotification("Propriété mise à jour !", "success");
      } else {
        setProperties([propertyData, ...properties]);
        addNotification("Propriété publiée avec succès !", "success");
      }
      setEditingProperty(null);
      resetForm();
      setActiveTab("edit");
    } catch (error) {
      addNotification("Erreur lors de l'opération", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      city: "",
      region: "",
      neighborhood: "",
      price: "",
      type: "Villa",
      budgetCategory: "Premium",
      category: "luxury",
      travelIntents: [],
      description: "",
      size: "250",
      capacity: "2",
      image: ""
    });
  };

  const handleEdit = (p: Property) => {
    setEditingProperty(p);
    setFormData({
      title: p.title,
      city: p.city,
      region: p.region,
      neighborhood: p.neighborhood || "",
      price: p.price.toString(),
      type: p.type,
      budgetCategory: p.budgetCategory,
      category: p.category,
      travelIntents: p.travelIntents,
      description: p.description,
      size: p.size?.toString() || "250",
      capacity: p.capacity.toString(),
      image: p.images[0] || ""
    });
    setActiveTab("add");
  };

  const handleDelete = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    addNotification("Propriété supprimée", "info");
  };

  return (
    <Modal 
      isOpen={isAdminPanelOpen} 
      onClose={() => setAdminPanelOpen(false)}
      title="Riviera Admin Engine"
      className="max-w-4xl"
    >
      <div className="flex gap-4 mb-8 border-b border-neutral-100 pb-4">
        {[
          { id: "add", label: editingProperty ? "Modifier" : "Ajouter", icon: Plus },
          { id: "edit", label: "Gérer", icon: Edit3 },
          { id: "layout", label: "Mise en page", icon: Layout },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-luxury-black text-white" 
                : "text-neutral-400 hover:bg-neutral-50"
            )}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Titre</label>
                <input
                  type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  placeholder="ex. Villa Royal Mansour"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Ville</label>
                  <input
                    type="text" required value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Région</label>
                  <input
                    type="text" required value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Quartier</label>
                  <input
                    type="text" required value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Prix / Nuit</label>
                  <input
                    type="number" required value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Taille (m²)</label>
                  <input
                    type="number" required value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Capacité</label>
                  <input
                    type="number" required value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Riad">Riad</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Budget</label>
                  <select
                    value={formData.budgetCategory}
                    onChange={(e) => setFormData({ ...formData, budgetCategory: e.target.value as BudgetCategory })}
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-luxury-black"
                  >
                    <option value="Budget">Abordable</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxe">Luxe</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 ml-4">Description</label>
                <textarea
                  required rows={4} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all resize-none text-luxury-black"
                />
              </div>
              
              <div className="pt-4 flex gap-4">
                <Button isLoading={isLoading} className="flex-1 py-5">
                  {editingProperty ? "Enregistrer" : "Publier"}
                </Button>
                {editingProperty && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setEditingProperty(null); resetForm(); setActiveTab("edit"); }}
                    className="py-5"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          </form>
        )}

        {activeTab === "edit" && (
          <div className="space-y-4">
            {properties.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-lg overflow-hidden">
                    {p.images[0] && (
                      <ImagePlaceholder 
                        src={p.images[0]} 
                        className="w-full h-full" 
                        aspectRatio="square"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-luxury-black">{p.title}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{p.location} • €{p.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white rounded-full text-neutral-400 hover:text-luxury-gold">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-white rounded-full text-neutral-400 hover:text-luxury-bordeaux">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "layout" && (
          <div className="space-y-6">
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">Faites glisser pour réorganiser les sections de la page d'accueil</p>
            <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-3">
              {sections.map((section) => (
                <Reorder.Item 
                  key={section.id} 
                  value={section}
                  className="p-4 bg-white border border-neutral-100 rounded-2xl flex items-center justify-between cursor-grab active:cursor-grabbing shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical size={16} className="text-neutral-300" />
                    <span className="text-sm font-bold text-luxury-black">{section.name}</span>
                  </div>
                  <div className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">Active</div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <div className="pt-8">
              <Button onClick={() => addNotification("Mise en page enregistrée !", "success")} className="w-full">
                Enregistrer la structure
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
