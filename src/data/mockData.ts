import { Shipment, ShipmentStatus, Position, TruckData } from "../types";

// Points de départ et d'arrivée pour nos livraisons simulées
const locations = {
  paris: { lat: 48.8566, lng: 2.3522 },
  lyon: { lat: 45.7578, lng: 4.8320 },
  marseille: { lat: 43.2965, lng: 5.3698 },
  bordeaux: { lat: 44.8378, lng: -0.5792 },
  lille: { lat: 50.6292, lng: 3.0573 },
  strasbourg: { lat: 48.5734, lng: 7.7521 },
  calais: { lat: 50.9513, lng: 1.8587 },
  dover: { lat: 51.1279, lng: 1.3134 },
  bruxelles: { lat: 50.8503, lng: 4.3517 },
  geneve: { lat: 46.2044, lng: 6.1432 },
  turin: { lat: 45.0703, lng: 7.6869 },
};

// Points intermédiaires pour les douanes et les ferrys
const customsPoints = [
  { name: "Douane Ventimiglia", position: { lat: 43.7808, lng: 7.6094 } },
  { name: "Douane Basel", position: { lat: 47.5651, lng: 7.5907 } },
  { name: "Douane Mont-Blanc", position: { lat: 45.9226, lng: 6.8796 } },
];

const ferryPoints = [
  { name: "Calais Port", position: { lat: 50.9692, lng: 1.8431 } },
  { name: "Dover Port", position: { lat: 51.1231, lng: 1.3248 } },
];

// Génération de l'historique de statut
const generateStatusHistory = (departureTime: Date, currentStatus: ShipmentStatus) => {
  const history = [];
  const statuses = Object.values(ShipmentStatus);
  const currentIndex = statuses.indexOf(currentStatus);
  
  let timestamp = new Date(departureTime);
  
  for (let i = 0; i <= currentIndex; i++) {
    history.push({
      status: statuses[i],
      timestamp: new Date(timestamp.getTime() + i * 3600000).toISOString(),
      position: getRandomPosition(locations.paris, locations.marseille, i / currentIndex)
    });
    
    timestamp = new Date(timestamp.getTime() + Math.random() * 10000000);
  }
  
  return history;
};

// Fonction pour générer une position aléatoire entre deux points
const getRandomPosition = (start: Position, end: Position, fraction: number): Position => {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction + (Math.random() - 0.5) * 0.1,
    lng: start.lng + (end.lng - start.lng) * fraction + (Math.random() - 0.5) * 0.1
  };
};

// Génération de dates réalistes
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(now);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

