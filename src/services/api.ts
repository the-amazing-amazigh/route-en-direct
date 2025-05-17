
// Note: Ce fichier est très long et mériterait d'être refactorisé en plusieurs fichiers
// par domaine fonctionnel (auth, shipments, trucks, drivers, clients, locations, etc.)

import { mockShipments, findShipmentByTrackingId, getTruckDataForShipment, updateTruckPositions } from '../data/mockData';
import { Shipment, TruckData, ShipmentStatus, Location, Client, Vehicle } from '../types';

// Création d'une copie locale des envois pour pouvoir les modifier
let shipments = [...mockShipments];

// Liste des véhicules (camions et remorques)
let trucks = [
  { id: "truck-001", registration: "AB-123-CD", model: "Volvo FH16", year: 2022, type: "truck", status: "En service", carrierweb_id: "AB-123-CD", user_id: "user-001" },
  { id: "truck-002", registration: "EF-456-GH", model: "Mercedes Actros", year: 2021, type: "truck", status: "En service", carrierweb_id: "EF-456-GH", user_id: "user-001" },
  { id: "truck-003", registration: "IJ-789-KL", model: "Scania R450", year: 2020, type: "truck", status: "En maintenance", carrierweb_id: "IJ-789-KL", user_id: "user-001" },
  { id: "truck-004", registration: "MN-012-OP", model: "DAF XF", year: 2023, type: "truck", status: "En service", carrierweb_id: "MN-012-OP", user_id: "user-001" },
  { id: "truck-005", registration: "QR-345-ST", model: "Renault T High", year: 2022, type: "truck", status: "Disponible", carrierweb_id: "QR-345-ST", user_id: "user-001" },
  { id: "trailer-001", registration: "TR-123-AB", model: "Fruehauf", year: 2022, type: "trailer", status: "En service", user_id: "user-001" },
  { id: "trailer-002", registration: "TR-456-CD", model: "Schmitz", year: 2021, type: "trailer", status: "En service", user_id: "user-001" },
];

// Liste des chauffeurs
let drivers = [
  { id: "driver-001", name: "Jean Dupont", phone: "06 12 34 56 78", license: "Poids lourd", experience: "5 ans", status: "En service" },
  { id: "driver-002", name: "Marie Martin", phone: "06 23 45 67 89", license: "Super lourd", experience: "8 ans", status: "En service" },
  { id: "driver-003", name: "Paul Bernard", phone: "06 34 56 78 90", license: "Poids lourd", experience: "3 ans", status: "En repos" },
  { id: "driver-004", name: "Sophie Petit", phone: "06 45 67 89 01", license: "Super lourd", experience: "6 ans", status: "En congé" },
  { id: "driver-005", name: "Thomas Richard", phone: "06 56 78 90 12", license: "Poids lourd", experience: "4 ans", status: "En service" },
];

// Liste des lieux
let locations: Location[] = [
  {
    id: "location-001",
    name: "Entrepôt Paris",
    type: "pickup",
    address: "5 rue de la Logistique, 75001 Paris",
    position: { lat: 48.864716, lng: 2.349014 },
    radius: 500,
    active: true,
    user_id: null
  },
  {
    id: "location-002",
    name: "Terminal Calais",
    type: "ferry",
    address: "Port de Calais, 62100 Calais",
    position: { lat: 50.966667, lng: 1.850000 },
    radius: 1000,
    active: true,
    user_id: null
  },
  {
    id: "location-003",
    name: "Douane Belgique",
    type: "customs",
    address: "Poste frontière, 59000 Lille",
    position: { lat: 50.633333, lng: 3.066667 },
    radius: 500,
    active: true,
    user_id: null
  },
  {
    id: "location-004",
    name: "Plateforme Lyon",
    type: "delivery",
    address: "10 avenue de la Distribution, 69000 Lyon",
    position: { lat: 45.750000, lng: 4.850000 },
    radius: 500,
    active: true,
    user_id: null
  }
];

