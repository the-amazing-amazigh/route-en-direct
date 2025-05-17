
export enum ShipmentStatus {
  EnChargement = "En chargement",
  Charge = "Chargé",
  EnTransit = "En transit",
  EnDouane = "En douane",
  EnFerry = "En ferry",
  EnRoute = "En route",
  SurSiteClient = "Sur site client",
  Livree = "Livrée"
}

export interface Position {
  lat: number;
  lng: number;
}

export interface ShipmentStop {
  id: string;
  name: string;
  position: Position;
  type: "pickup" | "customs" | "ferry" | "delivery";
  plannedArrival: string; // ISO date string
  actualArrival: string | null; // ISO date string
}

export interface TruckData {
  id: string;
  position: Position;
  speed: number;
  ignition: boolean;
  doorOpen: boolean;
  lastUpdate: string; // ISO date string
}

export interface Shipment {
  id: string;
  trackingId: string;
  description: string;
  status: ShipmentStatus;
  currentPosition: Position | null;
  origin: ShipmentStop;
  destination: ShipmentStop;
  stops: ShipmentStop[];
  currentStop: number;
  truck: {
    id: string;
    registration: string;
  };
  trailer?: {
    id: string;
    registration: string;
  };
  driver: {
    id: string;
    name: string;
  };
  eta: string; // ISO date string
  departureTime: string; // ISO date string
  client: {
    id: string;
    name: string;
    reference: string;
  };
  statusHistory: {
    status: ShipmentStatus;
    timestamp: string; // ISO date string
    position: Position | null;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  clientId?: string;
}

export interface Location {
  id: string;
  name: string;
  type: "pickup" | "delivery" | "customs" | "ferry" | "other";
  address: string;
  position: Position;
  radius?: number; // Rayon en mètres pour la détection automatique
  active: boolean;
  user_id: string | null; // null pour les lieux partagés
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  active: boolean;
  user_id: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  model: string;
  year: number;
  type: "truck" | "trailer";
  status: "En service" | "En maintenance" | "Disponible";
  carrierweb_id?: string;
  user_id: string;
}
