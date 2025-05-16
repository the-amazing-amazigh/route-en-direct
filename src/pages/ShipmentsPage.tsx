
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllShipments } from "@/services/api";
import { Shipment } from "@/types";
import { toast } from "sonner";

const ShipmentsPage = () => {
  // État pour suivre l'ID du shipment actuellement sélectionné
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: getAllShipments,
  });

  const handleEdit = (id: string) => {
    setSelectedId(id);
    // Pour l'instant, on affiche juste un toast car l'édition des livraisons est plus complexe
    toast.info("Fonctionnalité d'édition des livraisons à venir");
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    // Pour l'instant, on affiche juste un toast car la suppression des livraisons est plus complexe
    toast.info("Fonctionnalité de suppression des livraisons à venir");
  };

  const handleAdd = () => {
    // Pour l'instant, on affiche juste un toast car l'ajout des livraisons est plus complexe
    toast.info("Fonctionnalité d'ajout de livraisons à venir");
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
                                onClick={() => handleEdit(shipment.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(shipment.id)}
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
    </div>
  );
};

export default ShipmentsPage;
