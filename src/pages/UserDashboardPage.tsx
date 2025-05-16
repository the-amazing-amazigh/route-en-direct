
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/crud/ConfirmDialog";
import { Plus, Trash2, RefreshCcw, Crown } from "lucide-react";
import { getVehicleDataFromAPI } from "@/services/api";
import PlanUpgradeDialog from "@/components/PlanUpgradeDialog";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlanUpgradeOpen, setIsPlanUpgradeOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regnum, setRegNum] = useState("");
  const [isVehicleDataDialogOpen, setIsVehicleDataDialogOpen] = useState(false);

  // Vérification de l'authentification
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Récupérer les utilisateurs pour trouver les véhicules associés
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = allUsers.find((u: any) => u.id === user.id);
      
      if (foundUser) {
        // Vérifier si le compte est actif
        if (!foundUser.isActive) {
          toast.error("Votre compte a été désactivé. Veuillez contacter l'administrateur.");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        
        // Mise à jour du plan dans la session au cas où il aurait été modifié par l'admin
        const userSession = JSON.parse(localStorage.getItem("user") || "{}");
        if (foundUser.plan !== userSession.plan) {
          userSession.plan = foundUser.plan;
          localStorage.setItem("user", JSON.stringify(userSession));
          setCurrentUser(userSession);
        }
        
        if (foundUser.vehicles) {
          setVehicles(foundUser.vehicles);
        }
      }
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  // Fonction pour ajouter un véhicule
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regnum) {
      toast.error("Veuillez remplir le champ d'immatriculation");
      return;
    }
    
    // Vérifier la limite du plan gratuit
    if (currentUser.plan === "gratuit" && vehicles.length >= 1) {
      setIsAddDialogOpen(false);
      setIsPlanUpgradeOpen(true);
      return;
    }
    
    // Créer un nouveau véhicule avec uniquement l'immatriculation
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      regnum,
      user_id: currentUser.id
    };
    
    // Mettre à jour les véhicules de l'utilisateur dans le localStorage
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = allUsers.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      if (!allUsers[userIndex].vehicles) {
        allUsers[userIndex].vehicles = [];
      }
      
      allUsers[userIndex].vehicles.push(newVehicle);
      localStorage.setItem("users", JSON.stringify(allUsers));
      
      // Mettre à jour l'état local
      setVehicles([...vehicles, newVehicle]);
      setRegNum("");
      setIsAddDialogOpen(false);
      
      toast.success("Véhicule ajouté avec succès");
    }
  };

  // Fonction pour supprimer un véhicule
  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return;
    
    // Mettre à jour les véhicules de l'utilisateur dans le localStorage
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = allUsers.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex !== -1 && allUsers[userIndex].vehicles) {
      allUsers[userIndex].vehicles = allUsers[userIndex].vehicles.filter(
        (v: any) => v.id !== selectedVehicle.id
      );
      
      localStorage.setItem("users", JSON.stringify(allUsers));
      
      // Mettre à jour l'état local
      setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
      
      toast.success("Véhicule supprimé avec succès");
    }
  };

  // Fonction pour récupérer les données d'un véhicule depuis l'API
  const fetchVehicleData = async (vehicle: any) => {
    setIsLoading(true);
    setSelectedVehicle(vehicle);
    
    try {
      // Appel à l'API avec uniquement l'immatriculation (regnum)
      const response = await getVehicleDataFromAPI(vehicle.regnum);
      
      if (response.success) {
        setVehicleData(response.data);
        setIsVehicleDataDialogOpen(true);
      } else {
        toast.error("Impossible de récupérer les données du véhicule");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du véhicule:", error);
      toast.error("Erreur lors de la récupération des données du véhicule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Tableau de bord utilisateur</h2>
            <p className="text-gray-600">
              Bienvenue, {currentUser?.name || "Utilisateur"}
            </p>
          </div>
          {currentUser && (
            <div className={`px-4 py-2 rounded-full flex items-center ${
              currentUser.plan === "premium" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
            }`}>
              {currentUser.plan === "premium" ? (
                <>
                  <Crown className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="font-medium">Plan Premium</span>
                </>
              ) : (
                <span className="font-medium">Plan Gratuit</span>
              )}
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mes Véhicules</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Ajouter un véhicule
            </Button>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Vous n'avez pas encore de véhicules enregistrés.
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="flex items-center gap-1 mx-auto"
                  >
                    <Plus className="h-4 w-4" /> Ajouter un véhicule
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Immatriculation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle: any) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.regnum}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => fetchVehicleData(vehicle)}
                            disabled={isLoading && selectedVehicle?.id === vehicle.id}
                          >
                            {isLoading && selectedVehicle?.id === vehicle.id ? (
                              <RefreshCcw className="h-4 w-4 animate-spin" />
                            ) : (
                              "Données API"
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {currentUser?.plan === "gratuit" && vehicles.length === 1 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-md text-sm">
                <p className="text-blue-600">
                  Vous avez atteint la limite du plan gratuit (1 véhicule).
                  <Button 
                    variant="link" 
                    className="text-blue-700 p-0 ml-2 h-auto" 
                    onClick={() => setIsPlanUpgradeOpen(true)}
                  >
                    Passez au plan Premium pour ajouter plus de véhicules.
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogue pour l'ajout d'un véhicule */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un véhicule</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regnum">N° d'immatriculation</Label>
              <Input
                id="regnum"
                value={regnum}
                onChange={(e) => setRegNum(e.target.value)}
                placeholder="AB-123-CD"
                required
              />
              <p className="text-sm text-muted-foreground">
                L'immatriculation est utilisée pour localiser le véhicule via CarrierWeb
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour la suppression d'un véhicule */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteVehicle}
        title="Supprimer un véhicule"
        description={`Êtes-vous sûr de vouloir supprimer le véhicule ${selectedVehicle?.regnum} ?`}
      />

      {/* Dialogue pour afficher les données du véhicule depuis l'API */}
      <Dialog 
        open={isVehicleDataDialogOpen} 
        onOpenChange={setIsVehicleDataDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Données du véhicule {vehicleData?.registration}
            </DialogTitle>
          </DialogHeader>
          {vehicleData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Immatriculation</Label>
                  <p className="font-medium">{vehicleData.registration}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Marque/Modèle</Label>
                  <p className="font-medium">{vehicleData.make} {vehicleData.model}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Année</Label>
                  <p className="font-medium">{vehicleData.year}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Statut</Label>
                  <p className="font-medium">{vehicleData.status}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Niveau de carburant</Label>
                  <p className="font-medium">{vehicleData.fuelLevel}%</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Kilométrage</Label>
                  <p className="font-medium">{vehicleData.mileage} km</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h3 className="font-semibold">Dernière position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500">Latitude/Longitude</Label>
                    <p className="font-medium">
                      {vehicleData.lastPosition.latitude}, {vehicleData.lastPosition.longitude}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Horodatage</Label>
                    <p className="font-medium">
                      {new Date(vehicleData.lastPosition.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Vitesse</Label>
                    <p className="font-medium">{vehicleData.lastPosition.speed} km/h</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Direction</Label>
                    <p className="font-medium">{vehicleData.lastPosition.direction}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsVehicleDataDialogOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour la mise à niveau du plan */}
      <PlanUpgradeDialog 
        isOpen={isPlanUpgradeOpen}
        onClose={() => setIsPlanUpgradeOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default UserDashboardPage;
