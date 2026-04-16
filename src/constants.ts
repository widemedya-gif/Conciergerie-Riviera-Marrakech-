import { Property, Location, OrganizedTrip } from "./types";

export const ORGANIZED_TRIPS: OrganizedTrip[] = [
  {
    id: "trip-1",
    title: "Aventure dans le Désert de Merzouga",
    destination: "Sahara Desert",
    duration: "2 days",
    price: 1500,
    includedServices: ["Transport 4x4", "Guide", "Dîner sous les étoiles", "Nuit en bivouac de luxe"],
    activityTags: ["Adventure", "Cultural"],
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80"],
    description: "Vivez une expérience inoubliable au cœur des dunes de Merzouga. Un voyage magique avec nuit en campement de luxe.",
    petFriendly: false
  },
  {
    id: "trip-2",
    title: "Escapade Relaxante à Essaouira",
    destination: "Essaouira",
    duration: "1 day",
    price: 800,
    includedServices: ["Transport privé", "Déjeuner fruits de mer", "Visite de la Médina"],
    activityTags: ["Relax", "Cultural"],
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1577147443647-81856d5151af?auto=format&fit=crop&q=80"],
    description: "Découvrez la cité des alizés, ses remparts historiques et son port de pêche pittoresque.",
    petFriendly: true
  },
  {
    id: "trip-3",
    title: "Circuit Impérial: Fès et Chefchaouen",
    destination: "Chefchaouen",
    duration: "1 week",
    price: 4500,
    includedServices: ["Hébergement 5 étoiles", "Guide conférencier", "Demi-pension", "Transport VIP"],
    activityTags: ["Cultural", "Luxury"],
    rating: 5.0,
    images: ["https://images.unsplash.com/photo-1553587076-791722880775?auto=format&fit=crop&q=80"],
    description: "Un voyage dans le temps à travers les ruelles bleues de Chefchaouen et la médina millénaire de Fès.",
    petFriendly: false
  },
  {
    id: "trip-4",
    title: "Retraite Nature dans l'Atlas",
    destination: "Atlas mountains",
    duration: "2 days",
    price: 1200,
    includedServices: ["Randonnée guidée", "Repas berbères", "Nuit en écolodge"],
    activityTags: ["Adventure", "Relax"],
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80"],
    description: "Ressourcez-vous au cœur des montagnes de l'Atlas avec des vues panoramiques à couper le souffle.",
    petFriendly: true
  }
];

export const LOCATIONS: Location[] = [
  { id: "1", city: "Marrakech", region: "Marrakech-Safi", category: "cultural", description: "La ville rouge et ses jardins majestueux." },
  { id: "2", city: "Casablanca", region: "Casablanca-Settat", category: "urban", description: "Le cœur économique et moderne du Maroc." },
  { id: "3", city: "Rabat", region: "Rabat-Salé-Kénitra", category: "cultural", description: "La capitale administrative et ses monuments historiques." },
  { id: "4", city: "Tangier", region: "Tanger-Tétouan-Al Hoceïma", category: "coastal", description: "La porte de l'Afrique sur la Méditerranée." },
  { id: "5", city: "Agadir", region: "Souss-Massa", category: "coastal", description: "La perle du sud et ses plages infinies." },
  { id: "6", city: "Fes", region: "Fès-Meknès", category: "cultural", description: "La capitale spirituelle et sa médina millénaire." },
  { id: "7", city: "Essaouira", region: "Marrakech-Safi", category: "coastal", description: "La cité des alizés et son charme bohème." },
  { id: "8", city: "Chefchaouen", region: "Tanger-Tétouan-Al Hoceïma", category: "mountain", description: "La perle bleue nichée dans le Rif." },
  { id: "9", city: "Ouarzazate", region: "Drâa-Tafilalet", category: "mountain", description: "La porte du désert et ses kasbahs cinématographiques." },
  { id: "10", city: "Ifrane", region: "Fès-Meknès", category: "mountain", description: "La petite Suisse marocaine." }
];

export const PROPERTIES: Property[] = [];

export const SERVICES = [
  {
    id: "chef",
    title: "Chef Privé",
    description: "Cuisine marocaine et internationale exquise préparée dans votre villa.",
    image: ""
  },
  {
    id: "transfer",
    title: "Transfert Aéroport",
    description: "Accueil VIP et transport en véhicule de luxe.",
    image: ""
  },
  {
    id: "cars",
    title: "Voitures de Luxe",
    description: "Louez les derniers véhicules haut de gamme pour votre séjour.",
    image: ""
  },
  {
    id: "tours",
    title: "Visites Guidées",
    description: "Découvrez les joyaux cachés de Marrakech avec des guides experts.",
    image: ""
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "James Wilson",
    country: "Royaume-Uni",
    text: "Une expérience absolument sans faille. La villa était magnifique et le service de conciergerie a dépassé nos attentes.",
    photo: ""
  },
  {
    id: 2,
    name: "Elena Rossi",
    country: "Italie",
    text: "Marrakech est magique, mais Concierge Riviera l'a rendue inoubliable. Chaque détail a été géré avec un luxe pur.",
    photo: ""
  }
];
