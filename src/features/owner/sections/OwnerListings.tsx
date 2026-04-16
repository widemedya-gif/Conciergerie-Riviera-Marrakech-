import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Heart, 
  Edit2, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  PauseCircle,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const OwnerListings = () => {
  const { properties, setActiveOwnerTab, addNotification, user, deleteProperty } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter listings by ownerId
  const ownerListings = properties.filter(p => (p as any).ownerId === user?.id);

  const filteredListings = ownerListings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || (l as any).status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      deleteProperty(id);
      addNotification("Annonce supprimée avec succès", "success");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "pending": return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      case "draft": return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
      case "sold": return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-luxury-black dark:text-white mb-2">Mes Biens Immobiliers</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Gérez, modifiez et suivez la performance de vos annonces.</p>
        </div>
        <button 
          onClick={() => setActiveOwnerTab("add-property")}
          className="flex items-center gap-2 px-6 py-3.5 bg-luxury-black dark:bg-white text-white dark:text-luxury-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all shadow-lg shadow-black/10"
        >
          <Plus size={18} /> Ajouter un bien
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par titre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "pending", "draft", "sold"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                filterStatus === status 
                  ? "bg-luxury-gold text-white" 
                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              )}
            >
              {status === "all" ? "Tous" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredListings.map((listing: any) => (
            <motion.div
              key={listing.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Image */}
                <div className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden shrink-0">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
                    getStatusColor(listing.status)
                  )}>
                    {listing.status}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors">{listing.title}</h3>
                      <button className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-neutral-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> {listing.location}
                      </div>
                      <div className="font-bold text-luxury-gold">
                        {listing.price}€ <span className="text-[10px] font-normal text-neutral-400">/ nuit</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Eye size={16} />
                        <span className="text-xs font-bold">{listing.viewsCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Heart size={16} />
                        <span className="text-xs font-bold">{listing.favoritesCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-6 border-t border-neutral-50 dark:border-neutral-800">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-luxury-gold hover:text-white rounded-xl text-xs font-bold transition-all">
                      <Edit2 size={14} /> Modifier
                    </button>
                    <button className="p-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-500 hover:text-white rounded-xl transition-all">
                      <TrendingUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(listing.id)}
                      className="p-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-neutral-300" />
          </div>
          <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-2">Aucun bien trouvé</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Essayez de modifier vos filtres ou ajoutez une nouvelle annonce.</p>
          <button 
            onClick={() => setActiveOwnerTab("add-property")}
            className="px-8 py-4 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-luxury-gold/20"
          >
            Ajouter mon premier bien
          </button>
        </div>
      )}
    </div>
  );
};
