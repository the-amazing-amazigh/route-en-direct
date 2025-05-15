
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Shipment, TruckData } from "../types";
import L from "leaflet";

// Correction des icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Création d'une icône de camion personnalisée
const truckIcon = L.divIcon({
  className: "custom-truck-icon",
  html: '<div class="p-1 bg-route-primary rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Icônes pour les points d'arrêt
const stopIcon = (type: string) => {
  let color = "bg-route-primary";
  let iconContent = "";
  
  switch (type) {
    case "pickup":
      color = "bg-route-success";
      iconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>';
      break;
    case "delivery":
      color = "bg-route-error";
      iconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
      break;
    case "customs":
      color = "bg-route-warning";
      iconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      break;
    case "ferry":
      color = "bg-route-info";
      iconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A8 8 0 1 0 4 16.2"></path><path d="M12 12v9"></path><path d="m8 17 4-5 4 5"></path></svg>';
      break;
  }
  
  return L.divIcon({
    className: "custom-stop-icon",
    html: `<div class="p-1 ${color} rounded-full">${iconContent}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

interface TrackingMapProps {
  shipment: Shipment;
  truckData: TruckData | null;
}

const TrackingMap = ({ shipment, truckData }: TrackingMapProps) => {
  // Préparer les points pour tracer l'itinéraire
  const routePoints = [
    shipment.origin.position,
    ...(shipment.stops || []).map(stop => stop.position),
    shipment.destination.position
  ];
  
  const currentPosition = truckData?.position || shipment.currentPosition;
  const bounds = L.latLngBounds([
    ...routePoints,
    ...(currentPosition ? [currentPosition] : [])
  ]);
  
  useEffect(() => {
    // Ajouter des styles CSS pour l'icône de camion animée
    const style = document.createElement("style");
    style.textContent = `
      .custom-truck-icon {
        filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.2));
      }
      .active-truck {
        animation: pulse-slow 3s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-md">
      {currentPosition ? (
        <MapContainer 
          center={[currentPosition.lat, currentPosition.lng]} 
          zoom={10} 
          style={{ height: "100%", width: "100%" }}
          bounds={bounds}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Tracer l'itinéraire */}
          <Polyline 
            positions={routePoints}
            color="#1A73E8"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
          
          {/* Point de départ */}
          <Marker 
            position={[shipment.origin.position.lat, shipment.origin.position.lng]} 
            icon={stopIcon("pickup")}
          >
            <Popup>
              <strong>Point de départ:</strong> {shipment.origin.name}<br />
              <span className="text-xs text-gray-600">
                {new Date(shipment.origin.plannedArrival).toLocaleString("fr-FR")}
              </span>
            </Popup>
          </Marker>
          
          {/* Points d'arrêt */}
          {shipment.stops.map((stop, index) => (
            <Marker 
              key={stop.id}
              position={[stop.position.lat, stop.position.lng]} 
              icon={stopIcon(stop.type)}
            >
              <Popup>
                <strong>{stop.name}</strong><br />
                <span className="text-xs text-gray-600">
                  {new Date(stop.plannedArrival).toLocaleString("fr-FR")}
                </span>
              </Popup>
            </Marker>
          ))}
          
          {/* Destination */}
          <Marker 
            position={[shipment.destination.position.lat, shipment.destination.position.lng]} 
            icon={stopIcon("delivery")}
          >
            <Popup>
              <strong>Destination:</strong> {shipment.destination.name}<br />
              <span className="text-xs text-gray-600">
                {new Date(shipment.destination.plannedArrival).toLocaleString("fr-FR")}
              </span>
            </Popup>
          </Marker>
          
          {/* Position actuelle du camion */}
          {currentPosition && (
            <Marker 
              position={[currentPosition.lat, currentPosition.lng]} 
              icon={truckIcon}
              className="active-truck"
            >
              <Popup>
                <strong>Position actuelle</strong><br />
                <span className="text-xs text-gray-600">
                  Véhicule: {shipment.truck.registration}<br />
                  Chauffeur: {shipment.driver.name}<br />
                  {truckData && (
                    <>
                      Vitesse: {truckData.speed} km/h<br />
                      Mise à jour: {new Date(truckData.lastUpdate).toLocaleTimeString("fr-FR")}
                    </>
                  )}
                </span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Impossible de charger la carte</p>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
