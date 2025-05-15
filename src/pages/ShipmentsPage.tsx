
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";
import { getAllShipments } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@/types";

const ShipmentsPage = () => {
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: getAllShipments,
  });

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
              <CardHeader>
                <CardTitle>Gestion des livraisons</CardTitle>
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
