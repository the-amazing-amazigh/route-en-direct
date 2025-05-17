
import { Shipment } from "../types";

interface ShipmentInfoProps {
  shipment: Shipment;
}

const ShipmentInfo = ({ shipment }: ShipmentInfoProps) => {
  // Formater les dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculer le temps restant jusqu'à la livraison
  const getRemainingTime = () => {
    const now = new Date();
    const eta = new Date(shipment.eta);
    
    if (now > eta) return "Dépassé";
    
    const diffMs = eta.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}j ${diffHrs}h`;
    } else {
      return `${diffHrs}h ${diffMins}min`;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold mb-4">Détails de l'envoi</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Numéro de suivi</p>
              <p className="font-semibold">{shipment.trackingId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{shipment.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Référence client</p>
              <p>{shipment.client.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut actuel</p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-route-primary"></span>
                <span className="font-semibold">{shipment.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Informations de transport</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tracteur</p>
              <p>{shipment.truck.registration}</p>
            </div>
            {shipment.trailer && (
              <div>
                <p className="text-sm text-gray-500">Remorque</p>
                <p>{shipment.trailer.registration}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Chauffeur</p>
              <p>{shipment.driver.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Départ</p>
              <p>{formatDate(shipment.departureTime)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heure d'arrivée estimée</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{formatDate(shipment.eta)}</p>
                <span className="text-xs text-route-primary bg-blue-50 px-2 py-1 rounded">
                  {getRemainingTime()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold mb-4">Itinéraire</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-route-success flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{shipment.origin.name}</p>
                <p className="text-xs text-gray-500">Expéditeur</p>
                <p className="text-sm text-gray-500">
                  Prévu: {formatDate(shipment.origin.plannedArrival)}
                </p>
                {shipment.origin.actualArrival && (
                  <p className="text-sm text-route-success">
                    Réalisé: {formatDate(shipment.origin.actualArrival)}
                  </p>
                )}
              </div>
            </div>
            
            {shipment.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-start">
                <div className="w-10 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-route-warning flex items-center justify-center">
                    <span className="text-white text-xs">{index + 1}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{stop.name}</p>
                  <p className="text-sm text-gray-500">
                    Prévu: {formatDate(stop.plannedArrival)}
                  </p>
                  {stop.actualArrival && (
                    <p className="text-sm text-route-success">
                      Réalisé: {formatDate(stop.actualArrival)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex items-start">
              <div className="w-10 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-route-error flex items-center justify-center">
                  <span className="text-white text-xs">B</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{shipment.destination.name}</p>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm text-gray-500">
                  Prévu: {formatDate(shipment.destination.plannedArrival)}
                </p>
                {shipment.destination.actualArrival && (
                  <p className="text-sm text-route-success">
                    Réalisé: {formatDate(shipment.destination.actualArrival)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentInfo;
