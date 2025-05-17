
import { Link, useLocation } from "react-router-dom";
import { Truck, Users, Package, Settings, Map, Building } from "lucide-react";

const AdminMenu = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: "/admin", label: "Tableau de bord", icon: Package },
    { path: "/admin/shipments", label: "Livraisons", icon: Package },
    { path: "/admin/locations", label: "Lieux", icon: Map },
    { path: "/admin/clients", label: "Clients", icon: Building },
    { path: "/admin/trucks", label: "Véhicules", icon: Truck },
    { path: "/admin/drivers", label: "Chauffeurs", icon: Users },
    { path: "/admin/users", label: "Utilisateurs", icon: Users },
    { path: "/admin/settings", label: "Paramètres", icon: Settings },
  ];
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Administration</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
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
  );
};

export default AdminMenu;
