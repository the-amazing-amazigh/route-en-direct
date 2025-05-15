
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminMenu from "@/components/AdminMenu";
import NavBar from "@/components/NavBar";

const DriversPage = () => {
  // Mock drivers data (normally would come from an API)
  const drivers = [
    { id: "driver-001", name: "Jean Dupont", phone: "06 12 34 56 78", license: "Poids lourd", experience: "5 ans", status: "En service" },
    { id: "driver-002", name: "Marie Martin", phone: "06 23 45 67 89", license: "Super lourd", experience: "8 ans", status: "En service" },
    { id: "driver-003", name: "Paul Bernard", phone: "06 34 56 78 90", license: "Poids lourd", experience: "3 ans", status: "En repos" },
    { id: "driver-004", name: "Sophie Petit", phone: "06 45 67 89 01", license: "Super lourd", experience: "6 ans", status: "En congé" },
    { id: "driver-005", name: "Thomas Richard", phone: "06 56 78 90 12", license: "Poids lourd", experience: "4 ans", status: "En service" },
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
                <CardTitle>Gestion des chauffeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Permis</TableHead>
                        <TableHead>Expérience</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
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

export default DriversPage;
