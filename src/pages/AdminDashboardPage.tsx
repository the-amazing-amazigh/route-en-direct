
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AdminMenu from "../components/AdminMenu";
import ShipmentTable from "../components/ShipmentTable";
import { getAllShipments } from "../services/api";
import { isAuthenticated } from "../services/api";
import { Shipment, ShipmentStatus } from "../types";

const AdminDashboardPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);
  
  // Charger les données des expéditions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllShipments();
        setShipments(data);
      } catch (error) {
        console.error("Erreur lors du chargement des expéditions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculer les statistiques
  const activeShipments = shipments.filter(
    (s) => s.status !== ShipmentStatus.Livree
  ).length;
  
  const delayedShipments = shipments.filter((s) => {
    if (s.status === ShipmentStatus.Livree) return false;
    const eta = new Date(s.eta);
    const now = new Date();
    return eta < now;
  }).length;
  
  const completedShipments = shipments.filter(
    (s) => s.status === ShipmentStatus.Livree
  ).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Menu latéral admin */}
          <div className="md:w-64">
            <AdminMenu />
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
            
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-semibold">Livraisons actives</h3>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold">{activeShipments}</span>
                  <div className="ml-auto bg-blue-100 text-route-primary px-2 py-1 rounded text-xs">
                    En cours
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-semibold">Livraisons en retard</h3>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold">{delayedShipments}</span>
                  <div className="ml-auto bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                    Attention
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-semibold">Livraisons terminées</h3>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold">{completedShipments}</span>
                  <div className="ml-auto bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                    Complétées
                  </div>
                </div>
              </div>
            </div>
            
            {/* Liste des livraisons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Livraisons récentes</h3>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ) : (
                <ShipmentTable shipments={shipments} />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
