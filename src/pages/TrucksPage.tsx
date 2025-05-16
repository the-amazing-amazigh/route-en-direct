
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTrucks, addTruck, updateTruck, deleteTruck } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TruckForm } from "@/components/crud/TruckForm";
import ConfirmDialog from "@/components/crud/ConfirmDialog";
import { toast } from "sonner";

const TrucksPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  
  // Récupérer la liste des véhicules
  const { data: trucks, isLoading, error } = useQuery({
    queryKey: ['trucks'],
    queryFn: getAllTrucks,
  });
  
  // Mutations pour les opérations CRUD
  const addMutation = useMutation({
    mutationFn: addTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      setIsAddDialogOpen(false);
      toast.success("Véhicule ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateTruck(selectedTruck.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      setIsEditDialogOpen(false);
      setSelectedTruck(null);
      toast.success("Véhicule mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteTruck(selectedTruck.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      setIsDeleteDialogOpen(false);
      setSelectedTruck(null);
      toast.success("Véhicule supprimé avec succès");
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
  
  const openEditDialog = (truck: any) => {
    setSelectedTruck(truck);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (truck: any) => {
    setSelectedTruck(truck);
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
                <CardTitle>Gestion des véhicules</CardTitle>
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
                  <div className="text-route-error p-4">Erreur lors du chargement des véhicules</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Immatriculation</TableHead>
                          <TableHead>Modèle</TableHead>
                          <TableHead>Année</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trucks?.map((truck: any) => (
                          <TableRow key={truck.id}>
                            <TableCell className="font-medium">{truck.registration}</TableCell>
                            <TableCell>{truck.model}</TableCell>
                            <TableCell>{truck.year}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                truck.status === 'En service' 
                                  ? 'bg-green-100 text-green-800' 
                                  : truck.status === 'En maintenance'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {truck.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(truck)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(truck)}>
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
            <DialogTitle>Ajouter un véhicule</DialogTitle>
          </DialogHeader>
          <TruckForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un véhicule</DialogTitle>
          </DialogHeader>
          {selectedTruck && (
            <TruckForm 
              initialData={selectedTruck}
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
        title="Supprimer un véhicule"
        description={`Êtes-vous sûr de vouloir supprimer le véhicule ${selectedTruck?.registration} ?`}
      />
    </div>
  );
};

export default TrucksPage;
