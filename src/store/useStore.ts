import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  Property, 
  User, 
  SearchFilters, 
  Location, 
  OwnerListing, 
  Message, 
  BookingRequest, 
  Notification,
  Conversation,
  RecentlyViewed,
  OrganizedTrip,
  Chef,
  ChefBooking,
  Flight,
  TransferVehicle,
  Tour,
  FlightRequest,
  Driver,
  CommissionSettings,
  TravelBooking
} from "../types";
import { PROPERTIES, LOCATIONS } from "../constants";

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  mockUsers: User[];
  setMockUsers: (users: User[]) => void;
  authModalView: "login" | "register";
  setAuthModalView: (view: "login" | "register") => void;
  
  // Search
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  savedSearches: SearchFilters[];
  saveCurrentSearch: () => void;
  
  // Properties
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  favorites: string[]; // IDs
  toggleFavorite: (id: string) => void;
  recentlyViewed: RecentlyViewed[];
  addRecentlyViewed: (id: string) => void;

  // Locations
  locations: Location[];
  addLocation: (location: Location) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  removeLocation: (id: string) => void;

  // Organized Trips
  organizedTrips: OrganizedTrip[];
  setOrganizedTrips: (trips: OrganizedTrip[]) => void;
  
  // Chef Privé
  chefs: Chef[];
  setChefs: (chefs: Chef[]) => void;
  addChef: (chef: Chef) => void;
  updateChef: (id: string, chef: Partial<Chef>) => void;
  chefBookings: ChefBooking[];
  addChefBooking: (booking: ChefBooking) => void;
  updateChefBookingStatus: (id: string, status: ChefBooking["status"]) => void;
  selectedChefId: string | null;
  setSelectedChefId: (id: string | null) => void;
  isChefOnboardingOpen: boolean;
  setChefOnboardingOpen: (open: boolean) => void;
  isChefDashboardOpen: boolean;
  setChefDashboardOpen: (open: boolean) => void;
  activeChefTab: "overview" | "profile" | "menus" | "bookings" | "settings";
  setActiveChefTab: (tab: "overview" | "profile" | "menus" | "bookings" | "settings") => void;

  // Flights & Transfers
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, flight: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  deleteFlights: (ids: string[]) => void;

  transferVehicles: TransferVehicle[];
  setTransferVehicles: (vehicles: TransferVehicle[]) => void;
  addTransferVehicle: (vehicle: TransferVehicle) => void;
  updateTransferVehicle: (id: string, vehicle: Partial<TransferVehicle>) => void;
  deleteTransferVehicle: (id: string) => void;
  deleteTransferVehicles: (ids: string[]) => void;

  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  addTour: (tour: Tour) => void;
  updateTour: (id: string, tour: Partial<Tour>) => void;
  deleteTour: (id: string) => void;
  deleteTours: (ids: string[]) => void;

  flightRequests: FlightRequest[];
  addFlightRequest: (request: FlightRequest) => void;
  updateFlightRequest: (id: string, request: Partial<FlightRequest>) => void;
  deleteFlightRequest: (id: string) => void;
  deleteFlightRequests: (ids: string[]) => void;

  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  commissionSettings: CommissionSettings;
  updateCommissionSettings: (settings: Partial<CommissionSettings>) => void;

  travelBookings: TravelBooking[];
  addTravelBooking: (booking: TravelBooking) => void;
  updateTravelBooking: (id: string, booking: Partial<TravelBooking>) => void;

  // Personalization
  userBehaviorTracking: {
    searches: string[];
    clicks: string[];
    petFriendlySelected: number;
    favoriteLocations: string[];
  };
  trackSearch: (query: string) => void;
  trackClick: (id: string) => void;
  trackPetFriendly: (selected: boolean) => void;
  trackLocation: (location: string) => void;
  
  // Cart & Comparison
  cart: string[]; // IDs
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  comparisonList: string[]; // IDs
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  
  // UI States
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (open: boolean) => void;
  isAdminMode: boolean;
  toggleAdminMode: (enabled: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  content: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  homepageSections: string[];
  reorderSections: (startIndex: number, endIndex: number) => void;
  isAdminUnlocked: boolean;
  unlockAdmin: (code: string) => boolean;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  isComparisonModalOpen: boolean;
  setComparisonModalOpen: (open: boolean) => void;
  
  // Notifications (System Toasts)
  notifications: { id: string; message: string; type: "success" | "error" | "info" }[];
  addNotification: (message: string, type: "success" | "error" | "info") => void;
  removeNotification: (id: string) => void;

  // Navigation
  lastVisitedService: string | null;
  setLastVisitedService: (service: string) => void;
  isPropertiesPageOpen: boolean;
  setPropertiesPageOpen: (open: boolean) => void;
  isChefPrivePageOpen: boolean;
  setChefPrivePageOpen: (open: boolean) => void;
  isGestionImmobilierePageOpen: boolean;
  setGestionImmobilierePageOpen: (open: boolean) => void;
  isShortTermRentalsOpen: boolean;
  setShortTermRentalsOpen: (open: boolean) => void;
  isAirportTransferOpen: boolean;
  setAirportTransferOpen: (open: boolean) => void;

  // Marketplace UI
  isQuickViewOpen: boolean;
  setQuickViewOpen: (open: boolean) => void;
  quickViewPropertyId: string | null;
  setQuickViewPropertyId: (id: string | null) => void;
  isMapViewOpen: boolean;
  setMapViewOpen: (open: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Owner Dashboard
  isOwnerDashboardOpen: boolean;
  setOwnerDashboardOpen: (open: boolean) => void;
  activeOwnerTab: string;
  setActiveOwnerTab: (tab: string) => void;
  ownerListings: OwnerListing[];
  setOwnerListings: (listings: OwnerListing[]) => void;
  ownerMessages: Message[];
  ownerBookings: BookingRequest[];
  ownerNotifications: Notification[];

  // Client Dashboard
  isClientDashboardOpen: boolean;
  setClientDashboardOpen: (open: boolean) => void;
  isAdvancedSearchOpen: boolean;
  setAdvancedSearchOpen: (open: boolean) => void;
  activeClientTab: string;
  setActiveClientTab: (tab: string) => void;
  clientBookings: BookingRequest[];
  addClientBooking: (booking: BookingRequest) => void;
  clientConversations: Conversation[];
  addClientMessage: (conversationId: string, message: Message) => void;
  clientNotifications: Notification[];
  markNotificationAsRead: (id: string) => void;
}

const initialFilters: SearchFilters = {
  location: "Tout le Maroc",
  startDate: null,
  endDate: null,
  guests: { adults: 1, children: 0, infants: 0 },
  propertyType: "Tous",
  priceRange: [0, 5000],
  budgetCategory: "Tous",
  amenities: [],
  features: [],
  travelIntent: undefined,
  bedrooms: 0,
  bathrooms: 0,
  surface: [0, 1000],
  listingType: "rent",
  query: "",
  condition: "Tous",
  view: "Tous",
  floor: undefined,
  furnished: false,
  parking: false,
  security: false,
  pool: false,
  garden: false,
  terrace: false,
  elevator: false,
  petFriendly: false,
  entirePlace: false,
  tripType: "Tous",
  duration: "Tous",
  category: "Tous"
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      mockUsers: [],
      setMockUsers: (users) => set({ mockUsers: users }),
      authModalView: "login",
      setAuthModalView: (view) => set({ authModalView: view }),
      
      filters: initialFilters,
      setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: initialFilters }),
      savedSearches: [],
      saveCurrentSearch: () => set((state) => ({ savedSearches: [...state.savedSearches, state.filters] })),
      
      properties: [],
      setProperties: (properties) => set({ properties }),
      addProperty: (property) => set((state) => ({ properties: [property, ...state.properties] })),
      updateProperty: (id, updatedProperty) => set((state) => ({
        properties: state.properties.map((p) => p.id === id ? { ...p, ...updatedProperty } : p)
      })),
      deleteProperty: (id) => set((state) => ({
        properties: state.properties.filter((p) => p.id !== id)
      })),
      favorites: [],
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((fid) => fid !== id)
          : [...state.favorites, id]
      })),
      recentlyViewed: [],
      addRecentlyViewed: (id) => set((state) => ({
        recentlyViewed: [
          { propertyId: id, viewedAt: new Date().toISOString() },
          ...state.recentlyViewed.filter(rv => rv.propertyId !== id)
        ].slice(0, 10)
      })),

      locations: LOCATIONS,
      addLocation: (location) => set((state) => ({ locations: [...state.locations, location] })),
      updateLocation: (id, updatedFields) => set((state) => ({
        locations: state.locations.map((loc) => loc.id === id ? { ...loc, ...updatedFields } : loc)
      })),
      removeLocation: (id) => set((state) => ({
        locations: state.locations.filter((loc) => loc.id !== id)
      })),

      organizedTrips: [],
      setOrganizedTrips: (trips) => set({ organizedTrips: trips }),

      chefs: [],
      setChefs: (chefs) => set({ chefs }),
      addChef: (chef) => set((state) => ({ chefs: [...state.chefs, chef] })),
      updateChef: (id, updatedChef) => set((state) => ({
        chefs: state.chefs.map((c) => c.id === id ? { ...c, ...updatedChef } : c)
      })),
      chefBookings: [],
      addChefBooking: (booking) => set((state) => ({ chefBookings: [booking, ...state.chefBookings] })),
      updateChefBookingStatus: (id, status) => set((state) => ({
        chefBookings: state.chefBookings.map((b) => b.id === id ? { ...b, status } : b)
      })),
      selectedChefId: null,
      setSelectedChefId: (id) => set({ selectedChefId: id }),
      isChefOnboardingOpen: false,
      setChefOnboardingOpen: (open) => set({ isChefOnboardingOpen: open }),
      isChefDashboardOpen: false,
      setChefDashboardOpen: (open) => set({ isChefDashboardOpen: open }),
      activeChefTab: "overview",
      setActiveChefTab: (tab) => set({ activeChefTab: tab }),

      flights: [
        {
          id: "f1",
          type: "private_jet",
          departure: "Paris (LBG)",
          arrival: "Marrakech (RAK)",
          price: 15000,
          capacity: 8,
          image: "https://picsum.photos/seed/jet1/800/500",
          status: "active"
        },
        {
          id: "f2",
          type: "helicopter",
          departure: "Marrakech (RAK)",
          arrival: "Agafay Desert",
          price: 1200,
          capacity: 4,
          image: "https://picsum.photos/seed/heli1/800/500",
          status: "active"
        },
        {
          id: "f3",
          type: "vtc",
          departure: "Aéroport Casablanca (CMN)",
          arrival: "Centre Ville Casablanca",
          price: 80,
          capacity: 3,
          image: "https://picsum.photos/seed/mercedes-s/800/500",
          status: "active"
        },
        {
          id: "f4",
          type: "commercial",
          airlineName: "Royal Air Maroc",
          airlineLogo: "https://picsum.photos/seed/ram/100/100",
          flightNumber: "AT 789",
          departure: "Paris (CDG)",
          arrival: "Marrakech (RAK)",
          departureTime: "10:30",
          arrivalTime: "13:45",
          duration: "3h 15m",
          stops: 0,
          seatClasses: [
            { type: "economy", price: 150, availableSeats: 45 },
            { type: "business", price: 450, availableSeats: 12 }
          ],
          status: "active",
          tags: ["best-value", "direct"],
          isFeatured: true
        }
      ],
      setFlights: (flights) => set({ flights }),
      addFlight: (flight) => set((state) => ({ flights: [...state.flights, flight] })),
      updateFlight: (id, updatedFlight) => set((state) => ({
        flights: state.flights.map((f) => f.id === id ? { ...f, ...updatedFlight } : f)
      })),
      deleteFlight: (id) => set((state) => ({
        flights: state.flights.filter((f) => f.id !== id)
      })),
      deleteFlights: (ids) => set((state) => ({
        flights: state.flights.filter((f) => !ids.includes(f.id))
      })),

      transferVehicles: [
        {
          id: "v1",
          name: "Mercedes Classe E",
          category: "business",
          image: "https://picsum.photos/seed/mercedes-e/800/500",
          capacity: 3,
          pricingModel: "fixed",
          baseFare: 90,
          status: "active"
        },
        {
          id: "v2",
          name: "Mercedes Classe S",
          category: "luxury",
          image: "https://picsum.photos/seed/mercedes-s/800/500",
          capacity: 3,
          pricingModel: "fixed",
          baseFare: 150,
          status: "active"
        },
        {
          id: "v3",
          name: "Mercedes Classe V",
          category: "van",
          image: "https://picsum.photos/seed/mercedes-v/800/500",
          capacity: 7,
          pricingModel: "fixed",
          baseFare: 120,
          status: "active"
        }
      ],
      setTransferVehicles: (transferVehicles) => set({ transferVehicles }),
      addTransferVehicle: (vehicle) => set((state) => ({ transferVehicles: [...state.transferVehicles, vehicle] })),
      updateTransferVehicle: (id, updatedVehicle) => set((state) => ({
        transferVehicles: state.transferVehicles.map((v) => v.id === id ? { ...v, ...updatedVehicle } : v)
      })),
      deleteTransferVehicle: (id) => set((state) => ({
        transferVehicles: state.transferVehicles.filter((v) => v.id !== id)
      })),
      deleteTransferVehicles: (ids) => set((state) => ({
        transferVehicles: state.transferVehicles.filter((v) => !ids.includes(v.id))
      })),

      tours: [
        {
          id: "t1",
          title: "Désert d'Agafay en Quad & Dîner sous les étoiles",
          description: "Une expérience inoubliable dans le désert d'Agafay avec balade en quad et dîner traditionnel.",
          images: ["https://picsum.photos/seed/agafay/800/500"],
          duration: "Demi-journée",
          price: 120,
          maxParticipants: 10,
          category: "adventure",
          rating: 4.9,
          status: "active"
        },
        {
          id: "t2",
          title: "Visite Historique de la Médina",
          description: "Découvrez les secrets de la Médina avec un guide expert local.",
          images: ["https://picsum.photos/seed/medina/800/500"],
          duration: "3 heures",
          price: 45,
          maxParticipants: 15,
          category: "cultural",
          rating: 4.8,
          status: "active"
        }
      ],
      setTours: (tours) => set({ tours }),
      addTour: (tour) => set((state) => ({ tours: [...state.tours, tour] })),
      updateTour: (id, updatedTour) => set((state) => ({
        tours: state.tours.map((t) => t.id === id ? { ...t, ...updatedTour } : t)
      })),
      deleteTour: (id) => set((state) => ({
        tours: state.tours.filter((t) => t.id !== id)
      })),
      deleteTours: (ids) => set((state) => ({
        tours: state.tours.filter((t) => !ids.includes(t.id))
      })),

      flightRequests: [],
      addFlightRequest: (request) => set((state) => ({ flightRequests: [...state.flightRequests, request] })),
      updateFlightRequest: (id, request) => set((state) => ({
        flightRequests: state.flightRequests.map((r) => r.id === id ? { ...r, ...request } : r)
      })),
      deleteFlightRequest: (id) => set((state) => ({
        flightRequests: state.flightRequests.filter((r) => r.id !== id)
      })),
      deleteFlightRequests: (ids) => set((state) => ({
        flightRequests: state.flightRequests.filter((r) => !ids.includes(r.id))
      })),

      drivers: [
        {
          id: "d1",
          name: "Ahmed B.",
          phone: "+212 600 000 001",
          vehicleIds: ["v1", "v2"],
          rating: 4.9,
          status: "active"
        }
      ],
      addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),
      updateDriver: (id, driver) => set((state) => ({
        drivers: state.drivers.map((d) => d.id === id ? { ...d, ...driver } : d)
      })),
      deleteDriver: (id) => set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id)
      })),

      commissionSettings: {
        flightMarginPercent: 15,
        transferMarginPercent: 20,
        tourMarginPercent: 25,
        propertyMarginPercent: 15
      },
      updateCommissionSettings: (settings) => set((state) => ({
        commissionSettings: { ...state.commissionSettings, ...settings }
      })),

      travelBookings: [],
      addTravelBooking: (booking) => set((state) => ({ travelBookings: [...state.travelBookings, booking] })),
      updateTravelBooking: (id, booking) => set((state) => ({
        travelBookings: state.travelBookings.map((b) => b.id === id ? { ...b, ...booking } : b)
      })),

      userBehaviorTracking: {
        searches: [],
        clicks: [],
        petFriendlySelected: 0,
        favoriteLocations: []
      },
      trackSearch: (query) => set((state) => ({
        userBehaviorTracking: {
          ...state.userBehaviorTracking,
          searches: [query, ...state.userBehaviorTracking.searches].slice(0, 20)
        }
      })),
      trackClick: (id) => set((state) => ({
        userBehaviorTracking: {
          ...state.userBehaviorTracking,
          clicks: [id, ...state.userBehaviorTracking.clicks].slice(0, 50)
        }
      })),
      trackPetFriendly: (selected) => set((state) => ({
        userBehaviorTracking: {
          ...state.userBehaviorTracking,
          petFriendlySelected: state.userBehaviorTracking.petFriendlySelected + (selected ? 1 : -1)
        }
      })),
      trackLocation: (location) => set((state) => ({
        userBehaviorTracking: {
          ...state.userBehaviorTracking,
          favoriteLocations: [location, ...state.userBehaviorTracking.favoriteLocations].slice(0, 10)
        }
      })),
      
      cart: [],
      addToCart: (id) => set((state) => ({
        cart: state.cart.includes(id) ? state.cart : [...state.cart, id]
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(cid => cid !== id)
      })),
      comparisonList: [],
      toggleComparison: (id) => set((state) => ({
        comparisonList: state.comparisonList.includes(id)
          ? state.comparisonList.filter(cid => cid !== id)
          : state.comparisonList.length < 4 ? [...state.comparisonList, id] : state.comparisonList
      })),
      clearComparison: () => set({ comparisonList: [] }),
      
      isAuthModalOpen: false,
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      isAdminPanelOpen: false,
      setAdminPanelOpen: (open) => set({ isAdminPanelOpen: open }),
      isAdminLoginModalOpen: false,
      setAdminLoginModalOpen: (open) => set({ isAdminLoginModalOpen: open }),
      isAdminMode: false,
      toggleAdminMode: (enabled) => set({ isAdminMode: enabled }),
      activeAdminTab: "builder",
      setActiveAdminTab: (tab) => set({ activeAdminTab: tab }),
      content: {
        "hero.subtitle": "L'Excellence au Maroc",
        "hero.title1": "VOTRE RÉSIDENCE",
        "hero.title2": "D'EXCEPTION",
        "hero.description": "Découvrez une collection exclusive de villas et d'appartements de prestige à travers le Maroc. Une expérience sur mesure pour une clientèle exigeante.",
        "trust.title": "L'Excellence Sans Compromis",
        "trust.desc": "Notre engagement envers la perfection se reflète dans chaque détail de votre séjour.",
        "concierge.title": "Services de Conciergerie",
        "concierge.desc": "Une équipe dédiée à votre service 24/7 pour répondre à toutes vos exigences.",
        "destinations.title": "Destinations Prisées",
        "destinations.desc": "Explorez nos propriétés dans les lieux les plus exclusifs du Maroc.",
        "budget.title": "Parcourir par Budget",
        "budget.desc": "Trouvez la propriété idéale correspondant à vos attentes.",
        "ai.title": "Recommandations Intelligentes",
        "ai.desc": "Notre IA analyse vos préférences pour vous proposer les meilleures options.",
        "client.welcome": "Bienvenue dans votre espace Riviera",
        "client.overview": "Aperçu de votre activité",
      },
      updateContent: (key, value) => set((state) => ({ content: { ...state.content, [key]: value } })),
      homepageSections: [
        "hero",
        "browseByBudget",
        "aiRecommendations",
        "propertyGrid",
        "exploreDestinations",
        "trendingStays",
        "travelPlanner",
        "weekendDeals",
        "conciergeServices",
        "trustSection",
        "listPropertyCTA",
        "mapSection",
        "testimonials",
        "statsSection",
        "lifestyleGallery",
        "newsletter"
      ],
      reorderSections: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.homepageSections);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { homepageSections: result };
      }),
      isAdminUnlocked: false,
      unlockAdmin: (code) => {
        if (code === "RIVIERA2024") {
          set({ isAdminUnlocked: true });
          return true;
        }
        return false;
      },
      selectedPropertyId: null,
      setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
      isComparisonModalOpen: false,
      setComparisonModalOpen: (open) => set({ isComparisonModalOpen: open }),
      
      notifications: [],
      addNotification: (message, type) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ notifications: [...state.notifications, { id, message, type }] }));
        setTimeout(() => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })), 5000);
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),
 
      lastVisitedService: null,
      setLastVisitedService: (service) => set({ lastVisitedService: service }),
      isPropertiesPageOpen: false,
      setPropertiesPageOpen: (open) => set({ 
        isPropertiesPageOpen: open,
        isChefPrivePageOpen: false,
        isGestionImmobilierePageOpen: false,
        isShortTermRentalsOpen: false,
        isAirportTransferOpen: false,
        isClientDashboardOpen: false,
        isOwnerDashboardOpen: false,
        isAdminMode: false
      }),

      isChefPrivePageOpen: false,
      setChefPrivePageOpen: (open) => set({
        isChefPrivePageOpen: open,
        isPropertiesPageOpen: false,
        isGestionImmobilierePageOpen: false,
        isShortTermRentalsOpen: false,
        isAirportTransferOpen: false,
        isClientDashboardOpen: false,
        isOwnerDashboardOpen: false,
        isAdminMode: false
      }),

      isGestionImmobilierePageOpen: false,
      setGestionImmobilierePageOpen: (open) => set({
        isGestionImmobilierePageOpen: open,
        isChefPrivePageOpen: false,
        isPropertiesPageOpen: false,
        isShortTermRentalsOpen: false,
        isAirportTransferOpen: false,
        isClientDashboardOpen: false,
        isOwnerDashboardOpen: false,
        isAdminMode: false
      }),

      isShortTermRentalsOpen: false,
      setShortTermRentalsOpen: (open) => set({
        isShortTermRentalsOpen: open,
        isGestionImmobilierePageOpen: false,
        isChefPrivePageOpen: false,
        isPropertiesPageOpen: false,
        isAirportTransferOpen: false,
        isClientDashboardOpen: false,
        isOwnerDashboardOpen: false,
        isAdminMode: false
      }),
      
      isAirportTransferOpen: false,
      setAirportTransferOpen: (open) => set({
        isAirportTransferOpen: open,
        isShortTermRentalsOpen: false,
        isGestionImmobilierePageOpen: false,
        isChefPrivePageOpen: false,
        isPropertiesPageOpen: false,
        isClientDashboardOpen: false,
        isOwnerDashboardOpen: false,
        isAdminMode: false
      }),
 
      isQuickViewOpen: false,
      setQuickViewOpen: (open) => set({ isQuickViewOpen: open }),
      quickViewPropertyId: null,
      setQuickViewPropertyId: (id) => set({ quickViewPropertyId: id }),
      isMapViewOpen: false,
      setMapViewOpen: (open) => set({ isMapViewOpen: open }),
      sortBy: "relevant",
      setSortBy: (sortBy) => set({ sortBy }),
 
      theme: "light",
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
 
      isOwnerDashboardOpen: false,
      setOwnerDashboardOpen: (open) => set({ isOwnerDashboardOpen: open }),
      activeOwnerTab: "overview",
      setActiveOwnerTab: (tab) => set({ activeOwnerTab: tab }),
      ownerListings: [],
      setOwnerListings: (listings) => set({ ownerListings: listings }),
      ownerMessages: [],
      ownerBookings: [],
      ownerNotifications: [],
 
      isClientDashboardOpen: false,
      setClientDashboardOpen: (open) => set({ isClientDashboardOpen: open }),
      isAdvancedSearchOpen: false,
      setAdvancedSearchOpen: (open) => set({ isAdvancedSearchOpen: open }),
      activeClientTab: "overview",
      setActiveClientTab: (tab) => set({ activeClientTab: tab }),
      clientBookings: [],
      addClientBooking: (booking) => set((state) => ({ clientBookings: [booking, ...state.clientBookings] })),
      clientConversations: [],
      addClientMessage: (conversationId, message) => set((state) => ({
        clientConversations: state.clientConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, messages: [...conv.messages, message], lastMessage: message.content, lastMessageTime: message.timestamp }
            : conv
        )
      })),
      clientNotifications: [],
      markNotificationAsRead: (id) => set((state) => ({
        clientNotifications: state.clientNotifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      })),
    }),
    {
      name: "riviera-storage",
      partialize: (state) => ({ 
        favorites: state.favorites, 
        user: state.user, 
        lastVisitedService: state.lastVisitedService,
        cart: state.cart,
        recentlyViewed: state.recentlyViewed,
        savedSearches: state.savedSearches,
        isAdminUnlocked: state.isAdminUnlocked,
        theme: state.theme,
        clientBookings: state.clientBookings,
        clientConversations: state.clientConversations,
        clientNotifications: state.clientNotifications,
        properties: state.properties,
        ownerListings: state.ownerListings,
        organizedTrips: state.organizedTrips,
        userBehaviorTracking: state.userBehaviorTracking,
        chefs: state.chefs,
        chefBookings: state.chefBookings
      }),
    }
  )
);
