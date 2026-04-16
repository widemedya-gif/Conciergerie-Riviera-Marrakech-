import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/src/store/useStore";
import { ClientSidebar } from "./ClientSidebar";
import { ClientHeader } from "./ClientHeader";
import { ClientOverview } from "./sections/ClientOverview";
import { ClientFavorites } from "./sections/ClientFavorites";
import { ClientMessages } from "./sections/ClientMessages";
import { ClientBookings } from "./sections/ClientBookings";
import { ClientSettings } from "./sections/ClientSettings";
import { RecentlyViewedSection } from "./sections/RecentlyViewed";

export const ClientDashboard = () => {
  const { activeClientTab, isClientDashboardOpen, setClientDashboardOpen, user } = useStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isClientDashboardOpen || !user) return null;

  const renderContent = () => {
    switch (activeClientTab) {
      case "overview":
        return <ClientOverview />;
      case "favorites":
        return <ClientFavorites />;
      case "messages":
        return <ClientMessages />;
      case "bookings":
        return <ClientBookings />;
      case "recently-viewed":
        return <RecentlyViewedSection />;
      case "settings":
        return <ClientSettings />;
      default:
        return <ClientOverview />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-50 dark:bg-luxury-black flex overflow-hidden">
      <ClientSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClientHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeClientTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
