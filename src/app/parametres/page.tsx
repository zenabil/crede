'use client';
import { useState, useEffect } from 'react';
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
import { updateBreadUnitPrice, exportData } from '@/lib/mock-data/api';
import { useToast } from '@/hooks/use-toast';
import SettingsLoading from './loading';
import { Download } from 'lucide-react';
import { ResetAllDataDialog } from '@/components/settings/reset-all-data-dialog';

export default function SettingsPage() {
  const { settings, loading } = useMockData();
  const { toast } = useToast();
  const [breadPrice, setBreadPrice] = useState<number | string>('');

  useEffect(() => {
    if (settings) {
      setBreadPrice(settings.breadUnitPrice);
    }
  }, [settings]);

  const handleUpdateBreadPrice = async () => {
    const price = Number(breadPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un prix valide.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateBreadUnitPrice(price);
      toast({
        title: 'Succès',
        description: 'Le prix du pain a été mis à jour.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le prix du pain.',
        variant: 'destructive',
      });
    }
  };

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre application.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Données de l'application</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Commandes de Boulangerie</CardTitle>
          <CardDescription>
            Définissez les paramètres pour le module de commandes de pain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="bread-price">Prix unitaire du pain (DZD)</Label>
            <Input
              id="bread-price"
              type="number"
              value={breadPrice}
              onChange={(e) => setBreadPrice(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateBreadPrice}>Enregistrer</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
