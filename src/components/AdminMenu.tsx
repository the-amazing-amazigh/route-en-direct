
import { Link, useLocation } from "react-router-dom";
import { Truck, Users, Package, Settings, Map, Building } from "lucide-react";

const AdminMenu = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Regroupement des éléments du menu par catégorie
  const menuCategories = [
    {
      title: "Transport",
      items: [
        { path: "/admin/shipments", label: "Livraisons", icon: Package },
        { path: "/admin/trucks", label: "Véhicules", icon: Truck },
        { path: "/admin/drivers", label: "Chauffeurs", icon: Users },
      ]
    },
    {
      title: "Données de base",
      items: [
        { path: "/admin/locations", label: "Lieux", icon: Map },
        { path: "/admin/clients", label: "Clients", icon: Building },
      ]
    },
    {
      title: "Administration",
      items: [
        { path: "/admin/users", label: "Utilisateurs", icon: Users },
        { path: "/admin/settings", label: "Paramètres", icon: Settings },
      ]
    },
  ];
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Administration</h2>
      <div className="space-y-6">
        <div>
          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              isActive("/admin")
                ? "bg-route-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <Package className="mr-2 h-5 w-5" />
            Tableau de bord
          </Link>
        </div>

        {menuCategories.map((category, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 px-4 mb-2">{category.title}</h3>
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-route-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
