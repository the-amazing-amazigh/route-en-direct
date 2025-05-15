
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TrackingForm = () => {
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError("Veuillez saisir un numéro de suivi");
      return;
    }
    
    setError("");
    navigate(`/tracking/${trackingId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Suivre un envoi</h2>
        <p className="text-gray-600">
          Entrez votre numéro de référence pour suivre votre livraison en temps réel
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Input
            type="text"
            placeholder="Numéro de suivi (ex: FTL25698745)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-route-primary hover:bg-blue-700">
            Suivre
          </Button>
        </div>
        
        {error && <p className="text-route-error text-sm">{error}</p>}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Exemples de numéros de suivi pour la démo :</p>
          <ul className="list-disc list-inside mt-1">
            <li>FTL25698745 - En transit</li>
            <li>FTL36912478 - En douane</li>
            <li>FTL74125896 - En ferry</li>
            <li>FTL95123647 - Livrée</li>
          </ul>
        </div>
      </div>
    </form>
  );
};

export default TrackingForm;
