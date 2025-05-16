
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

// Définir le schéma de validation pour les chauffeurs
const driverSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le téléphone doit contenir au moins 10 caractères"),
  license: z.enum(["Poids lourd", "Super lourd"]),
  experience: z.string().min(4, "L'expérience doit être spécifiée (ex: 5 ans)"),
  status: z.enum(["En service", "En repos", "En congé"]),
});

type DriverFormValues = z.infer<typeof driverSchema>;

type DriverFormProps = {
  onSubmit: (data: DriverFormValues) => void;
  initialData?: {
    name: string;
    phone: string;
    license: "Poids lourd" | "Super lourd";
    experience: string;
    status: "En service" | "En repos" | "En congé";
  };
  onCancel: () => void;
};

export function DriverForm({ onSubmit, initialData, onCancel }: DriverFormProps) {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      license: "Poids lourd",
      experience: "",
      status: "En service",
    },
  });

  function onFormSubmit(data: DriverFormValues) {
    onSubmit(data);
    toast.success("Chauffeur enregistré avec succès");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom et prénom</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="06 12 34 56 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permis</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un permis" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Poids lourd">Poids lourd</SelectItem>
                  <SelectItem value="Super lourd">Super lourd</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expérience</FormLabel>
              <FormControl>
                <Input placeholder="5 ans" {...field} />
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
                  <SelectItem value="En repos">En repos</SelectItem>
                  <SelectItem value="En congé">En congé</SelectItem>
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
