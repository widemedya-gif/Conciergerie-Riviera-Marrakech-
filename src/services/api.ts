import { Property, SearchFilters } from "../types";

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Villa Majorelle",
    city: "Marrakech",
    region: "Marrakech-Safi",
    neighborhood: "Palmeraie",
    location: "Palmeraie, Marrakech",
    price: 1200,
    rating: 4.9,
    images: ["", "", ""],
    isSuperhost: true,
    type: "Villa",
    rentalType: "short-term",
    budgetCategory: "Luxe",
    category: "luxury",
    travelIntents: ["Luxury", "Romantic"],
    amenities: ["WiFi", "Piscine", "Parking", "Climatisation"],
    description: "Une villa d'exception au cœur de la Palmeraie.",
    reviews: [{ id: "r1", user: "Alice", rating: 5, comment: "Séjour incroyable !", date: "2024-03-01" }],
    unavailableDates: ["2024-04-10", "2024-04-11"],
    capacity: 8,
    petFriendly: true,
    entirePlace: true
  },
  {
    id: "2",
    title: "Riad El Fenn",
    city: "Marrakech",
    region: "Marrakech-Safi",
    neighborhood: "Médina",
    location: "Médina, Marrakech",
    price: 450,
    rating: 4.8,
    images: [""],
    isSuperhost: false,
    type: "Riad",
    rentalType: "short-term",
    budgetCategory: "Premium",
    category: "cultural",
    travelIntents: ["Romantic", "Adventure"],
    amenities: ["Spa", "WiFi", "Toit-terrasse", "Petit-déjeuner"],
    description: "Découvrez le charme authentique de la Médina dans ce Riad magnifiquement restauré.",
    reviews: [],
    unavailableDates: [],
    capacity: 6,
    petFriendly: false,
    entirePlace: true
  },
  {
    id: "3",
    title: "Appartement Vue Atlas",
    city: "Marrakech",
    region: "Marrakech-Safi",
    neighborhood: "Guéliz",
    location: "Guéliz, Marrakech",
    price: 150,
    rating: 4.7,
    images: [""],
    isSuperhost: true,
    type: "Appartement",
    rentalType: "long-term",
    budgetCategory: "Standard",
    category: "urban",
    travelIntents: ["Business"],
    amenities: ["Climatisation", "WiFi", "Parking", "Ascenseur"],
    description: "Appartement moderne avec une vue imprenable sur les montagnes de l'Atlas.",
    reviews: [],
    unavailableDates: [],
    capacity: 4,
    petFriendly: true,
    entirePlace: true
  },
  {
    id: "4",
    title: "Domaine Rose des Sables",
    city: "Ouarzazate",
    region: "Drâa-Tafilalet",
    neighborhood: "Centre",
    location: "Ouarzazate",
    price: 2500,
    rating: 5.0,
    images: [""],
    isSuperhost: true,
    type: "Villa",
    rentalType: "short-term",
    budgetCategory: "Luxe",
    category: "luxury",
    travelIntents: ["Luxury", "Adventure"],
    amenities: ["Piscine à débordement", "Salle de sport", "Cinéma", "Court de tennis"],
    description: "Le summum de la vie de luxe, avec en toile de fond la vallée de l'Ourika.",
    reviews: [],
    unavailableDates: [],
    capacity: 12
  },
  {
    id: "5",
    title: "Studio Médina Cosy",
    city: "Fes",
    region: "Fès-Meknès",
    neighborhood: "Médina",
    location: "Médina, Fès",
    price: 45,
    rating: 4.5,
    images: [""],
    isSuperhost: false,
    type: "Studio",
    rentalType: "short-term",
    budgetCategory: "Budget",
    category: "cultural",
    travelIntents: ["Adventure"],
    amenities: ["WiFi", "Cuisine équipée", "Climatisation"],
    description: "Un studio charmant et abordable au cœur de l'ancienne Médina.",
    reviews: [],
    unavailableDates: [],
    capacity: 2
  },
  {
    id: "6",
    title: "Appartement Familial Majorelle",
    city: "Casablanca",
    region: "Casablanca-Settat",
    neighborhood: "Anfa",
    location: "Anfa, Casablanca",
    price: 85,
    rating: 4.6,
    images: [""],
    isSuperhost: true,
    type: "Appartement",
    rentalType: "short-term",
    budgetCategory: "Budget",
    category: "urban",
    travelIntents: ["Family"],
    amenities: ["WiFi", "Parking", "Cuisine équipée", "Machine à laver"],
    description: "Appartement spacieux et économique, idéalement situé.",
    reviews: [],
    unavailableDates: [],
    capacity: 5
  }
];

export const propertyService = {
  fetchProperties: async (filters: SearchFilters): Promise<Property[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let filtered = [...MOCK_PROPERTIES];
    
    if (filters.location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    
    if (filters.propertyType !== "Tous") {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }

    if (filters.budgetCategory !== "Tous") {
      filtered = filtered.filter(p => p.budgetCategory === filters.budgetCategory);
    }
    
    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => filters.amenities.every(a => p.amenities.includes(a)));
    }

    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(p => filters.features!.every(f => p.features?.includes(f)));
    }
    
    if (filters.petFriendly) {
      filtered = filtered.filter(p => p.petFriendly === true);
    }

    if (filters.entirePlace) {
      filtered = filtered.filter(p => p.entirePlace === true);
    }

    if (filters.rentalType) {
      filtered = filtered.filter(p => p.rentalType === filters.rentalType);
    }
    
    return filtered;
  },
  
  getPropertyById: async (id: string): Promise<Property | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_PROPERTIES.find(p => p.id === id);
  },
  
  addProperty: async (property: Property): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    MOCK_PROPERTIES.unshift(property);
  }
};
