
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllShipments, addShipment, updateShipment, deleteShipment } from "@/services/api";
import { Shipment } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentForm } from "@/components/crud/ShipmentForm";
import ConfirmDialog from "@/components/crud/ConfirmDialog";

const ShipmentsPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: getAllShipments,
  });

  // Mutations pour les opérations CRUD
  const addMutation = useMutation({
    mutationFn: addShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setIsAddDialogOpen(false);
      toast.success("Livraison ajoutée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateShipment(selectedShipment!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setIsEditDialogOpen(false);
      setSelectedShipment(null);
      toast.success("Livraison mise à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteShipment(selectedShipment!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setIsDeleteDialogOpen(false);
      setSelectedShipment(null);
      toast.success("Livraison supprimée avec succès");
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
  
  const openEditDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAdd = () => {
    setIsAddDialogOpen(true);
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
                <CardTitle>Gestion des livraisons</CardTitle>
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
                  <div className="text-route-error p-4">Erreur lors du chargement des livraisons</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Origine</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipments?.map((shipment: Shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell className="font-medium">{shipment.trackingId}</TableCell>
                            <TableCell>{shipment.client.name}</TableCell>
                            <TableCell>{shipment.origin.name}</TableCell>
                            <TableCell>{shipment.destination.name}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                shipment.status === 'Livrée' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {shipment.status}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(shipment.eta).toLocaleString("fr-FR")}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(shipment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(shipment)}
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
            <DialogTitle>Ajouter une livraison</DialogTitle>
          </DialogHeader>
          <ShipmentForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier une livraison</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <ShipmentForm 
              initialData={{
                trackingId: selectedShipment.trackingId,
                description: selectedShipment.description,
                status: selectedShipment.status,
                clientName: selectedShipment.client.name,
                origin: selectedShipment.origin.name,
                destination: selectedShipment.destination.name,
                departureTime: new Date(selectedShipment.departureTime).toISOString().slice(0, 16),
                eta: new Date(selectedShipment.eta).toISOString().slice(0, 16),
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
        title="Supprimer une livraison"
        description={`Êtes-vous sûr de vouloir supprimer la livraison ${selectedShipment?.trackingId} ?`}
      />
    </div>
  );
};

export default ShipmentsPage;
