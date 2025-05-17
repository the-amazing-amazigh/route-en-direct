
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllClients, addClient, updateClient, deleteClient } from "@/services/api";
import { Client } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "@/components/crud/ClientForm";
import ConfirmDialog from "@/components/crud/ConfirmDialog";

const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getAllClients,
  });

  // Mutations pour les opérations CRUD
  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsAddDialogOpen(false);
      toast.success("Client ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateClient(selectedClient!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsEditDialogOpen(false);
      setSelectedClient(null);
      toast.success("Client mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(selectedClient!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
      toast.success("Client supprimé avec succès");
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
  
  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
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
                <CardTitle>Gestion des clients</CardTitle>
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
                  <div className="text-route-error p-4">Erreur lors du chargement des clients</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients?.map((client: Client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-gray-400" />
                                {client.name}
                              </div>
                            </TableCell>
                            <TableCell>{client.contact}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                client.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {client.active ? 'Actif' : 'Inactif'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(client)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(client)}
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
            <DialogTitle>Ajouter un client</DialogTitle>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm 
              initialData={{
                name: selectedClient.name,
                contact: selectedClient.contact,
                email: selectedClient.email,
                phone: selectedClient.phone,
                address: selectedClient.address,
                notes: selectedClient.notes || "",
                active: selectedClient.active,
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
        title="Supprimer un client"
        description={`Êtes-vous sûr de vouloir supprimer le client ${selectedClient?.name} ?`}
      />
    </div>
  );
};

export default ClientsPage;
