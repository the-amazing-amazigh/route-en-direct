
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllLocations, addLocation, updateLocation, deleteLocation } from "@/services/api";
import { Location } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "@/components/crud/LocationForm";
import ConfirmDialog from "@/components/crud/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

const LocationsPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });

  // Mutations pour les opérations CRUD
  const addMutation = useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsAddDialogOpen(false);
      toast.success("Lieu ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateLocation(selectedLocation!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsEditDialogOpen(false);
      setSelectedLocation(null);
      toast.success("Lieu mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteLocation(selectedLocation!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
      toast.success("Lieu supprimé avec succès");
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
  
  const openEditDialog = (location: Location) => {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const getLocationTypeBadge = (type: string) => {
    switch(type) {
      case 'pickup':
        return <Badge variant="default">Chargement</Badge>;
      case 'delivery':
        return <Badge variant="secondary">Livraison</Badge>;
      case 'customs':
        return <Badge variant="destructive">Douane</Badge>;
      case 'ferry':
        return <Badge className="bg-blue-500">Ferry</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
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
                <CardTitle>Gestion des lieux</CardTitle>
                <Button onClick={handleAdd} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-route-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-route-error p-4">Erreur lors du chargement des lieux</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Adresse</TableHead>
                          <TableHead>Rayon (m)</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {locations?.map((location: Location) => (
                          <TableRow key={location.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                {location.name}
                              </div>
                            </TableCell>
                            <TableCell>{getLocationTypeBadge(location.type)}</TableCell>
                            <TableCell>{location.address}</TableCell>
                            <TableCell>{location.radius || 500}m</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                location.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {location.active ? 'Actif' : 'Inactif'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(location)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(location)}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialogues pour l'ajout, la modification et la suppression */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un lieu</DialogTitle>
          </DialogHeader>
          <LocationForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un lieu</DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <LocationForm 
              initialData={{
                name: selectedLocation.name,
                type: selectedLocation.type,
                address: selectedLocation.address,
                position: selectedLocation.position,
                radius: selectedLocation.radius || 500,
                active: selectedLocation.active,
              }}
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
        title="Supprimer un lieu"
        description={`Êtes-vous sûr de vouloir supprimer le lieu ${selectedLocation?.name} ?`}
      />
    </div>
  );
};

export default LocationsPage;
