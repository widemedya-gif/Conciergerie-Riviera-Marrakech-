import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/src/store/useStore";
import { OwnerSidebar } from "./OwnerSidebar";
import { OwnerHeader } from "./OwnerHeader";
import { OwnerOverview } from "./sections/OwnerOverview";
import { OwnerListings } from "./sections/OwnerListings";
import { AddPropertyFlow } from "./sections/AddPropertyFlow";
import { OwnerMessages } from "./sections/OwnerMessages";
import { OwnerBookings } from "./sections/OwnerBookings";
import { OwnerAnalytics } from "./sections/OwnerAnalytics";
import { OwnerSettings } from "./sections/OwnerSettings";

export const OwnerDashboard = () => {
  const { activeOwnerTab, user, setOwnerDashboardOpen } = useStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Security check: only owners can access
  useEffect(() => {
    if (!user || user.role !== "owner") {
      setOwnerDashboardOpen(false);
    }
  }, [user, setOwnerDashboardOpen]);

  if (!user || user.role !== "owner") return null;

  const renderContent = () => {
    switch (activeOwnerTab) {
      case "overview":
        return <OwnerOverview />;
      case "listings":
        return <OwnerListings />;
      case "add-property":
        return <AddPropertyFlow />;
      case "messages":
        return <OwnerMessages />;
      case "bookings":
        return <OwnerBookings />;
      case "analytics":
        return <OwnerAnalytics />;
      case "settings":
        return <OwnerSettings />;
      default:
        return <OwnerOverview />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-50 dark:bg-luxury-black flex overflow-hidden">
      <OwnerSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <OwnerHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOwnerTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
