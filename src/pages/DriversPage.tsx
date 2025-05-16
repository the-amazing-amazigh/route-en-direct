
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllDrivers, addDriver, updateDriver, deleteDriver } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DriverForm } from "@/components/crud/DriverForm";
import ConfirmDialog from "@/components/crud/ConfirmDialog";
import { toast } from "sonner";

const DriversPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  
  // Récupérer la liste des chauffeurs
  const { data: drivers, isLoading, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: getAllDrivers,
  });
  
  // Mutations pour les opérations CRUD
  const addMutation = useMutation({
    mutationFn: addDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsAddDialogOpen(false);
      toast.success("Chauffeur ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateDriver(selectedDriver.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsEditDialogOpen(false);
      setSelectedDriver(null);
      toast.success("Chauffeur mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteDriver(selectedDriver.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsDeleteDialogOpen(false);
      setSelectedDriver(null);
      toast.success("Chauffeur supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error}`);
    }
  });
  
  // Handlers
  const handleAddSubmit = (data: any) => {
    addMutation.mutate(data);
  };
  
  const handleEditSubmit = (data: any) => {
    updateMutation.mutate(data);
  };
  
  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };
  
  const openEditDialog = (driver: any) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (driver: any) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestion des chauffeurs</CardTitle>
                <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-route-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-route-error p-4">Erreur lors du chargement des chauffeurs</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Permis</TableHead>
                          <TableHead>Expérience</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drivers?.map((driver: any) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">{driver.name}</TableCell>
                            <TableCell>{driver.phone}</TableCell>
                            <TableCell>{driver.license}</TableCell>
                            <TableCell>{driver.experience}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                driver.status === 'En service' 
                                  ? 'bg-green-100 text-green-800' 
                                  : driver.status === 'En congé'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {driver.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(driver)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(driver)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialogues pour l'ajout, la modification et la suppression */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un chauffeur</DialogTitle>
          </DialogHeader>
          <DriverForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un chauffeur</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <DriverForm 
              initialData={selectedDriver}
              onSubmit={handleEditSubmit} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer un chauffeur"
        description={`Êtes-vous sûr de vouloir supprimer le chauffeur ${selectedDriver?.name} ?`}
      />
    </div>
  );
};

export default DriversPage;