// Liste des clients
let clients: Client[] = [
  {
    id: "client-001",
    name: "Logistique Express",
    contact: "Pierre Martin",
    email: "contact@logistique-express.fr",
    phone: "01 23 45 67 89",
    address: "123 rue de la Livraison, 75008 Paris",
    notes: "Client premium. Livraisons prioritaires.",
    active: true,
    user_id: "user-001"
  },
  {
    id: "client-002",
    name: "Transport International",
    contact: "Sophie Dupuis",
    email: "info@transport-inter.com",
    phone: "01 98 76 54 32",
    address: "45 boulevard du Commerce, 69002 Lyon",
    notes: "",
    active: true,
    user_id: "user-001"
  },
  {
    id: "client-003",
    name: "MegaDistrib",
    contact: "Jean Leroy",
    email: "contact@megadistrib.fr",
    phone: "03 45 67 89 10",
    address: "78 avenue de l'Industrie, 59000 Lille",
    notes: "Demande notification par SMS à l'approche du camion.",
    active: true,
    user_id: "user-001"
  }
];

// API simulée pour récupérer un envoi par son ID de suivi
export const getShipmentByTrackingId = async (trackingId: string): Promise<Shipment | null> => {
  // Simuler la latence réseau
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const shipment = findShipmentByTrackingId(trackingId);
  if (!shipment) {
    return null;
  }
  
  return shipment;
};

// API simulée pour récupérer les données de camion pour un envoi
export const getTruckData = async (shipmentId: string): Promise<TruckData | null> => {
  // Simuler la latence réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const shipment = shipments.find(s => s.id === shipmentId);
  if (!shipment) {
    return null;
  }
  
  // Mettre à jour les positions des camions de façon aléatoire
  updateTruckPositions();
  
  // Récupérer les données du camion
  const truckData = getTruckDataForShipment(shipment);
  
  // Vérifier si le statut doit être mis à jour en fonction de la vitesse
  if (truckData && shipment.status !== ShipmentStatus.Livree) {
    // Si la vitesse est supérieure à 80 km/h, passer au statut "En transit"
    if (truckData.speed > 80 && shipment.status !== ShipmentStatus.EnTransit) {
      console.log(`Le camion ${shipment.truck.registration} roule à ${truckData.speed} km/h, passage en statut "En transit"`);
      shipment.status = ShipmentStatus.EnTransit;
      shipment.statusHistory.push({
        status: ShipmentStatus.EnTransit,
        timestamp: new Date().toISOString(),
        position: truckData.position
      });
    }
    
    // Vérifier si le camion est dans une zone de ferry
    const ferryLocations = locations.filter(loc => loc.type === "ferry" && loc.active);
    for (const loc of ferryLocations) {
      const distance = calculateDistance(
        truckData.position.lat, 
        truckData.position.lng, 
        loc.position.lat, 
        loc.position.lng
      );
      
      // Si le camion est dans le rayon du lieu de type ferry, passer au statut "En ferry"
      if (distance <= (loc.radius || 500) / 1000 && shipment.status !== ShipmentStatus.EnFerry) {
        console.log(`Le camion ${shipment.truck.registration} est dans la zone du ferry ${loc.name}, passage en statut "En ferry"`);
        shipment.status = ShipmentStatus.EnFerry;
        shipment.statusHistory.push({
          status: ShipmentStatus.EnFerry,
          timestamp: new Date().toISOString(),
          position: truckData.position
        });
      }
    }
    
    // Vérifier si le camion est dans une zone cliente (destination)
    const distToDestination = calculateDistance(
      truckData.position.lat,
      truckData.position.lng,
      shipment.destination.position.lat,
      shipment.destination.position.lng
    );
    
    if (distToDestination <= 0.5 && shipment.status !== ShipmentStatus.SurSiteClient) {
      console.log(`Le camion ${shipment.truck.registration} est arrivé sur le site client, passage en statut "Sur site client"`);
      shipment.status = ShipmentStatus.SurSiteClient;
      shipment.statusHistory.push({
        status: ShipmentStatus.SurSiteClient,
        timestamp: new Date().toISOString(),
        position: truckData.position
      });
    }
  }
  
  return truckData;
};

// Fonction utilitaire pour calculer la distance entre deux points GPS (en kilomètres)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// API simulée pour récupérer tous les envois (pour l'admin)
export const getAllShipments = async (): Promise<Shipment[]> => {
  // Simuler la latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return shipments;
};

