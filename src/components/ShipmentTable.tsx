
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shipment, ShipmentStatus } from "../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ShipmentTableProps {
  shipments: Shipment[];
}

const ShipmentTable = ({ shipments }: ShipmentTableProps) => {
  const [sortField, setSortField] = useState<keyof Shipment>("departureTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();
  
  const handleSort = (field: keyof Shipment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const sortedShipments = [...shipments].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    // Traitement particulier pour les champs imbriqués
    if (sortField === "status") {
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    } else if (sortField === "departureTime" || sortField === "eta") {
      if (sortDirection === "asc") {
        return new Date(aValue).getTime() - new Date(bValue).getTime();
      } else {
        return new Date(bValue).getTime() - new Date(aValue).getTime();
      }
    }
    
    return 0;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const getStatusColor = (status: ShipmentStatus): string => {
    switch (status) {
      case ShipmentStatus.Livree:
        return "bg-green-500 text-white";
      case ShipmentStatus.EnChargement:
      case ShipmentStatus.Charge:
        return "bg-yellow-500 text-white";
      case ShipmentStatus.EnTransit:
      case ShipmentStatus.EnRoute:
        return "bg-blue-500 text-white";
      case ShipmentStatus.EnDouane:
        return "bg-orange-500 text-white";
      case ShipmentStatus.EnFerry:
        return "bg-purple-500 text-white";
      case ShipmentStatus.SurSiteClient:
        return "bg-teal-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  const handleViewDetails = (trackingId: string) => {
    navigate(`/tracking/${trackingId}`);
  };
  
  const handleCopyTrackingLink = (trackingId: string) => {
    const url = `${window.location.origin}/tracking/${trackingId}`;
    navigator.clipboard.writeText(url);
    alert("Lien de suivi copié dans le presse-papier");
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("trackingId")}
            >
              Numéro de suivi
              {sortField === "trackingId" && (
                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Statut
              {sortField === "status" && (
                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("departureTime")}
            >
              Départ
              {sortField === "departureTime" && (
                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("eta")}
            >
              ETA
              {sortField === "eta" && (
                <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedShipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">{shipment.trackingId}</TableCell>
              <TableCell>{shipment.description.length > 30 ? `${shipment.description.substring(0, 30)}...` : shipment.description}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(shipment.status)}>
                  {shipment.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(shipment.departureTime)}</TableCell>
              <TableCell>{formatDate(shipment.eta)}</TableCell>
              <TableCell>{shipment.client.name}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(shipment.trackingId)}
                >
                  Détails
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyTrackingLink(shipment.trackingId)}
                >
                  Copier lien
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentTable;
