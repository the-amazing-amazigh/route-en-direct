
import { Shipment, ShipmentStatus } from "../types";

// Liste ordonnée des statuts pour la timeline
const statusOrder = [
  ShipmentStatus.EnChargement,
  ShipmentStatus.Charge,
  ShipmentStatus.EnTransit,
  ShipmentStatus.EnDouane,
  ShipmentStatus.EnFerry,
  ShipmentStatus.EnRoute,
  ShipmentStatus.SurSiteClient,
  ShipmentStatus.Livree
];

interface ShipmentTimelineProps {
  shipment: Shipment;
}

const StatusIcon = ({ status, isActive, isPast }: { status: ShipmentStatus, isActive: boolean, isPast: boolean }) => {
  let iconClass = "h-8 w-8 flex items-center justify-center rounded-full";
  let textClass = "text-sm";
  
  if (isActive) {
    iconClass += " bg-route-primary text-white animate-pulse-slow";
    textClass += " font-bold text-route-primary";
  } else if (isPast) {
    iconClass += " bg-route-success text-white";
    textClass += " text-route-success";
  } else {
    iconClass += " bg-gray-200 text-gray-400";
    textClass += " text-gray-400";
  }
  
  // Choisir l'icône en fonction du statut
  let icon = "●";
  switch (status) {
    case ShipmentStatus.EnChargement:
      icon = "↑";
      break;
    case ShipmentStatus.Charge:
      icon = "✓";
      break;
    case ShipmentStatus.EnTransit:
      icon = "⚡"; // Changé pour indiquer détection automatique par vitesse
      break;
    case ShipmentStatus.EnRoute:
      icon = "→";
      break;
    case ShipmentStatus.EnDouane:
      icon = "!";
      break;
    case ShipmentStatus.EnFerry:
      icon = "⚓"; // Détecté automatiquement par zone
      break;
    case ShipmentStatus.SurSiteClient:
      icon = "↓"; // Détecté automatiquement par zone
      break;
    case ShipmentStatus.Livree:
      icon = "★";
      break;
  }
  
  // Informations supplémentaires sur la détection automatique
  let autoDetect = "";
  if (status === ShipmentStatus.EnTransit) {
    autoDetect = " (auto: >80km/h)";
  } else if (status === ShipmentStatus.EnFerry || status === ShipmentStatus.SurSiteClient) {
    autoDetect = " (auto: zone)";
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className={iconClass}>{icon}</div>
      <span className={textClass}>{status}{autoDetect}</span>
    </div>
  );
};

const ShipmentTimeline = ({ shipment }: ShipmentTimelineProps) => {
  const currentStatusIndex = statusOrder.indexOf(shipment.status);
  
  // Filtrer les statuts pertinents pour cet envoi spécifique
  // Par exemple, ne pas afficher "EnFerry" si ce n'est pas une route avec ferry
  const relevantStatuses = statusOrder.filter(status => {
    // On garde toujours les premiers et derniers statuts
    if (
      status === ShipmentStatus.EnChargement ||
      status === ShipmentStatus.Charge ||
      status === ShipmentStatus.EnTransit ||
      status === ShipmentStatus.EnRoute ||
      status === ShipmentStatus.SurSiteClient ||
      status === ShipmentStatus.Livree
    ) {
      return true;
    }
    
    // On inclut EnDouane seulement s'il y a une douane dans les arrêts
    if (status === ShipmentStatus.EnDouane) {
      return shipment.stops.some(stop => stop.type === "customs");
    }
    
    // On inclut EnFerry seulement s'il y a un ferry dans les arrêts
    if (status === ShipmentStatus.EnFerry) {
      return shipment.stops.some(stop => stop.type === "ferry");
    }
    
    return false;
  });
  
  // Trouver les dates dans l'historique pour chaque statut
  const statusDates: Record<string, string | null> = {};
  shipment.statusHistory.forEach(historyItem => {
    statusDates[historyItem.status] = historyItem.timestamp;
  });
  
  return (
    <div className="w-full my-6">
      <div className="relative">
        {/* Ligne connectant les statuts */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
        
        {/* Statuts */}
        <div className="flex justify-between relative z-10">
          {relevantStatuses.map((status, index) => {
            const statusIndex = statusOrder.indexOf(status);
            const isActive = statusIndex === currentStatusIndex;
            const isPast = statusIndex < currentStatusIndex;
            
            return (
              <div key={status} className="flex flex-col items-center">
                <StatusIcon 
                  status={status} 
                  isActive={isActive}
                  isPast={isPast}
                />
                
                {statusDates[status] && (
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(statusDates[status]!).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTimeline;
