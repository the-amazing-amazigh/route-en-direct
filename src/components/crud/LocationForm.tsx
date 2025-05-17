
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Définir le schéma de validation pour les lieux
const locationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  type: z.enum(["pickup", "delivery", "customs", "ferry", "other"]),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(10).max(5000),
  active: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationSchema>;

type LocationFormProps = {
  onSubmit: (data: any) => void;
  initialData?: {
    name: string;
    type: string;
    address: string;
    position: { lat: number; lng: number };
    radius?: number;
    active: boolean;
  };
  onCancel: () => void;
};

export function LocationForm({ onSubmit, initialData, onCancel }: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      type: initialData.type as "pickup" | "delivery" | "customs" | "ferry" | "other",
      address: initialData.address,
      latitude: initialData.position.lat,
      longitude: initialData.position.lng,
      radius: initialData.radius || 500,
      active: initialData.active,
    } : {
      name: "",
      type: "pickup",
      address: "",
      latitude: 48.8566,
      longitude: 2.3522,
      radius: 500,
      active: true,
    },
  });

  function onFormSubmit(values: LocationFormValues) {
    const formattedData = {
      name: values.name,
      type: values.type,
      address: values.address,
      position: {
        lat: values.latitude,
        lng: values.longitude,
      },
      radius: values.radius,
      active: values.active,
    };
    
    onSubmit(formattedData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du lieu</FormLabel>
              <FormControl>
                <Input placeholder="Entrepôt principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de lieu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pickup">Chargement</SelectItem>
                  <SelectItem value="delivery">Livraison</SelectItem>
                  <SelectItem value="customs">Douane</SelectItem>
                  <SelectItem value="ferry">Ferry</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Les lieux de type "Ferry" et "Client" sont utilisés pour la détection automatique de statut.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="123 rue de Paris, 75001 Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rayon de détection (mètres)</FormLabel>
              <FormControl>
                <Input type="number" min="10" max="5000" {...field} />
              </FormControl>
              <FormDescription>
                Rayon en mètres autour du point pour la détection automatique (10 à 5000m)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Actif</FormLabel>
                <FormDescription>
                  Décochez pour désactiver temporairement ce lieu
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
}
