import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { Plus, Edit2, Trash2, Plane, Car, Search, Filter, Compass } from "lucide-react";
import { Button } from "@/src/components/ui/BaseComponents";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Select } from "@/src/components/ui/Select";
import { Flight, TransferVehicle, Tour } from "@/src/types";

export const AdminFlights = () => {
  const { 
    flights, addFlight, updateFlight, deleteFlight, deleteFlights,
    transferVehicles, addTransferVehicle, updateTransferVehicle, deleteTransferVehicle, deleteTransferVehicles,
    tours, addTour, updateTour, deleteTour, deleteTours,
    flightRequests, updateFlightRequest, deleteFlightRequest, deleteFlightRequests,
    drivers, addDriver, updateDriver, deleteDriver,
    commissionSettings, updateCommissionSettings,
    addNotification 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<"flights" | "transfers" | "tours" | "requests" | "drivers" | "commissions">("flights");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Flight Form State
  const [flightData, setFlightData] = useState<Partial<Flight>>({
    type: "commercial",
    airlineName: "",
    flightNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    capacity: 1,
    image: "https://picsum.photos/seed/flight/800/500",
    status: "active"
  });

  // Transfer Form State
  const [transferData, setTransferData] = useState<Partial<TransferVehicle>>({
    name: "",
    category: "business",
    image: "https://picsum.photos/seed/car/800/500",
    capacity: 3,
    pricingModel: "fixed",
    baseFare: 0,
    status: "active"
  });

  // Tour Form State
  const [tourData, setTourData] = useState<Partial<Tour>>({
    title: "",
    description: "",
    images: ["https://picsum.photos/seed/tour/800/500"],
    duration: "",
    price: 0,
    maxParticipants: 10,
    category: "cultural",
    rating: 5.0,
    status: "active"
  });

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightData.departure || !flightData.arrival) {
      addNotification("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (editingId) {
      updateFlight(editingId, flightData);
      addNotification("Vol mis à jour avec succès", "success");
    } else {
      addFlight({
        ...flightData,
        id: Math.random().toString(36).substr(2, 9),
      } as Flight);
      addNotification("Nouveau vol ajouté", "success");
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.name || !transferData.baseFare) {
      addNotification("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (editingId) {
      updateTransferVehicle(editingId, transferData);
      addNotification("Véhicule mis à jour avec succès", "success");
    } else {
      addTransferVehicle({
        ...transferData,
        id: Math.random().toString(36).substr(2, 9),
      } as TransferVehicle);
      addNotification("Nouveau véhicule ajouté", "success");
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourData.title || !tourData.price) {
      addNotification("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (editingId) {
      updateTour(editingId, tourData);
      addNotification("Expérience mise à jour avec succès", "success");
    } else {
      addTour({
        ...tourData,
        id: Math.random().toString(36).substr(2, 9),
      } as Tour);
      addNotification("Nouvelle expérience ajoutée", "success");
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditFlight = (flight: Flight) => {
    setFlightData(flight);
    setEditingId(flight.id);
    setIsAdding(true);
  };

  const handleEditTransfer = (vehicle: TransferVehicle) => {
    setTransferData(vehicle);
    setEditingId(vehicle.id);
    setIsAdding(true);
  };

  const handleEditTour = (tour: Tour) => {
    setTourData(tour);
    setEditingId(tour.id);
    setIsAdding(true);
  };

  const handleDeleteFlight = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce vol ?")) {
      deleteFlight(id);
      addNotification("Vol supprimé", "info");
    }
  };

  const handleDeleteTransfer = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      deleteTransferVehicle(id);
      addNotification("Véhicule supprimé", "info");
    }
  };

  const handleDeleteTour = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      deleteTour(id);
      addNotification("Expérience supprimée", "info");
    }
  };

  const handleConvertRequest = (req: any) => {
    if (req.type === "custom") {
      setFlightData({
        type: "private_jet",
        departure: req.departure,
        arrival: req.arrival,
        capacity: req.passengers,
        status: "active",
        price: req.quotePrice || 0
      });
      setActiveTab("flights");
      setIsAdding(true);
      updateFlightRequest(req.id, { status: "converted" });
      addNotification("Demande convertie en vol. Veuillez compléter les détails.", "info");
    }
  };

  const toggleSelectAll = () => {
    let allIds: string[] = [];
    if (activeTab === "flights") allIds = flights.map(f => f.id);
    if (activeTab === "transfers") allIds = transferVehicles.map(v => v.id);
    if (activeTab === "tours") allIds = tours.map(t => t.id);
    if (activeTab === "requests") allIds = flightRequests.map(r => r.id);
    if (activeTab === "drivers") allIds = drivers.map(d => d.id);

    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    if (activeTab === "flights") deleteFlights(selectedIds);
    if (activeTab === "transfers") deleteTransferVehicles(selectedIds);
    if (activeTab === "tours") deleteTours(selectedIds);
    if (activeTab === "requests") deleteFlightRequests(selectedIds);
    if (activeTab === "drivers") {
      selectedIds.forEach(id => deleteDriver(id));
    }

    addNotification(`${selectedIds.length} éléments supprimés`, "success");
    setSelectedIds([]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-luxury-black dark:text-white mb-2">Orchestration Voyage</h1>
          <p className="text-neutral-500">Gérez les vols, transferts et expériences.</p>
        </div>
        <Button onClick={() => {
          setIsAdding(true);
          setEditingId(null);
          if (activeTab === "flights") setFlightData({ type: "commercial", status: "active" });
          if (activeTab === "transfers") setTransferData({ category: "business", status: "active" });
          if (activeTab === "tours") setTourData({ category: "cultural", status: "active" });
        }} className="flex items-center gap-2">
          <Plus size={18} /> Ajouter {activeTab === "flights" ? "un Vol" : activeTab === "transfers" ? "un Véhicule" : "une Expérience"}
        </Button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 overflow-x-auto">
        <button 
          onClick={() => { setActiveTab("flights"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "flights" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Plane size={18} /> Vols
        </button>
        <button 
          onClick={() => { setActiveTab("transfers"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "transfers" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Car size={18} /> Transferts
        </button>
        <button 
          onClick={() => { setActiveTab("tours"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "tours" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Compass size={18} /> Expériences
        </button>
        <button 
          onClick={() => { setActiveTab("requests"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "requests" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Search size={18} /> Demandes
        </button>
        <button 
          onClick={() => { setActiveTab("drivers"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "drivers" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Car size={18} /> Chauffeurs
        </button>
        <button 
          onClick={() => { setActiveTab("commissions"); setIsAdding(false); setSelectedIds([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === "commissions" ? "bg-luxury-gold text-white" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        >
          <Filter size={18} /> Commissions
        </button>
      </div>

      {isAdding && activeTab === "flights" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-800 mb-8">
          <h2 className="text-xl font-bold mb-6">{editingId ? "Modifier le vol" : "Nouveau vol"}</h2>
          <form onSubmit={handleFlightSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Type de vol</label>
                <Select
                  value={flightData.type || "commercial"}
                  onChange={(val) => setFlightData({ ...flightData, type: val as any })}
                  options={[
                    { value: "commercial", label: "Commercial" },
                    { value: "private_jet", label: "Jet Privé" },
                    { value: "helicopter", label: "Hélicoptère" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Statut</label>
                <Select
                  value={flightData.status || "active"}
                  onChange={(val) => setFlightData({ ...flightData, status: val as any })}
                  options={[
                    { value: "active", label: "Actif" },
                    { value: "inactive", label: "Inactif" },
                    { value: "sold_out", label: "Complet" },
                    { value: "expired", label: "Expiré" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Départ</label>
                <input
                  type="text"
                  value={flightData.departure}
                  onChange={(e) => setFlightData({ ...flightData, departure: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: Paris (CDG)"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Arrivée</label>
                <input
                  type="text"
                  value={flightData.arrival}
                  onChange={(e) => setFlightData({ ...flightData, arrival: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: Marrakech (RAK)"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Compagnie / Opérateur</label>
                <input
                  type="text"
                  value={flightData.airlineName || ""}
                  onChange={(e) => setFlightData({ ...flightData, airlineName: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: Royal Air Maroc"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Numéro de vol</label>
                <input
                  type="text"
                  value={flightData.flightNumber || ""}
                  onChange={(e) => setFlightData({ ...flightData, flightNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: AT 789"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Prix de base (€)</label>
                <input
                  type="number"
                  value={flightData.price}
                  onChange={(e) => setFlightData({ ...flightData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Inventaire (Places dispo)</label>
                <input
                  type="number"
                  value={flightData.inventory || 0}
                  onChange={(e) => setFlightData({ ...flightData, inventory: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={flightData.tags?.join(', ') || ""}
                  onChange={(e) => setFlightData({ ...flightData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: best-value, direct, premium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Capacité</label>
                <input
                  type="number"
                  value={flightData.capacity}
                  onChange={(e) => setFlightData({ ...flightData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Classes de sièges</label>
                <div className="space-y-4">
                  {['economy', 'business', 'first'].map(type => {
                    const existingClass = flightData.seatClasses?.find(sc => sc.type === type);
                    return (
                      <div key={type} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="w-32 font-bold capitalize">{type}</div>
                        <input
                          type="number"
                          placeholder="Prix (€)"
                          value={existingClass?.price || ''}
                          onChange={(e) => {
                            const newClasses = [...(flightData.seatClasses || [])];
                            const idx = newClasses.findIndex(sc => sc.type === type);
                            if (idx >= 0) {
                              newClasses[idx] = { ...newClasses[idx], price: Number(e.target.value) };
                            } else {
                              newClasses.push({ type: type as any, price: Number(e.target.value), availableSeats: 0 });
                            }
                            setFlightData({ ...flightData, seatClasses: newClasses });
                          }}
                          className="w-32 px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                        />
                        <input
                          type="number"
                          placeholder="Sièges dispo"
                          value={existingClass?.availableSeats || ''}
                          onChange={(e) => {
                            const newClasses = [...(flightData.seatClasses || [])];
                            const idx = newClasses.findIndex(sc => sc.type === type);
                            if (idx >= 0) {
                              newClasses[idx] = { ...newClasses[idx], availableSeats: Number(e.target.value) };
                            } else {
                              newClasses.push({ type: type as any, price: 0, availableSeats: Number(e.target.value) });
                            }
                            setFlightData({ ...flightData, seatClasses: newClasses });
                          }}
                          className="w-32 px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </div>
      )}

      {isAdding && activeTab === "transfers" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-800 mb-8">
          <h2 className="text-xl font-bold mb-6">{editingId ? "Modifier le véhicule" : "Nouveau véhicule"}</h2>
          <form onSubmit={handleTransferSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Nom du véhicule</label>
                <input
                  type="text"
                  value={transferData.name}
                  onChange={(e) => setTransferData({ ...transferData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: Mercedes Classe S"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Catégorie</label>
                <Select
                  value={transferData.category || "business"}
                  onChange={(val) => setTransferData({ ...transferData, category: val as any })}
                  options={[
                    { value: "economy", label: "Économique" },
                    { value: "business", label: "Business" },
                    { value: "luxury", label: "Luxe" },
                    { value: "van", label: "Van / Groupe" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Prix de base (€)</label>
                <input
                  type="number"
                  value={transferData.baseFare}
                  onChange={(e) => setTransferData({ ...transferData, baseFare: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Capacité</label>
                <input
                  type="number"
                  value={transferData.capacity}
                  onChange={(e) => setTransferData({ ...transferData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Chauffeur assigné</label>
                <Select
                  value={transferData.driverId || ""}
                  onChange={(val) => setTransferData({ ...transferData, driverId: val })}
                  options={[
                    { value: "", label: "Aucun" },
                    ...drivers.map(d => ({ value: d.id, label: d.name }))
                  ]}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Règles de tarification avancées</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Prix par Km (€)</label>
                    <input
                      type="number"
                      value={transferData.pricingRules?.perKm || 0}
                      onChange={(e) => setTransferData({ ...transferData, pricingRules: { ...transferData.pricingRules, perKm: Number(e.target.value), baseFare: transferData.baseFare || 0, perMinute: transferData.pricingRules?.perMinute || 0, demandMultiplier: transferData.pricingRules?.demandMultiplier || 1 } })}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Prix par Minute (€)</label>
                    <input
                      type="number"
                      value={transferData.pricingRules?.perMinute || 0}
                      onChange={(e) => setTransferData({ ...transferData, pricingRules: { ...transferData.pricingRules, perMinute: Number(e.target.value), baseFare: transferData.baseFare || 0, perKm: transferData.pricingRules?.perKm || 0, demandMultiplier: transferData.pricingRules?.demandMultiplier || 1 } })}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Multiplicateur de demande</label>
                    <input
                      type="number"
                      step="0.1"
                      value={transferData.pricingRules?.demandMultiplier || 1}
                      onChange={(e) => setTransferData({ ...transferData, pricingRules: { ...transferData.pricingRules, demandMultiplier: Number(e.target.value), baseFare: transferData.baseFare || 0, perKm: transferData.pricingRules?.perKm || 0, perMinute: transferData.pricingRules?.perMinute || 0 } })}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </div>
      )}

      {isAdding && activeTab === "tours" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-800 mb-8">
          <h2 className="text-xl font-bold mb-6">{editingId ? "Modifier l'expérience" : "Nouvelle expérience"}</h2>
          <form onSubmit={handleTourSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Titre</label>
                <input
                  type="text"
                  value={tourData.title}
                  onChange={(e) => setTourData({ ...tourData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: Visite Historique"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Catégorie</label>
                <Select
                  value={tourData.category || "cultural"}
                  onChange={(val) => setTourData({ ...tourData, category: val as any })}
                  options={[
                    { value: "cultural", label: "Culturel" },
                    { value: "adventure", label: "Aventure" },
                    { value: "gastronomy", label: "Gastronomie" },
                    { value: "wellness", label: "Bien-être" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Prix (€)</label>
                <input
                  type="number"
                  value={tourData.price}
                  onChange={(e) => setTourData({ ...tourData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Durée</label>
                <input
                  type="text"
                  value={tourData.duration}
                  onChange={(e) => setTourData({ ...tourData, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  placeholder="Ex: 3 heures"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Capacité max</label>
                <input
                  type="number"
                  value={tourData.maxParticipants}
                  onChange={(e) => setTourData({ ...tourData, maxParticipants: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                <textarea
                  value={tourData.description}
                  onChange={(e) => setTourData({ ...tourData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-luxury-gold outline-none"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Disponibilités (Créneaux par date)</label>
                <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  {tourData.availability?.map((avail, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between">
                        <input
                          type="date"
                          value={avail.date}
                          onChange={(e) => {
                            const newAvail = [...(tourData.availability || [])];
                            newAvail[idx].date = e.target.value;
                            setTourData({ ...tourData, availability: newAvail });
                          }}
                          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                        />
                        <button type="button" onClick={() => {
                          const newAvail = [...(tourData.availability || [])];
                          newAvail.splice(idx, 1);
                          setTourData({ ...tourData, availability: newAvail });
                        }} className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {avail.slots.map((slot, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <input
                              type="time"
                              value={slot.time}
                              onChange={(e) => {
                                const newAvail = [...(tourData.availability || [])];
                                newAvail[idx].slots[sIdx].time = e.target.value;
                                setTourData({ ...tourData, availability: newAvail });
                              }}
                              className="w-24 px-2 py-1 text-sm bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700"
                            />
                            <input
                              type="number"
                              placeholder="Places"
                              value={slot.available}
                              onChange={(e) => {
                                const newAvail = [...(tourData.availability || [])];
                                newAvail[idx].slots[sIdx].available = Number(e.target.value);
                                setTourData({ ...tourData, availability: newAvail });
                              }}
                              className="w-20 px-2 py-1 text-sm bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700"
                            />
                            <button type="button" onClick={() => {
                              const newAvail = [...(tourData.availability || [])];
                              newAvail[idx].slots.splice(sIdx, 1);
                              setTourData({ ...tourData, availability: newAvail });
                            }} className="text-red-500 hover:text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                          const newAvail = [...(tourData.availability || [])];
                          newAvail[idx].slots.push({ time: "10:00", available: tourData.maxParticipants || 10 });
                          setTourData({ ...tourData, availability: newAvail });
                        }}>+ Créneau</Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => {
                    const newAvail = [...(tourData.availability || [])];
                    newAvail.push({ date: new Date().toISOString().split('T')[0], slots: [{ time: "10:00", available: tourData.maxParticipants || 10 }] });
                    setTourData({ ...tourData, availability: newAvail });
                  }}>+ Ajouter une date</Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </div>
      )}

      {/* List Views */}
      {!isAdding && activeTab === "flights" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === flights.length && flights.length > 0 ? "Tout désélectionner" : "Sélectionner tout"}
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBulkDelete}>
                  Supprimer la sélection ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm outline-none" />
              </div>
              <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filtrer</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {flights.map(flight => (
              <div key={flight.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(flight.id)}
                    onChange={() => toggleSelect(flight.id)}
                    className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold" 
                  />
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <ImagePlaceholder src={flight.image || flight.airlineLogo || "https://picsum.photos/seed/flight/400/300"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{flight.departure} ➔ {flight.arrival}</h3>
                    <p className="text-sm text-neutral-500 capitalize">{flight.type.replace('_', ' ')} • {flight.airlineName || 'N/A'}</p>
                    <div className="flex gap-2 mt-1">
                      {flight.tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-500">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-luxury-gold">€{flight.price}</div>
                    <div className="text-xs text-neutral-400">{flight.status} • {flight.inventory || 0} places</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditFlight(flight)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteFlight(flight.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdding && activeTab === "transfers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === transferVehicles.length && transferVehicles.length > 0 ? "Tout désélectionner" : "Sélectionner tout"}
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBulkDelete}>
                  Supprimer la sélection ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm outline-none" />
              </div>
              <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filtrer</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {transferVehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(vehicle.id)}
                    onChange={() => toggleSelect(vehicle.id)}
                    className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold" 
                  />
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <ImagePlaceholder src={vehicle.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{vehicle.name}</h3>
                    <p className="text-sm text-neutral-500 capitalize">{vehicle.category} • {vehicle.capacity} places</p>
                    {vehicle.driverId && (
                      <p className="text-xs text-luxury-gold mt-1">Chauffeur: {drivers.find(d => d.id === vehicle.driverId)?.name || 'Inconnu'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-luxury-gold">€{vehicle.baseFare}</div>
                    <div className="text-xs text-neutral-400">{vehicle.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTransfer(vehicle)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteTransfer(vehicle.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdding && activeTab === "tours" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === tours.length && tours.length > 0 ? "Tout désélectionner" : "Sélectionner tout"}
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBulkDelete}>
                  Supprimer la sélection ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm outline-none" />
              </div>
              <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filtrer</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tours.map(tour => (
              <div key={tour.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(tour.id)}
                    onChange={() => toggleSelect(tour.id)}
                    className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold" 
                  />
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <ImagePlaceholder src={tour.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{tour.title}</h3>
                    <p className="text-sm text-neutral-500 capitalize">{tour.category} • {tour.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-luxury-gold">€{tour.price}</div>
                    <div className="text-xs text-neutral-400">{tour.status} • Max {tour.maxParticipants} pers.</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTour(tour)} className="p-2 text-neutral-400 hover:text-luxury-gold transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteTour(tour.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdding && activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === flightRequests.length && flightRequests.length > 0 ? "Tout désélectionner" : "Sélectionner tout"}
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBulkDelete}>
                  Supprimer la sélection ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm outline-none" />
              </div>
              <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filtrer</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {flightRequests.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">Aucune demande pour le moment.</p>
            ) : (
              flightRequests.map(req => (
                <div key={req.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleSelect(req.id)}
                      className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold" 
                    />
                    <div>
                      <h3 className="font-bold">Demande #{req.id}</h3>
                      <p className="text-sm text-neutral-500">
                        {req.type === "custom" ? `Vol sur mesure: ${req.departure} ➔ ${req.arrival}` : `Vol existant: ${req.flightNumber} vers ${req.destination}`}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">Passagers: {req.passengers} • Date: {req.date || req.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'converted' ? 'bg-blue-100 text-blue-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : req.status === 'flagged' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {req.status}
                    </span>
                    {req.status === 'pending' && req.type === 'custom' && (
                      <Button variant="outline" size="sm" onClick={() => handleConvertRequest(req)}>Convertir en vol</Button>
                    )}
                    {req.status === 'pending' && req.type === 'already_have' && (
                      <Button variant="outline" size="sm" onClick={() => {
                        updateFlightRequest(req.id, { status: "quoted" });
                        addNotification("Demande approuvée", "success");
                      }}>Approuver</Button>
                    )}
                    {req.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                          updateFlightRequest(req.id, { status: "rejected" });
                          addNotification("Demande rejetée", "info");
                        }}>Rejeter</Button>
                        <Button variant="outline" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => {
                          updateFlightRequest(req.id, { status: "flagged" });
                          addNotification("Demande signalée", "info");
                        }}>Signaler</Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">Détails</Button>
                    <button onClick={() => {
                      if (window.confirm("Supprimer cette demande ?")) {
                        deleteFlightRequest(req.id);
                        addNotification("Demande supprimée", "info");
                      }
                    }} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {!isAdding && activeTab === "drivers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === drivers.length && drivers.length > 0 ? "Tout désélectionner" : "Sélectionner tout"}
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBulkDelete}>
                  Supprimer la sélection ({selectedIds.length})
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm outline-none" />
              </div>
              <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filtrer</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {drivers.map(driver => (
              <div key={driver.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(driver.id)}
                    onChange={() => toggleSelect(driver.id)}
                    className="w-5 h-5 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold" 
                  />
                  <div>
                    <h3 className="font-bold">{driver.name}</h3>
                    <p className="text-sm text-neutral-500">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-luxury-gold">★ {driver.rating}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                    {driver.status}
                  </span>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdding && activeTab === "commissions" && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold mb-6">Paramètres de Commission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Vols (%)</label>
              <input 
                type="number" 
                value={commissionSettings.flightMarginPercent}
                onChange={(e) => updateCommissionSettings({ flightMarginPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Transferts (%)</label>
              <input 
                type="number" 
                value={commissionSettings.transferMarginPercent}
                onChange={(e) => updateCommissionSettings({ transferMarginPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Expériences (%)</label>
              <input 
                type="number" 
                value={commissionSettings.tourMarginPercent}
                onChange={(e) => updateCommissionSettings({ tourMarginPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Propriétés (%)</label>
              <input 
                type="number" 
                value={commissionSettings.propertyMarginPercent}
                onChange={(e) => updateCommissionSettings({ propertyMarginPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => addNotification("Paramètres sauvegardés", "success")}>Sauvegarder</Button>
          </div>
        </div>
      )}
    </div>
  );
};