// CRUD pour les livraisons (envois)
export const addShipment = async (shipmentData: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newShipment: any = {
    id: `shipment-${Date.now()}`,
    trackingId: shipmentData.trackingId,
    description: shipmentData.description,
    status: shipmentData.status,
    departureTime: new Date(shipmentData.departureTime).toISOString(),
    eta: new Date(shipmentData.eta).toISOString(),
    client: {
      id: `client-${Date.now()}`,
      name: shipmentData.clientName,
      email: "client@example.com",
      reference: `REF-${Math.floor(Math.random() * 100000)}`
    },
    origin: {
      id: `location-${Date.now()}-origin`,
      name: shipmentData.shipper,
      position: {
        lat: 48.8566 + (Math.random() * 2 - 1),
        lng: 2.3522 + (Math.random() * 2 - 1),
      },
      type: "pickup",
      plannedArrival: new Date(shipmentData.departureTime).toISOString(),
      actualArrival: null
    },
    destination: {
      id: `location-${Date.now()}-destination`,
      name: shipmentData.destination,
      position: {
        lat: 48.8566 + (Math.random() * 10 - 5),
        lng: 2.3522 + (Math.random() * 10 - 5),
      },
      type: "delivery",
      plannedArrival: new Date(shipmentData.eta).toISOString(),
      actualArrival: null
    },
    currentPosition: {
      lat: 48.8566 + (Math.random() * 5 - 2.5),
      lng: 2.3522 + (Math.random() * 5 - 2.5),
    },
    stops: [],
    currentStop: 0,
    truck: {
      id: shipmentData.truckId,
      registration: trucks.find(t => t.id === shipmentData.truckId)?.registration || "AB-123-CD"
    }
  };
  
  // Ajouter la remorque si elle est spécifiée
  if (shipmentData.trailerId) {
    const trailer = trucks.find(t => t.id === shipmentData.trailerId);
    if (trailer) {
      newShipment.trailer = {
        id: trailer.id,
        registration: trailer.registration
      };
    }
  }
  
  // Ajouter un chauffeur aléatoire
  const availableDrivers = drivers.filter(d => d.status === "En service");
  if (availableDrivers.length > 0) {
    const randomDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    newShipment.driver = {
      id: randomDriver.id,
      name: randomDriver.name
    };
  } else {
    newShipment.driver = {
      id: "driver-001",
      name: "Jean Dupont"
    };
  }
  
  // Initialiser l'historique des statuts
  newShipment.statusHistory = [{
    status: shipmentData.status,
    timestamp: new Date().toISOString(),
    position: newShipment.currentPosition
  }];
  
  shipments.push(newShipment);
  return newShipment;
};

export const updateShipment = async (id: string, shipmentData: any) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = shipments.findIndex(s => s.id === id);
  if (index !== -1) {
    // Si le statut a changé, ajouter une entrée à l'historique
    if (shipmentData.status !== shipments[index].status) {
      shipments[index].statusHistory.push({
        status: shipmentData.status,
        timestamp: new Date().toISOString(),
        position: shipments[index].currentPosition
      });
    }
    
    shipments[index] = {
      ...shipments[index],
      trackingId: shipmentData.trackingId || shipments[index].trackingId,
      description: shipmentData.description,
      status: shipmentData.status,
      departureTime: new Date(shipmentData.departureTime).toISOString(),
      eta: new Date(shipmentData.eta).toISOString(),
      client: {
        ...shipments[index].client,
        name: shipmentData.clientName,
      },
      origin: {
        ...shipments[index].origin,
        name: shipmentData.shipper,
      },
      destination: {
        ...shipments[index].destination,
        name: shipmentData.destination,
      },
    };
    
    // Mettre à jour le camion si spécifié
    if (shipmentData.truckId && shipmentData.truckId !== shipments[index].truck.id) {
      const truck = trucks.find(t => t.id === shipmentData.truckId);
      if (truck) {
        shipments[index].truck = {
          id: truck.id,
          registration: truck.registration
        };
      }
    }
    
    // Mettre à jour la remorque si spécifiée
    if (shipmentData.trailerId) {
      const trailer = trucks.find(t => t.id === shipmentData.trailerId && t.type === "trailer");
      if (trailer) {
        shipments[index].trailer = {
          id: trailer.id,
          registration: trailer.registration
        };
      }
    } else {
      // Supprimer la remorque si elle a été désélectionnée
      delete shipments[index].trailer;
    }
    
    return shipments[index];
  }
  return null;
};

export const deleteShipment = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = shipments.findIndex(s => s.id === id);
  if (index !== -1) {
    const deleted = shipments.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// CRUD pour les véhicules
export const getAllTrucks = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return trucks;
};

