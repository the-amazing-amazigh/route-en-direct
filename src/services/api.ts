
import { mockShipments, findShipmentByTrackingId, getTruckDataForShipment, updateTruckPositions } from '../data/mockData';
import { Shipment, TruckData, ShipmentStatus } from '../types';

// Création d'une copie locale des envois pour pouvoir les modifier
let shipments = [...mockShipments];

let trucks = [
  { id: "truck-001", registration: "AB-123-CD", model: "Volvo FH16", year: 2022, status: "En service" },
  { id: "truck-002", registration: "EF-456-GH", model: "Mercedes Actros", year: 2021, status: "En service" },
  { id: "truck-003", registration: "IJ-789-KL", model: "Scania R450", year: 2020, status: "En maintenance" },
  { id: "truck-004", registration: "MN-012-OP", model: "DAF XF", year: 2023, status: "En service" },
  { id: "truck-005", registration: "QR-345-ST", model: "Renault T High", year: 2022, status: "Disponible" },
];

let drivers = [
  { id: "driver-001", name: "Jean Dupont", phone: "06 12 34 56 78", license: "Poids lourd", experience: "5 ans", status: "En service" },
  { id: "driver-002", name: "Marie Martin", phone: "06 23 45 67 89", license: "Super lourd", experience: "8 ans", status: "En service" },
  { id: "driver-003", name: "Paul Bernard", phone: "06 34 56 78 90", license: "Poids lourd", experience: "3 ans", status: "En repos" },
  { id: "driver-004", name: "Sophie Petit", phone: "06 45 67 89 01", license: "Super lourd", experience: "6 ans", status: "En congé" },
  { id: "driver-005", name: "Thomas Richard", phone: "06 56 78 90 12", license: "Poids lourd", experience: "4 ans", status: "En service" },
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
  
  return getTruckDataForShipment(shipment);
};

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
      email: "client@example.com"
    },
    origin: {
      id: `location-${Date.now()}-origin`,
      name: shipmentData.origin,
      coordinates: {
        lat: 48.8566 + (Math.random() * 2 - 1),
        lng: 2.3522 + (Math.random() * 2 - 1),
      }
    },
    destination: {
      id: `location-${Date.now()}-destination`,
      name: shipmentData.destination,
      coordinates: {
        lat: 48.8566 + (Math.random() * 10 - 5),
        lng: 2.3522 + (Math.random() * 10 - 5),
      }
    },
    truckId: "truck-001",
    // Ajout des propriétés manquantes pour correspondre au type Shipment
    currentPosition: {
      lat: 48.8566 + (Math.random() * 5 - 2.5),
      lng: 2.3522 + (Math.random() * 5 - 2.5),
    },
    stops: [],
    currentStop: 0,
    truck: {
      id: "truck-001",
      registration: "AB-123-CD"
    },
    driver: {
      id: "driver-001",
      name: "Jean Dupont"
    }
  };
  
  shipments.push(newShipment);
  return newShipment;
};

export const updateShipment = async (id: string, shipmentData: any) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = shipments.findIndex(s => s.id === id);
  if (index !== -1) {
    shipments[index] = {
      ...shipments[index],
      trackingId: shipmentData.trackingId,
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
        name: shipmentData.origin,
      },
      destination: {
        ...shipments[index].destination,
        name: shipmentData.destination,
      },
    };
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
  const newTruck = {
    id: `truck-${Date.now()}`,
    ...truck
  };
  trucks.push(newTruck);
  return newTruck;
};

export const updateTruck = async (id: string, truckData: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = trucks.findIndex(t => t.id === id);
  if (index !== -1) {
    trucks[index] = { ...trucks[index], ...truckData };
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
  
  // Simuler une réponse
  return {
    success: true,
    data: {
      registration: regnum,
      make: "Volvo",
      model: "FH16",
      year: 2022,
      status: "Active",
      lastPosition: {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: new Date().toISOString(),
        speed: 65,
        direction: "Nord"
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
