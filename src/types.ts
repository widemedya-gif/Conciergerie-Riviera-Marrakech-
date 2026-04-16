export type PropertyType = "Villa" | "Riad" | "Appartement" | "Studio" | "Tous";
export type BudgetCategory = "Budget" | "Standard" | "Premium" | "Luxe";
export type TravelIntent = "Luxury" | "Family" | "Business" | "Romantic" | "Adventure" | "Relax" | "Cultural";
export type LocationCategory = "urban" | "coastal" | "mountain" | "cultural";
export type TripDuration = "1 day" | "2 days" | "1 week" | "Tous";
export type ServiceCategory = "property" | "trip" | "experience" | "Tous";

export interface OrganizedTrip {
  id: string;
  title: string;
  destination: string;
  duration: TripDuration;
  price: number;
  includedServices: string[];
  activityTags: TravelIntent[];
  rating: number;
  images: string[];
  description: string;
  petFriendly: boolean;
}

export interface Location {
  id: string;
  city: string;
  region: string;
  category: LocationCategory;
  description?: string;
  image?: string;
}

export interface Property {
  id: string;
  title: string;
  city: string;
  region: string;
  neighborhood?: string;
  location: string; // Keep for backward compatibility or as full address
  price: number;
  rating: number;
  images: string[];
  isSuperhost: boolean;
  type: PropertyType;
  rentalType?: "short-term" | "long-term" | "sale";
  budgetCategory: BudgetCategory;
  category: string; // e.g., "luxury", "budget"
  travelIntents: TravelIntent[];
  amenities: string[];
  features?: string[];
  description: string;
  reviews: Review[];
  unavailableDates: string[]; // ISO strings
  matchScore?: number; // 0-100

  viewCountToday?: number;
  priceInsight?: "Good deal" | "Above average" | "Best value";
  size?: number; // in m2
  capacity: number;
  condition?: "Neuf" | "Bon état" | "Rénové" | "À rénover";
  view?: "Mer" | "Montagne" | "Jardin" | "Ville";
  floor?: number | "RDC" | "Dernier";
  furnished?: boolean;
  parking?: boolean;
  security?: boolean;
  pool?: boolean;
  garden?: boolean;
  terrace?: boolean;
  elevator?: boolean;
  petFriendly?: boolean;
  entirePlace?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SeatClass {
  type: "economy" | "business" | "first";
  price: number;
  availableSeats: number;
  margin?: number;
}

export interface Flight {
  id: string;
  type: "commercial" | "private_jet" | "helicopter" | "vtc";
  airlineName?: string;
  airlineLogo?: string;
  flightNumber?: string;
  departure: string;
  arrival: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  seatClasses?: SeatClass[];
  price?: number;
  margin?: number;
  capacity?: number;
  inventory?: number;
  image?: string;
  status: "active" | "inactive" | "sold_out" | "expired";
  tags?: string[];
  isFeatured?: boolean;
}

export interface TransferVehicle {
  id: string;
  name: string;
  category: "economy" | "business" | "luxury" | "vip" | "group" | "van";
  image: string;
  capacity: number;
  pricingModel: "fixed" | "distance" | "trip";
  baseFare: number;
  pricePerKm?: number;
  pricingRules?: {
    baseFare: number;
    perKm: number;
    perMinute: number;
    demandMultiplier: number;
  };
  margin?: number;
  driverId?: string;
  status: "active" | "inactive";
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  images: string[];
  duration: string;
  price: number;
  margin?: number;
  maxParticipants: number;
  schedule?: string[];
  availability?: {
    date: string;
    slots: { time: string; available: number }[];
  }[];
  category: "adventure" | "cultural" | "luxury" | "nightlife";
  rating: number;
  status: "active" | "inactive";
}

export interface FlightRequest {
  id: string;
  userId: string;
  type: "custom" | "already_have";
  departure?: string;
  arrival?: string;
  date?: string;
  returnDate?: string;
  isRoundTrip?: boolean;
  passengers?: number;
  class?: string;
  flightNumber?: string;
  airline?: string;
  airport?: string;
  terminal?: string;
  destination?: string;
  luggageCount?: {
    large: number;
    small: number;
  };
  specialRequirements?: string[];
  budgetRange?: string;
  status: "pending" | "quoted" | "converted" | "rejected" | "flagged";
  quotePrice?: number;
  createdAt: string;
  antiSpamToken?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleIds: string[];
  rating: number;
  status: "active" | "inactive" | "on_trip" | "offline";
  schedule?: {
    date: string;
    available: boolean;
    timeSlots?: string[];
  }[];
}

export interface CommissionSettings {
  flightMarginPercent: number;
  transferMarginPercent: number;
  tourMarginPercent: number;
  propertyMarginPercent: number;
}

export interface TravelBooking {
  id: string;
  userId: string;
  flightId?: string;
  seatClass?: string;
  transferId?: string;
  transferOptions?: { meetAndGreet: boolean; extraLuggage: boolean; childSeat: boolean };
  tourIds?: string[];
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  marginBreakdown: {
    flightMargin: number;
    transferMargin: number;
    toursMargin: number;
    totalMargin: number;
  };
  payouts: {
    operatorId?: string;
    operatorAmount: number;
    driverId?: string;
    driverAmount: number;
  };
  createdAt: string;
}

export type UserRole = "client" | "owner" | "chef";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  onboardingCompleted: boolean;
  token?: string;
  clientPreferences?: {
    preferredCities: string[];
    budgetRange: [number, number];
    propertyTypes: PropertyType[];
    amenities: string[];
  };
  ownerData?: {
    propertyType?: string;
    rentalType?: "short-term" | "long-term" | "sale";
    city?: string;
    propertyCount?: string;
  };
}

