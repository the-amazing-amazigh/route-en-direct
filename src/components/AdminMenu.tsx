
import { Link, useLocation } from "react-router-dom";

const AdminMenu = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: "/admin", label: "Tableau de bord" },
    { path: "/admin/shipments", label: "Livraisons" },
    { path: "/admin/trucks", label: "Véhicules" },
    { path: "/admin/drivers", label: "Chauffeurs" },
    { path: "/admin/settings", label: "Paramètres" },
  ];
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Administration</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-route-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;
