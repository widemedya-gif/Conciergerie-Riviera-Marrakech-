import React from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  MessageSquare, 
  CalendarCheck, 
  BarChart3, 
  Heart, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

interface SidebarItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  badge?: number;
  key?: string;
}

const SidebarItem = ({ id, icon: Icon, label, active, collapsed, onClick, badge }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20" 
        : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-luxury-black dark:hover:text-white"
    )}
  >
    <Icon className={cn("shrink-0", active ? "text-white" : "group-hover:scale-110 transition-transform")} size={20} />
    {!collapsed && (
      <span className="font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden">
        {label}
      </span>
    )}
    {badge && badge > 0 && (
      <span className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold",
        active ? "bg-white text-luxury-gold" : "bg-luxury-gold text-white"
      )}>
        {badge}
      </span>
    )}
    {collapsed && active && (
      <motion.div 
        layoutId="active-indicator"
        className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
      />
    )}
  </button>
);

export const OwnerSidebar = ({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) => {
  const { activeOwnerTab, setActiveOwnerTab, setOwnerDashboardOpen, setUser, ownerMessages } = useStore();
  
  const unreadMessages = ownerMessages.filter(m => m.isUnread).length;

  const menuItems: { id: string; icon: React.ElementType; label: string; badge?: number }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Tableau de bord" },
    { id: "listings", icon: Home, label: "Mes Biens" },
    { id: "add-property", icon: PlusCircle, label: "Ajouter un bien" },
    { id: "messages", icon: MessageSquare, label: "Messages", badge: unreadMessages },
    { id: "bookings", icon: CalendarCheck, label: "Réservations" },
    { id: "analytics", icon: BarChart3, label: "Analytiques" },
    { id: "favorites", icon: Heart, label: "Favoris" },
    { id: "settings", icon: Settings, label: "Paramètres" },
  ];

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    setOwnerDashboardOpen(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 flex flex-col relative z-10"
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 bg-luxury-black dark:bg-white rounded-xl flex items-center justify-center shrink-0">
          <Building2 className="text-white dark:text-luxury-black" size={24} />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif font-bold text-xl text-luxury-black dark:text-white tracking-tight"
          >
            Riviera<span className="text-luxury-gold">Owner</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeOwnerTab === item.id}
            collapsed={isCollapsed}
            onClick={() => setActiveOwnerTab(item.id)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span className="font-bold text-sm tracking-wide">Déconnexion</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-full flex items-center justify-center shadow-md hover:text-luxury-gold transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
};