export interface SearchFilters {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  propertyType: PropertyType;
  priceRange: [number, number];
  budgetCategory: BudgetCategory | "Tous";
  amenities: string[];
  features?: string[];
  travelIntent?: TravelIntent;
  rentalType?: "short-term" | "long-term" | "sale";
  bedrooms?: number;
  bathrooms?: number;
  surface?: [number, number];
  listingType?: "rent" | "sale";
  query?: string;
  condition?: "Tous" | "Neuf" | "Bon état" | "Rénové" | "À rénover";
  view?: "Tous" | "Mer" | "Montagne" | "Jardin" | "Ville";
  floor?: number | "RDC" | "Dernier";
  furnished?: boolean;
  parking?: boolean;
  security?: boolean;
  pool?: boolean;
  garden?: boolean;
  terrace?: boolean;
  elevator?: boolean;
  yearBuilt?: number;
  petFriendly?: boolean;
  entirePlace?: boolean;
  tripType?: TravelIntent | "Tous";
  duration?: TripDuration;
  category?: ServiceCategory;
}

export type ListingStatus = "active" | "pending" | "draft" | "sold";

export interface OwnerListing extends Property {
  ownerId: string;
  status: ListingStatus;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
  type?: "text" | "inquiry";
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  propertyId?: string;
  propertyName?: string;
  messages: Message[];
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
  price: number;
  message?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "message" | "inquiry" | "alert" | "booking";
  timestamp: string;
  isRead: boolean;
}

export interface RecentlyViewed {
  propertyId: string;
  viewedAt: string;
}

export interface ChefMenu {
  id: string;
  title: string;
  description: string;
  pricePerPerson: number;
  tags: string[];
}

export interface Chef {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  city: string;
  isPremium: boolean;
  bio: string;
  philosophy: string;
  signatureDishes: string[];
  gallery: string[];
  menus: ChefMenu[];
}

export interface ChefBooking {
  id: string;
  chefId: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  locationType: "property" | "custom";
  locationAddress: string;
  menuId?: string;
  customRequest?: string;
  occasion?: string;
  kitchenEquipment?: string;
  clientPhone?: string;
  notes?: string;
  petFriendly: boolean;
  basePrice: number;
  extrasPrice: number;
  serviceFee: number;
  totalPrice: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
