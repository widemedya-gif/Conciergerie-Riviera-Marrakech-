import React from "react";
import { useStore } from "@/src/store/useStore";
import { 
  LayoutDashboard, 
  Building2, 
  LayoutTemplate, 
  SlidersHorizontal, 
  Sparkles, 
  Palette, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  X,
  ChefHat,
  Map,
  CalendarCheck,
  Plane
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const TABS = [
  { id: "dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "listings", label: "Propriétés", icon: Building2 },
  { id: "chefs", label: "Chefs Privés", icon: ChefHat },
  { id: "trips", label: "Voyages Organisés", icon: Map },
  { id: "flights", label: "Vols & Transferts", icon: Plane },
  { id: "bookings", label: "Réservations", icon: CalendarCheck },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "builder", label: "Éditeur de Page", icon: LayoutTemplate },
  { id: "filters", label: "Filtres & Logique", icon: SlidersHorizontal },
  { id: "recommendations", label: "Moteur de Reco.", icon: Sparkles },
  { id: "ui", label: "Personnalisation UI", icon: Palette },
  { id: "content", label: "Contenu Global", icon: FileText },
  { id: "settings", label: "Paramètres Système", icon: Settings },
];

export const AdminSidebar = () => {
  const isAdminMode = useStore((state) => state.isAdminMode);
  const toggleAdminMode = useStore((state) => state.toggleAdminMode);
  const activeAdminTab = useStore((state) => state.activeAdminTab);
  const setActiveAdminTab = useStore((state) => state.setActiveAdminTab);
  const addNotification = useStore((state) => state.addNotification);

  if (!isAdminMode) return null;

  const handleExit = () => {
    toggleAdminMode(false);
    addNotification("Mode Administrateur Désactivé", "info");
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 bg-luxury-black text-white z-[100] shadow-2xl flex flex-col border-r border-neutral-800 transition-transform duration-300">
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-lg tracking-tight text-luxury-gold">ELITE CONTROL</h2>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">System Admin</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-luxury-gold/20 text-luxury-gold font-medium" 
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleExit}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <LogOut size={14} /> Quitter le Mode Admin
        </button>
      </div>
    </div>
  );
};
