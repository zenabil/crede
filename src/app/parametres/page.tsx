'use client';
import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMockData } from '@/hooks/use-mock-data';
import { updateCompanyInfo, exportData } from '@/lib/mock-data/api';
import { useToast } from '@/hooks/use-toast';
import SettingsLoading from './loading';
import { Download, Save, Loader2 } from 'lucide-react';
import { ResetAllDataDialog } from '@/components/settings/reset-all-data-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const companyInfoSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis."),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }).or(z.literal('')).optional(),
  logoUrl: z.string().url({ message: 'Veuillez entrer une URL valide.' }).or(z.literal('')).optional(),
  extraInfo: z.string().optional(),
  paymentTermsDays: z.coerce.number().int().min(0, 'Le nombre de jours doit être positif.'),
});

export default function SettingsPage() {
  const { settings, loading } = useMockData();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { isPending, errors, handleSubmit } = useFormSubmission({
    formRef,
    schema: companyInfoSchema,
    config: {
      successMessage: "Informations sur l'entreprise mises à jour.",
      errorMessage: 'Impossible de mettre à jour les informations.',
    },
    onSubmit: async (data) => {
      await updateCompanyInfo(data);
    },
  });

  const handleExportData = () => {
    try {
      exportData();
      toast({
        title: 'Exportation réussie',
        description: 'Vos données sont en cours de téléchargement.',
      });
    } catch (error) {
        toast({
            title: 'Erreur',
            description: 'Impossible d\'exporter les données.',
            variant: 'destructive',
        });
    }
  };

  if (loading) {
    return <SettingsLoading />;
  }

  const companyInfo = settings.companyInfo;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre entreprise et de votre application.
        </p>
      </header>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">Informations sur l'entreprise</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="data">Gestion des données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
            <Card>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <CardHeader>
                        <CardTitle>Informations sur l'entreprise</CardTitle>
                        <CardDescription>
                            Ces informations seront utilisées dans les factures et autres documents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de l'entreprise</Label>
                                <Input id="name" name="name" defaultValue={companyInfo.name} />
                                {errors?.name && <p className="text-sm font-medium text-destructive">{errors.name._errors[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" name="phone" defaultValue={companyInfo.phone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" name="address" defaultValue={companyInfo.address} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={companyInfo.email} />
                             {errors?.email && <p className="text-sm font-medium text-destructive">{errors.email._errors[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">URL du Logo</Label>
                            <Input id="logoUrl" name="logoUrl" defaultValue={companyInfo.logoUrl} />
                            {errors?.logoUrl && <p className="text-sm font-medium text-destructive">{errors.logoUrl._errors[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="extraInfo">Informations Supplémentaires (N° Fiscal, etc.)</Label>
                            <Textarea id="extraInfo" name="extraInfo" defaultValue={companyInfo.extraInfo} />
                        </div>
                         <div className="space-y-2 max-w-sm">
                            <Label htmlFor="paymentTermsDays">Conditions de paiement (jours)</Label>
                            <Input id="paymentTermsDays" name="paymentTermsDays" type="number" defaultValue={companyInfo.paymentTermsDays} />
                            <p className="text-xs text-muted-foreground">Le nombre de jours avant qu'une facture ne soit considérée comme due.</p>
                            {errors?.paymentTermsDays && <p className="text-sm font-medium text-destructive">{errors.paymentTermsDays._errors[0]}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isPending}>
                           {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save />}
                           Enregistrer
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
            <Card>
                <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                        Personnalisez l'apparence de l'application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label>Changer de thème (Clair/Sombre)</Label>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="data">
             <Card>
                <CardHeader>
                  <CardTitle>Gestion des données</CardTitle>
                  <CardDescription>
                    Gérez l'importation, l'exportation et la réinitialisation de vos données.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleExportData} variant="outline">
                        <Download className="mr-2 h-4 w-4"/>
                        Exporter les données
                    </Button>
                   <ResetAllDataDialog />
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      L'exportation crée une sauvegarde complète de vos données (clients, produits, transactions, etc.) dans un fichier JSON. La réinitialisation effacera toutes les données actuelles et les remplacera par les données de démonstration initiales.
                    </p>
                </CardFooter>
              </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