export const mockShipments: Shipment[] = [
  {
    id: "ship-001",
    trackingId: "FTL25698745",
    description: "Matériel informatique - 15 palettes",
    status: ShipmentStatus.EnTransit,
    currentPosition: getRandomPosition(locations.paris, locations.marseille, 0.6),
    origin: {
      id: "stop-001",
      name: "Entrepôt Paris Nord",
      position: locations.paris,
      type: "pickup",
      plannedArrival: yesterday.toISOString(),
      actualArrival: yesterday.toISOString(),
    },
    destination: {
      id: "stop-002",
      name: "Centre de distribution Lyon",
      position: locations.lyon,
      type: "delivery",
      plannedArrival: tomorrow.toISOString(),
      actualArrival: null,
    },
    stops: [],
    currentStop: 0,
    truck: {
      id: "truck-001",
      registration: "AA-123-BB",
    },
    driver: {
      id: "driver-001",
      name: "Jean Dupont",
    },
    eta: tomorrow.toISOString(),
    departureTime: yesterday.toISOString(),
    client: {
      id: "client-001",
      name: "TechDistrib SAS",
      reference: "CMD-2023-456",
    },
    statusHistory: generateStatusHistory(yesterday, ShipmentStatus.EnTransit),
  },
  {
    id: "ship-002",
    trackingId: "FTL36912478",
    description: "Produits pharmaceutiques - 8 palettes",
    status: ShipmentStatus.EnDouane,
    currentPosition: customsPoints[0].position,
    origin: {
      id: "stop-003",
      name: "Laboratoire Marseille",
      position: locations.marseille,
      type: "pickup",
      plannedArrival: yesterday.toISOString(),
      actualArrival: yesterday.toISOString(),
    },
    destination: {
      id: "stop-004",
      name: "Hôpital Central Turin",
      position: locations.turin,
      type: "delivery",
      plannedArrival: tomorrow.toISOString(),
      actualArrival: null,
    },
    stops: [
      {
        id: "stop-custom-001",
        name: "Douane Ventimiglia",
        position: customsPoints[0].position,
        type: "customs",
        plannedArrival: now.toISOString(),
        actualArrival: now.toISOString(),
      }
    ],
    currentStop: 0,
    truck: {
      id: "truck-002",
      registration: "CC-456-DD",
    },
    driver: {
      id: "driver-002",
      name: "Sophie Martin",
    },
    eta: dayAfterTomorrow.toISOString(),
    departureTime: yesterday.toISOString(),
    client: {
      id: "client-002",
      name: "MediPharma Italia",
      reference: "MPI-2023-789",
    },
    statusHistory: generateStatusHistory(yesterday, ShipmentStatus.EnDouane),
  },
  {
    id: "ship-003",
    trackingId: "FTL74125896",
    description: "Meubles et accessoires - 22 palettes",
    status: ShipmentStatus.EnFerry,
    currentPosition: ferryPoints[0].position,
    origin: {
      id: "stop-005",
      name: "Entrepôt Nord Lille",
      position: locations.lille,
      type: "pickup",
      plannedArrival: yesterday.toISOString(),
      actualArrival: yesterday.toISOString(),
    },
    destination: {
      id: "stop-006",
      name: "Centre de distribution Bruxelles",
      position: locations.bruxelles,
      type: "delivery",
      plannedArrival: tomorrow.toISOString(),
      actualArrival: null,
    },
    stops: [
      {
        id: "stop-ferry-001",
        name: "Ferry Calais-Douvres",
        position: ferryPoints[0].position,
        type: "ferry",
        plannedArrival: now.toISOString(),
        actualArrival: now.toISOString(),
      }
    ],
    currentStop: 0,
    truck: {
      id: "truck-003",
      registration: "EE-789-FF",
    },
    driver: {
      id: "driver-003",
      name: "Pierre Leblanc",
    },
    eta: dayAfterTomorrow.toISOString(),
    departureTime: yesterday.toISOString(),
    client: {
      id: "client-003",
      name: "MaisonDeco Benelux",
      reference: "MDQ-2023-321",
    },
    statusHistory: generateStatusHistory(yesterday, ShipmentStatus.EnFerry),
  },
  {
    id: "ship-004",
    trackingId: "FTL95123647",
    description: "Produits alimentaires - 18 palettes",
    status: ShipmentStatus.Livree,
    currentPosition: locations.bordeaux,
    origin: {
      id: "stop-007",
      name: "Centrale logistique Paris Sud",
      position: locations.paris,
      type: "pickup",
      plannedArrival: new Date(yesterday.getTime() - 86400000 * 3).toISOString(),
      actualArrival: new Date(yesterday.getTime() - 86400000 * 3).toISOString(),
    },
    destination: {
      id: "stop-008",
      name: "Hypermarché Bordeaux",
      position: locations.bordeaux,
      type: "delivery",
      plannedArrival: yesterday.toISOString(),
      actualArrival: yesterday.toISOString(),
    },
    stops: [],
    currentStop: 0,
    truck: {
      id: "truck-004",
      registration: "GG-012-HH",
    },
    driver: {
      id: "driver-004",
      name: "Marie Dubois",
    },
    eta: yesterday.toISOString(),
    departureTime: new Date(yesterday.getTime() - 86400000 * 3).toISOString(),
    client: {
      id: "client-004",
      name: "SuperDistribution Sud-Ouest",
      reference: "SD-2023-654",
    },
    statusHistory: generateStatusHistory(new Date(yesterday.getTime() - 86400000 * 3), ShipmentStatus.Livree),
  }
];

// Mock data pour les utilisateurs
export const mockUsers = [
  {
    id: "user-001",
    name: "Admin Principal",
    email: "admin@route-en-direct.fr",
    role: "admin" as const
  },
  {
    id: "user-002",
    name: "Client TechDistrib",
    email: "contact@techdistrib.fr",
    role: "client" as const,
    clientId: "client-001"
  }
];

// Mock data pour le déplacement de camions
export let mockTruckData: Record<string, TruckData> = {
  "truck-001": {
    id: "truck-001",
    position: getRandomPosition(locations.paris, locations.lyon, 0.6),
    speed: 85,
    ignition: true,
    doorOpen: false,
    lastUpdate: new Date().toISOString()
  },
  "truck-002": {
    id: "truck-002",
    position: customsPoints[0].position,
    speed: 0,
    ignition: true,
    doorOpen: true,
    lastUpdate: new Date().toISOString()
  },
  "truck-003": {
    id: "truck-003",
    position: ferryPoints[0].position,
    speed: 0,
    ignition: false,
    doorOpen: false,
    lastUpdate: new Date().toISOString()
  },
  "truck-004": {
    id: "truck-004",
    position: locations.bordeaux,
    speed: 0,
    ignition: false,
    doorOpen: false,
    lastUpdate: new Date().toISOString()
  }
};

// Fonction pour simuler le mouvement des camions
export const updateTruckPositions = () => {
  mockTruckData = {
    ...mockTruckData,
    "truck-001": {
      ...mockTruckData["truck-001"],
      position: getRandomPosition(
        mockTruckData["truck-001"].position,
        locations.lyon,
        0.05
      ),
      speed: Math.floor(75 + Math.random() * 15),
      lastUpdate: new Date().toISOString()
    }
  };
  
  return mockTruckData;
};

// Fonction pour trouver un envoi par son ID de suivi
export const findShipmentByTrackingId = (trackingId: string): Shipment | undefined => {
  return mockShipments.find(shipment => shipment.trackingId === trackingId);
};

// Fonction pour obtenir les données de camion pour un envoi
export const getTruckDataForShipment = (shipment: Shipment): TruckData => {
  return mockTruckData[shipment.truck.id] || {
    id: shipment.truck.id,
    position: shipment.currentPosition || shipment.origin.position,
    speed: 0,
    ignition: false,
    doorOpen: false,
    lastUpdate: new Date().toISOString()
  };
};
