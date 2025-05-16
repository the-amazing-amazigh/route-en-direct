
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AdminMenu from "../components/AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, User, Lock, Unlock, Trash2, Eye } from "lucide-react";
import { isAuthenticated, isAdmin } from "../services/api";
import { toast } from "sonner";
import ConfirmDialog from "@/components/crud/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Vérification de l'authentification et du rôle admin
  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/login");
    } else {
      loadUsers();
    }
  }, [navigate]);

  const loadUsers = () => {
    setLoading(true);
    
    try {
      // Récupérer uniquement les utilisateurs réguliers (pas l'admin)
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(allUsers);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (user: any) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    const action = user.isActive ? "désactivé" : "activé";
    toast.success(`Compte de ${user.name} ${action} avec succès`);
  };

  const handleTogglePlan = (user: any) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { 
          ...u, 
          plan: u.plan === "gratuit" ? "premium" : "gratuit" 
        };
      }
      return u;
    });
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    const newPlan = user.plan === "gratuit" ? "Premium" : "Gratuit";
    toast.success(`Plan de ${user.name} changé à ${newPlan} avec succès`);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    setSelectedUser(null);
    setIsDeleteDialogOpen(false);
    
    toast.success(`Compte de ${selectedUser.name} supprimé avec succès`);
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
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-route-primary"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun utilisateur inscrit pour le moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Véhicules</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.plan === "premium" ? (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex items-center w-fit gap-1">
                                  <Crown className="h-3 w-3 text-amber-500" />
                                  Premium
                                </Badge>
                              ) : (
                                <Badge variant="outline">Gratuit</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.vehicles?.length || 0}
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Désactivé
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleTogglePlan(user)}
                              >
                                <Crown className={`h-4 w-4 ${user.plan === "premium" ? "text-amber-500" : ""}`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleToggleStatus(user)}
                              >
                                {user.isActive ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" />
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
      
      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Supprimer un utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer le compte de ${selectedUser?.name} ? Cette action est irréversible.`}
      />
      
      {/* Dialogue de détails de l'utilisateur */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Nom</p>
                <p>{selectedUser.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Plan</p>
                <p className="flex items-center">
                  {selectedUser.plan === "premium" ? (
                    <>
                      <Crown className="h-4 w-4 text-amber-500 mr-1" />
                      Premium
                    </>
                  ) : (
                    "Gratuit"
                  )}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p>
                  {selectedUser.isActive ? (
                    <span className="text-green-600">Actif</span>
                  ) : (
                    <span className="text-red-600">Désactivé</span>
                  )}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Véhicules ({selectedUser.vehicles?.length || 0})</p>
                {selectedUser.vehicles && selectedUser.vehicles.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Immatriculation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedUser.vehicles.map((vehicle: any) => (
                          <tr key={vehicle.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              {vehicle.regnum}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun véhicule</p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
