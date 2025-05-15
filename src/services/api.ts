
import { mockShipments, findShipmentByTrackingId, getTruckDataForShipment, updateTruckPositions } from '../data/mockData';
import { Shipment, TruckData } from '../types';

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
