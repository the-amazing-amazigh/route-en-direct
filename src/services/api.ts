
import { mockShipments, findShipmentByTrackingId, getTruckDataForShipment, updateTruckPositions } from '../data/mockData';
import { Shipment, TruckData } from '../types';

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
  
  const shipment = mockShipments.find(s => s.id === shipmentId);
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
  
  return mockShipments;
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

// Simuler la connexion d'un utilisateur
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
