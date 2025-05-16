
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

// Définir le schéma de validation pour les livraisons
const shipmentSchema = z.object({
  trackingId: z.string().min(5, "Le numéro de suivi doit contenir au moins 5 caractères"),
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
  origin: z.string().min(2, "L'origine doit contenir au moins 2 caractères"),
  destination: z.string().min(2, "La destination doit contenir au moins 2 caractères"),
  departureTime: z.string().min(1, "La date de départ est requise"),
  eta: z.string().min(1, "La date d'arrivée estimée est requise"),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

type ShipmentFormProps = {
  onSubmit: (data: ShipmentFormValues) => void;
  initialData?: {
    trackingId: string;
    description: string;
    status: ShipmentStatus;
    clientName: string;
    origin: string;
    destination: string;
    departureTime: string;
    eta: string;
  };
  onCancel: () => void;
};

export function ShipmentForm({ onSubmit, initialData, onCancel }: ShipmentFormProps) {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: initialData || {
      trackingId: "",
      description: "",
      status: ShipmentStatus.EnChargement,
      clientName: "",
      origin: "",
      destination: "",
      departureTime: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0,5),
      eta: new Date(Date.now() + 86400000).toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0,5),
    },
  });

  function onFormSubmit(data: ShipmentFormValues) {
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
              <FormLabel>Numéro de suivi</FormLabel>
              <FormControl>
                <Input placeholder="RED-123456" {...field} />
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
                  <SelectItem value={ShipmentStatus.EnTransit}>En transit</SelectItem>
                  <SelectItem value={ShipmentStatus.EnRoute}>En route</SelectItem>
                  <SelectItem value={ShipmentStatus.EnDouane}>En douane</SelectItem>
                  <SelectItem value={ShipmentStatus.EnFerry}>En ferry</SelectItem>
                  <SelectItem value={ShipmentStatus.SurSiteClient}>Sur site client</SelectItem>
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
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origine</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu d'origine" {...field} />
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
