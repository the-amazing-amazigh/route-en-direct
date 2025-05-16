
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
import { toast } from "sonner";

// Définir le schéma de validation pour les camions
const truckSchema = z.object({
  registration: z.string().min(5, "L'immatriculation doit contenir au moins 5 caractères"),
  model: z.string().min(2, "Le modèle doit contenir au moins 2 caractères"),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  status: z.enum(["En service", "En maintenance", "Disponible"]),
});

type TruckFormValues = z.infer<typeof truckSchema>;

type TruckFormProps = {
  onSubmit: (data: TruckFormValues) => void;
  initialData?: {
    registration: string;
    model: string;
    year: number;
    status: string;
  };
  onCancel: () => void;
};

export function TruckForm({ onSubmit, initialData, onCancel }: TruckFormProps) {
  // 1. Définir un formulaire avec état par défaut et options
  const form = useForm<TruckFormValues>({
    resolver: zodResolver(truckSchema),
    defaultValues: initialData || {
      registration: "",
      model: "",
      year: new Date().getFullYear(),
      status: "Disponible",
    },
  });

  // 2. Définir une fonction de soumission
  function onFormSubmit(data: TruckFormValues) {
    onSubmit(data);
    toast.success("Véhicule enregistré avec succès");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="registration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="AB-123-CD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input placeholder="Volvo FH16" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                  <SelectItem value="En service">En service</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
