/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrowseByBudget from "./components/BrowseByBudget";
import PropertyGrid from "./features/properties/PropertyGrid";
import ConciergeServices from "./components/ConciergeServices";
import { ExploreDestinations } from "./components/ExploreDestinations";
import TrustSection, { ListPropertyCTA } from "./components/TrustAndCTA";
import { Testimonials, StatsSection, LifestyleGallery } from "./components/SocialAndStats";
import { MapSection, Newsletter, Footer } from "./components/FooterAndNewsletter";
import BookingModal from "./features/booking/BookingModal";
import { AuthModal } from "./components/auth/AuthModal";
import { OnboardingModal } from "./components/auth/OnboardingModal";
import { OwnerDashboard } from "./features/owner/OwnerDashboard";
import { ClientDashboard } from "./features/client/ClientDashboard";
import { AdvancedSearch } from "./features/search/AdvancedSearch";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { AdminSidebar } from "./features/admin/AdminSidebar";
import NotificationSystem from "./components/ui/NotificationSystem";
import { ComparisonModal } from "./components/ComparisonModal";
import { AIRecommendations } from "./components/AIRecommendations";
import { PropertiesPage } from "./features/marketplace/PropertiesPage";
import { ChefPrive } from "./features/chef/ChefPrive";
import { GestionImmobiliere } from "./features/properties/GestionImmobiliere";
import { ChefProfile } from "./features/chef/ChefProfile";
import { ChefOnboarding } from "./features/chef/ChefOnboarding";
import { ChefDashboard } from "./features/chef/ChefDashboard";
import ShortTermRentals from "./features/properties/ShortTermRentals";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { useStore } from "./store/useStore";
import { cn } from "./lib/utils";
import { Modal, Button } from "./components/ui/BaseComponents";
import { Lock } from "lucide-react";

import { SectionWrapper } from "./components/ui/SectionWrapper";
import { AdminListings } from "./features/admin/AdminListings";
import { AdminChefs } from "./features/admin/AdminChefs";
import { AdminTrips } from "./features/admin/AdminTrips";
import { AdminFlights } from "./features/admin/AdminFlights";
import { AdminBookings } from "./features/admin/AdminBookings";
import { AdminUsers } from "./features/admin/AdminUsers";
import { AdminUICustomization } from "./features/admin/AdminUICustomization";
import { AdminDashboardOverview } from "./features/admin/AdminDashboardOverview";
import { AdminFiltersLogic } from "./features/admin/AdminFiltersLogic";
import { AdminContentManagement } from "./features/admin/AdminContentManagement";
import { AdminRecommendations } from "./features/admin/AdminRecommendations";
import { AdminSimulation } from "./features/admin/AdminSimulation";
import { AdminSettings } from "./features/admin/AdminSettings";
import { TravelPlanner } from "./components/TravelPlanner";
import { WeekendDeals } from "./components/WeekendDeals";
import { TrendingStays } from "./components/TrendingStays";
import { AirportTransfer } from "./features/services/AirportTransfer";

