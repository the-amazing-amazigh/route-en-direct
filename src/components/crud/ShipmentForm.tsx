
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShipmentStatus } from "@/types";
import { useEffect, useState } from "react";
import { getAllTrucks } from "@/services/api";

// Définir le schéma de validation pour les livraisons
const shipmentSchema = z.object({
  trackingId: z.string().optional(),
  description: z.string().min(5, "La description doit contenir au moins 5 caractères"),
  status: z.enum([
    ShipmentStatus.EnChargement,
    ShipmentStatus.Charge,
    ShipmentStatus.EnTransit,
    ShipmentStatus.EnRoute,
    ShipmentStatus.EnDouane,
    ShipmentStatus.EnFerry,
    ShipmentStatus.SurSiteClient,
    ShipmentStatus.Livree
  ]),
  clientName: z.string().min(2, "Le nom du client doit contenir au moins 2 caractères"),
  shipper: z.string().min(2, "L'expéditeur doit contenir au moins 2 caractères"),
  destination: z.string().min(2, "La destination doit contenir au moins 2 caractères"),
  departureTime: z.string().min(1, "La date de départ est requise"),
  eta: z.string().min(1, "La date d'arrivée estimée est requise"),
  truckId: z.string().min(1, "Le tracteur est requis"),
  trailerId: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

type ShipmentFormProps = {
  onSubmit: (data: ShipmentFormValues) => void;
  initialData?: {
    trackingId?: string;
    description: string;
    status: ShipmentStatus;
    clientName: string;
    shipper: string;
    destination: string;
    departureTime: string;
    eta: string;
    truckId?: string;
    trailerId?: string;
  };
  onCancel: () => void;
};

export function ShipmentForm({ onSubmit, initialData, onCancel }: ShipmentFormProps) {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Générer un numéro de suivi aléatoire
  const generateTrackingId = () => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `RED-${randomChars}${timestamp}`;
  };
  
  useEffect(() => {
    const loadTrucks = async () => {
      setIsLoading(true);
      try {
        const trucksData = await getAllTrucks();
        setTrucks(trucksData);
      } catch (error) {
        toast.error("Erreur lors du chargement des véhicules");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrucks();
  }, []);

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: initialData || {
      trackingId: generateTrackingId(),
      description: "",
      status: ShipmentStatus.EnChargement,
      clientName: "",
      shipper: "",
      destination: "",
      departureTime: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0,5),
      eta: new Date(Date.now() + 86400000).toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0,5),
      truckId: "",
      trailerId: "",
    },
  });

  function onFormSubmit(data: ShipmentFormValues) {
    // Si c'est une nouvelle livraison et qu'il n'y a pas de trackingId, en générer un
    if (!data.trackingId) {
      data.trackingId = generateTrackingId();
    }
    
    onSubmit(data);
    toast.success("Livraison enregistrée avec succès");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="trackingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de suivi (généré automatiquement)</FormLabel>
              <FormControl>
                <Input placeholder="RED-123456" {...field} value={field.value || ""} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de la livraison" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ShipmentStatus.EnChargement}>En chargement</SelectItem>
                  <SelectItem value={ShipmentStatus.Charge}>Chargé</SelectItem>
                  <SelectItem value={ShipmentStatus.EnDouane}>En douane</SelectItem>
                  <SelectItem value={ShipmentStatus.Livree}>Livrée</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder="Nom du client" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipper"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expéditeur</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu d'expédition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu de destination" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="truckId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracteur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un tracteur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      trucks
                        .filter(truck => truck.status !== "En maintenance")
                        .map(truck => (
                          <SelectItem key={truck.id} value={truck.id}>
                            {truck.registration} - {truck.model}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="trailerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remorque (optionnel)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une remorque" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Aucune remorque</SelectItem>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      trucks
                        .filter(truck => truck.type === "trailer" && truck.status !== "En maintenance")
                        .map(trailer => (
                          <SelectItem key={trailer.id} value={trailer.id}>
                            {trailer.registration}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de départ</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'arrivée estimée</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
}
