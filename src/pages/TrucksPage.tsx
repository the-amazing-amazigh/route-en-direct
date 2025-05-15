
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";

const TrucksPage = () => {
  // Mock trucks data (normally would come from an API)
  const trucks = [
    { id: "truck-001", registration: "AB-123-CD", model: "Volvo FH16", year: 2022, status: "En service" },
    { id: "truck-002", registration: "EF-456-GH", model: "Mercedes Actros", year: 2021, status: "En service" },
    { id: "truck-003", registration: "IJ-789-KL", model: "Scania R450", year: 2020, status: "En maintenance" },
    { id: "truck-004", registration: "MN-012-OP", model: "DAF XF", year: 2023, status: "En service" },
    { id: "truck-005", registration: "QR-345-ST", model: "Renault T High", year: 2022, status: "Disponible" },
  ];

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
                <CardTitle>Gestion des véhicules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immatriculation</TableHead>
                        <TableHead>Modèle</TableHead>
                        <TableHead>Année</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trucks.map((truck) => (
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrucksPage;