export default function App() {
  const { setAdminPanelOpen, addNotification, theme, isAdminMode, activeAdminTab, homepageSections, setUser, mockUsers } = useStore();
  const isAdminPasswordModalOpen = useStore((state) => state.isAdminLoginModalOpen);
  const setIsAdminPasswordModalOpen = useStore((state) => state.setAdminLoginModalOpen);
  const isOwnerDashboardOpen = useStore((state) => state.isOwnerDashboardOpen);
  const isClientDashboardOpen = useStore((state) => state.isClientDashboardOpen);
  const isPropertiesPageOpen = useStore((state) => state.isPropertiesPageOpen);
  const isChefPrivePageOpen = useStore((state) => state.isChefPrivePageOpen);
  const isGestionImmobilierePageOpen = useStore((state) => state.isGestionImmobilierePageOpen);
  const isShortTermRentalsOpen = useStore((state) => state.isShortTermRentalsOpen);
  const isAirportTransferOpen = useStore((state) => state.isAirportTransferOpen);
  const isAdvancedSearchOpen = useStore((state) => state.isAdvancedSearchOpen);
  const setAdvancedSearchOpen = useStore((state) => state.setAdvancedSearchOpen);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Session Management
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Find user with this token in mockUsers
      // In a real app, we'd validate the token with the backend
      const user = mockUsers.find(u => u.token === token);
      if (user) {
        setUser(user);
      } else {
        // If token is invalid or user not found, clear it
        localStorage.removeItem("auth_token");
      }
    }
  }, [mockUsers, setUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    if (theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminPasswordModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      "relative min-h-screen bg-white dark:bg-luxury-black selection:bg-luxury-gold selection:text-white transition-all duration-500",
      isAdminMode ? "pl-64" : ""
    )}>
      {isOwnerDashboardOpen && <OwnerDashboard />}
      {isClientDashboardOpen && <ClientDashboard />}
      <ComparisonModal />
      <AnimatePresence>
        {isAdvancedSearchOpen && (
          <AdvancedSearch isOpen={isAdvancedSearchOpen} onClose={() => setAdvancedSearchOpen(false)} />
        )}
      </AnimatePresence>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-luxury-gold z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      <AdminSidebar />
      
      <main>
        {isGestionImmobilierePageOpen ? (
          <GestionImmobiliere />
        ) : isShortTermRentalsOpen ? (
          <ShortTermRentals />
        ) : isAirportTransferOpen ? (
          <AirportTransfer />
        ) : isChefPrivePageOpen ? (
          <ChefPrive />
        ) : isPropertiesPageOpen ? (
          <PropertiesPage />
        ) : isAdminMode && activeAdminTab === "dashboard" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminDashboardOverview />
          </div>
        ) : isAdminMode && activeAdminTab === "listings" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminListings />
          </div>
        ) : isAdminMode && activeAdminTab === "chefs" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminChefs />
          </div>
        ) : isAdminMode && activeAdminTab === "trips" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminTrips />
          </div>
        ) : isAdminMode && activeAdminTab === "flights" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminFlights />
          </div>
        ) : isAdminMode && activeAdminTab === "bookings" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminBookings />
          </div>
        ) : isAdminMode && activeAdminTab === "users" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminUsers />
          </div>
        ) : isAdminMode && activeAdminTab === "ui" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminUICustomization />
          </div>
        ) : isAdminMode && activeAdminTab === "filters" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminFiltersLogic />
          </div>
        ) : isAdminMode && activeAdminTab === "content" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminContentManagement />
          </div>
        ) : isAdminMode && activeAdminTab === "recommendations" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminRecommendations />
          </div>
        ) : isAdminMode && activeAdminTab === "simulation" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminSimulation />
          </div>
        ) : isAdminMode && activeAdminTab === "settings" ? (
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-luxury-black">
            <AdminSettings />
          </div>
        ) : (
          <>
            {homepageSections.map((sectionId) => {
              switch (sectionId) {
                case "hero":
                  return <SectionWrapper key={sectionId} id={sectionId}><Hero /></SectionWrapper>;
                case "browseByBudget":
                  return <SectionWrapper key={sectionId} id={sectionId}><div className="pt-32 pb-12"><BrowseByBudget /></div></SectionWrapper>;
                case "aiRecommendations":
                  return <SectionWrapper key={sectionId} id={sectionId}><AIRecommendations /></SectionWrapper>;
                case "propertyGrid":
                  return <SectionWrapper key={sectionId} id={sectionId}><div className="pt-12"><PropertyGrid /></div></SectionWrapper>;
                case "exploreDestinations":
                  return <SectionWrapper key={sectionId} id={sectionId}><ExploreDestinations /></SectionWrapper>;
                case "trendingStays":
                  return <SectionWrapper key={sectionId} id={sectionId}><TrendingStays /></SectionWrapper>;
                case "travelPlanner":
                  return <SectionWrapper key={sectionId} id={sectionId}><TravelPlanner /></SectionWrapper>;
                case "weekendDeals":
                  return <SectionWrapper key={sectionId} id={sectionId}><WeekendDeals /></SectionWrapper>;
                case "conciergeServices":
                  return <SectionWrapper key={sectionId} id={sectionId}><ConciergeServices /></SectionWrapper>;
                case "trustSection":
                  return <SectionWrapper key={sectionId} id={sectionId}><TrustSection /></SectionWrapper>;
                case "listPropertyCTA":
                  return <SectionWrapper key={sectionId} id={sectionId}><ListPropertyCTA /></SectionWrapper>;
                case "mapSection":
                  return <SectionWrapper key={sectionId} id={sectionId}><MapSection /></SectionWrapper>;
                case "testimonials":
                  return <SectionWrapper key={sectionId} id={sectionId}><Testimonials /></SectionWrapper>;
                case "statsSection":
                  return <SectionWrapper key={sectionId} id={sectionId}><StatsSection /></SectionWrapper>;
                case "lifestyleGallery":
                  return <SectionWrapper key={sectionId} id={sectionId}><LifestyleGallery /></SectionWrapper>;
                case "newsletter":
                  return <SectionWrapper key={sectionId} id={sectionId}><Newsletter /></SectionWrapper>;
                default:
                  return null;
              }
            })}
          </>
        )}
      </main>

      <Footer />
      
      {/* Feature Modals */}
      <BookingModal />
      <AuthModal />
      <OnboardingModal />
      <AdminLoginModal isOpen={isAdminPasswordModalOpen} onClose={() => setIsAdminPasswordModalOpen(false)} />
      <ComparisonModal />
      <ChefProfile />
      <ChefOnboarding />
      <ChefDashboard />
      
      {/* System UI */}
      <NotificationSystem />
    </div>
  );
}