export const addTruck = async (truck: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Déterminer le type d'id en fonction du type de véhicule
  const idPrefix = truck.type === "truck" ? "truck" : "trailer";
  
  const newTruck = {
    id: `${idPrefix}-${Date.now()}`,
    ...truck,
    // Si c'est un camion et pas de carrierweb_id spécifié, utiliser l'immatriculation comme fallback
    carrierweb_id: truck.type === "truck" && !truck.carrierweb_id ? truck.registration : truck.carrierweb_id,
    user_id: "user-001" // Utilisateur actuellement connecté
  };
  
  trucks.push(newTruck);
  return newTruck;
};

export const updateTruck = async (id: string, truckData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = trucks.findIndex(t => t.id === id);
  if (index !== -1) {
    trucks[index] = { 
      ...trucks[index], 
      ...truckData,
      // Si c'est un camion et l'immatriculation a changé mais pas le carrierweb_id, mettre à jour le carrierweb_id
      carrierweb_id: trucks[index].type === "truck" && truckData.registration && !truckData.carrierweb_id 
        ? truckData.registration 
        : (truckData.carrierweb_id || trucks[index].carrierweb_id)
    };
    return trucks[index];
  }
  return null;
};

export const deleteTruck = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = trucks.findIndex(t => t.id === id);
  if (index !== -1) {
    const deleted = trucks.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// CRUD pour les chauffeurs
export const getAllDrivers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return drivers;
};

export const addDriver = async (driver: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newDriver = {
    id: `driver-${Date.now()}`,
    ...driver
  };
  drivers.push(newDriver);
  return newDriver;
};

export const updateDriver = async (id: string, driverData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = drivers.findIndex(d => d.id === id);
  if (index !== -1) {
    drivers[index] = { ...drivers[index], ...driverData };
    return drivers[index];
  }
  return null;
};

export const deleteDriver = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = drivers.findIndex(d => d.id === id);
  if (index !== -1) {
    const deleted = drivers.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// CRUD pour les lieux
export const getAllLocations = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return locations;
};

export const addLocation = async (locationData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newLocation: Location = {
    id: `location-${Date.now()}`,
    name: locationData.name,
    type: locationData.type,
    address: locationData.address,
    position: locationData.position,
    radius: locationData.radius || 500,
    active: locationData.active !== undefined ? locationData.active : true,
    user_id: "user-001" // Utilisateur actuellement connecté
  };
  
  locations.push(newLocation);
  return newLocation;
};

export const updateLocation = async (id: string, locationData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = locations.findIndex(l => l.id === id);
  if (index !== -1) {
    locations[index] = { ...locations[index], ...locationData };
    return locations[index];
  }
  return null;
};

export const deleteLocation = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = locations.findIndex(l => l.id === id);
  if (index !== -1) {
    const deleted = locations.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// CRUD pour les clients
export const getAllClients = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return clients;
};

export const addClient = async (clientData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newClient: Client = {
    id: `client-${Date.now()}`,
    name: clientData.name,
    contact: clientData.contact,
    email: clientData.email,
    phone: clientData.phone,
    address: clientData.address,
    notes: clientData.notes || "",
    active: clientData.active !== undefined ? clientData.active : true,
    user_id: "user-001" // Utilisateur actuellement connecté
  };
  
  clients.push(newClient);
  return newClient;
};

export const updateClient = async (id: string, clientData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...clientData };
    return clients[index];
  }
  return null;
};

export const deleteClient = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    const deleted = clients.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// Gestion des utilisateurs pour le SaaS

// Récupérer tous les utilisateurs (pour l'admin)
export const getAllUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  return allUsers;
};

// Mettre à jour un utilisateur (pour l'admin)
export const updateUser = async (id: string, userData: any) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = allUsers.findIndex((u: any) => u.id === id);
  
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...userData };
    localStorage.setItem("users", JSON.stringify(allUsers));
    return allUsers[userIndex];
  }
  
  return null;
};

// Supprimer un utilisateur (pour l'admin)
export const deleteUser = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = allUsers.findIndex((u: any) => u.id === id);
  
  if (userIndex !== -1) {
    const deleted = allUsers.splice(userIndex, 1)[0];
    localStorage.setItem("users", JSON.stringify(allUsers));
    return deleted;
  }
  
  return null;
};

