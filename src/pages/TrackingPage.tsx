
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrackingMap from "../components/TrackingMap";
import ShipmentTimeline from "../components/ShipmentTimeline";
import ShipmentInfo from "../components/ShipmentInfo";
import { getShipmentByTrackingId, getTruckData, getAllShipments } from "../services/api";
import { Shipment, TruckData } from "../types";
import { Button } from "@/components/ui/button";
import TrackingForm from "../components/TrackingForm";

const TrackingPage = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [truckData, setTruckData] = useState<TruckData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fonction pour charger les données de l'envoi avec vérification élargie
  const fetchShipmentData = async () => {
    try {
      if (!trackingId) {
        setError("Numéro de suivi manquant");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log(`Recherche de l'envoi avec le numéro de suivi: ${trackingId}`);
      
      // Essayer d'abord avec la fonction standard
      let data = await getShipmentByTrackingId(trackingId);
      
      // Si l'envoi n'est pas trouvé, essayer de chercher dans tous les envois
      if (!data) {
        console.log("Envoi non trouvé avec la méthode standard, recherche élargie...");
        const allShipments = await getAllShipments();
        data = allShipments.find(s => s.trackingId === trackingId);
      }
      
      if (!data) {
        setError(`Envoi non trouvé. Vérifiez le numéro de suivi: ${trackingId}`);
        setIsLoading(false);
        return;
      }
      
      console.log("Envoi trouvé:", data);
      setShipment(data);
      
      // Charger les données du camion
      const truckDataResponse = await getTruckData(data.id);
      if (truckDataResponse) {
        setTruckData(truckDataResponse);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      setIsLoading(false);
    }
  };
  
  // Charger les données de l'envoi au chargement de la page
  useEffect(() => {
    fetchShipmentData();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(() => {
      if (shipment) {
        getTruckData(shipment.id)
          .then(data => {
            if (data) setTruckData(data);
          })
          .catch(err => console.error("Erreur de mise à jour:", err));
      }
    }, 30000);
    
    // Nettoyer l'intervalle
    return () => clearInterval(interval);
  }, [trackingId, shipment?.id]);
  
  // Fonction pour rafraîchir manuellement les données
  const handleRefresh = () => {
    toast({
      title: "Actualisation en cours",
      description: "Les données sont en cours de mise à jour...",
    });
    fetchShipmentData();
  };

  // Fonction pour retourner à la page d'accueil
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col w-full max-w-md space-y-4">
              <TrackingForm />
              <Button variant="outline" onClick={handleGoHome} className="w-full">
                Retour à l'accueil
              </Button>
            </div>
          </div>
        ) : shipment ? (
          <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Suivi de livraison</h2>
                <p className="text-gray-600">Référence: {shipment.trackingId}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </Button>
            </div>
            
            {/* Timeline du statut de livraison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-6">Progression de l'envoi</h3>
              <ShipmentTimeline shipment={shipment} />
            </div>
            
            {/* Carte de suivi */}
            <TrackingMap shipment={shipment} truckData={truckData} />
            
            {/* Informations détaillées sur l'expédition */}
            <ShipmentInfo shipment={shipment} />
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackingPage;
