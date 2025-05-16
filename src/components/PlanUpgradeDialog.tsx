
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlanUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanUpgradeDialog = ({ isOpen, onClose }: PlanUpgradeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      // Simuler une requête de mise à niveau
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mettre à jour le plan de l'utilisateur dans localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User not authenticated");
      }
      
      const user = JSON.parse(userStr);
      user.plan = "premium";
      localStorage.setItem("user", JSON.stringify(user));
      
      // Mettre également à jour dans la "base de données" des utilisateurs
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        allUsers[userIndex].plan = "premium";
        localStorage.setItem("users", JSON.stringify(allUsers));
      }
      
      toast.success("Félicitations ! Vous avez été mis à niveau vers le plan Premium");
      onClose();
      
      // Forcer le rechargement de la page pour refléter les changements
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à niveau:", error);
      toast.error("Erreur lors de la mise à niveau");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crown className="h-5 w-5 text-amber-500 mr-2" />
            Passez au Plan Premium
          </DialogTitle>
          <DialogDescription>
            Débloquez des fonctionnalités avancées et des avantages exclusifs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Plan Gratuit</h3>
              <ul className="text-sm space-y-2">
                <li>✓ 1 véhicule maximum</li>
                <li>✓ Suivi de base</li>
                <li>✓ API CarrierWeb</li>
              </ul>
              <div className="mt-4 text-lg font-bold">
                0€/mois
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Plan actuel
              </div>
            </div>
            
            <div className="border border-amber-300 rounded-lg p-4 bg-amber-50 shadow-sm">
              <h3 className="font-medium mb-2 flex items-center">
                <Crown className="h-4 w-4 text-amber-500 mr-1" />
                Plan Premium
              </h3>
              <ul className="text-sm space-y-2">
                <li>✓ Véhicules illimités</li>
                <li>✓ Suivi avancé</li>
                <li>✓ API CarrierWeb</li>
                <li>✓ Support prioritaire</li>
              </ul>
              <div className="mt-4 text-lg font-bold">
                9,99€/mois
              </div>
              <div className="text-xs text-amber-600 mt-1">
                Recommandé
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            En passant au plan Premium, vous acceptez les conditions générales d'utilisation et de facturation.
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isLoading ? "Traitement en cours..." : "Passer au Premium"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeDialog;