// Simuler la connexion d'un utilisateur (admin uniquement)
export const loginUser = async (email: string, password: string): Promise<{success: boolean, message?: string}> => {
  // Simuler la latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === "admin@route-en-direct.fr" && password === "admin123") {
    localStorage.setItem("user", JSON.stringify({
      id: "user-001",
      name: "Admin Principal",
      email: "admin@route-en-direct.fr",
      role: "admin"
    }));
    return { success: true };
  }
  
  return { success: false, message: "Email ou mot de passe incorrect" };
};

// Déconnexion
export const logoutUser = () => {
  localStorage.removeItem("user");
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("user") !== null;
};

// Obtenir l'utilisateur connecté
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

// Vérifier si l'utilisateur connecté est un administrateur
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user !== null && user.role === "admin";
};

// API simulée pour récupérer les données d'un véhicule via l'API CarrierWeb
export const getVehicleDataFromAPI = async (regnum: string): Promise<any> => {
  // Simuler la latence réseau
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dans une implémentation réelle, cette requête serait effectuée côté serveur
  // L'immatriculation est maintenant l'identifiant principal pour localiser le véhicule
  // const apiUrl = `http://carrierweb.eu/api/api.asmx/vehicle?apikey=5B6B31-7E1B0C-ED66E6&regnum=${regnum}`;
  // const response = await fetch(apiUrl);
  // return await response.json();
  
  // Simuler une réponse avec vitesse aléatoire pour tester la détection automatique de statut
  const speed = Math.floor(Math.random() * 120); // Vitesse entre 0 et 120 km/h
  const latitude = 48.8566 + (Math.random() * 2 - 1);
  const longitude = 2.3522 + (Math.random() * 2 - 1);
  
  console.log(`Véhicule ${regnum} détecté à ${speed} km/h à la position [${latitude}, ${longitude}]`);
  
  // Vérifier si le véhicule est dans une zone spéciale (ferry ou client)
  let inSpecialZone = "none";
  let zoneName = "";
  
  // Vérifier ferry
  for (const loc of locations.filter(l => l.type === "ferry" && l.active)) {
    const dist = calculateDistance(latitude, longitude, loc.position.lat, loc.position.lng);
    if (dist <= (loc.radius || 500) / 1000) {
      inSpecialZone = "ferry";
      zoneName = loc.name;
      break;
    }
  }
  
  // Vérifier clients si pas en ferry
  if (inSpecialZone === "none") {
    for (const loc of locations.filter(l => l.type === "delivery" && l.active)) {
      const dist = calculateDistance(latitude, longitude, loc.position.lat, loc.position.lng);
      if (dist <= (loc.radius || 500) / 1000) {
        inSpecialZone = "client";
        zoneName = loc.name;
        break;
      }
    }
  }
  
  if (inSpecialZone !== "none") {
    console.log(`Véhicule ${regnum} détecté dans la zone ${inSpecialZone}: ${zoneName}`);
  }
  
  return {
    success: true,
    data: {
      registration: regnum,
      make: "Volvo",
      model: "FH16",
      year: 2022,
      status: "Active",
      lastPosition: {
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toISOString(),
        speed: speed,
        direction: "Nord",
        inSpecialZone,
        zoneName
      },
      fuelLevel: 78,
      mileage: 125000,
      nextService: "2023-06-15"
    }
  };
};

// Créer un ensemble minimal d'utilisateurs de test si aucun n'existe
export const seedInitialUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  
  if (existingUsers.length === 0) {
    const testUsers = [
      {
        id: "user-1001",
        name: "Jean Martin",
        email: "jean@example.com",
        password: "hashed_password123",
        plan: "gratuit",
        isActive: true,
        vehicles: [
          {
            id: "vehicle-1001",
            regnum: "AB-123-CD",
            user_id: "user-1001"
          }
        ]
      },
      {
        id: "user-1002",
        name: "Marie Dupont",
        email: "marie@example.com",
        password: "hashed_password123",
        plan: "premium",
        isActive: true,
        vehicles: [
          {
            id: "vehicle-1002",
            regnum: "EF-456-GH",
            user_id: "user-1002"
          },
          {
            id: "vehicle-1003",
            regnum: "IJ-789-KL",
            user_id: "user-1002"
          },
          {
            id: "vehicle-1004",
            regnum: "MN-012-OP",
            user_id: "user-1002"
          }
        ]
      }
    ];
    
    localStorage.setItem("users", JSON.stringify(testUsers));
  }
};

// Appeler cette fonction pour initialiser les données de test
seedInitialUsers();
