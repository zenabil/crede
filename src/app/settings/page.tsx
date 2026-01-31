'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockDataStore } from '@/lib/mock-data';
import { CsvImportDialog } from '@/components/customers/csv-import-dialog';
import { ResetAppDataDialog } from '@/components/settings/reset-app-data-dialog';
import { BreadPriceSetting } from '@/components/settings/bread-price-setting';

export default function SettingsPage() {
  const { toast } = useToast();

  const handleExportAllData = () => {
    try {
      const dataToExport = {
        customers: mockDataStore.customers,
        transactions: mockDataStore.transactions,
        breadOrders: mockDataStore.breadOrders,
        breadUnitPrice: mockDataStore.breadUnitPrice,
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `sauvegarde-gestion-credit-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Exportation réussie',
        description: 'Toutes les données ont été exportées dans un fichier JSON.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation des données.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les données de votre application et les préférences.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres et Données</CardTitle>
          <CardDescription>
            Gérez les paramètres globaux, importez, exportez ou réinitialisez
            les données de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BreadPriceSetting />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Exporter toutes les données</h3>
              <p className="text-sm text-muted-foreground">
                Sauvegardez tous vos clients, transactions et commandes dans un
                seul fichier JSON.
              </p>
            </div>
            <Button
              onClick={handleExportAllData}
              variant="secondary"
              className="mt-2 sm:mt-0"
            >
              <Download />
              Exporter (.json)
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Importer des clients</h3>
              <p className="text-sm text-muted-foreground">
                Importez des clients à partir d'un fichier CSV. Cela écrasera
                les clients existants.
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <CsvImportDialog />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/20">
            <div>
              <h3 className="font-semibold text-destructive">Zone de Danger</h3>
              <p className="text-sm text-destructive/80">
                La réinitialisation effacera toutes les données de
                l'application de manière permanente.
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <ResetAppDataDialog />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
