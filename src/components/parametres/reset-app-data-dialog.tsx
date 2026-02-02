'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetAllData } from '@/lib/mock-data/api';

export function ResetAppDataDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setIsPending(true);
    try {
      await resetAllData();
      toast({
        title: 'Succès !',
        description: `Toutes les données de l'application ont été réinitialisées.`,
      });
      window.dispatchEvent(new Event('datachanged'));
      setOpen(false);
    } catch (error) {
      console.error('Failed to reset app data', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue lors de la réinitialisation des données.`,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
          Réinitialiser les données
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Toutes les données, y compris les
            clients, les transactions et les commandes, seront définitivement
            supprimées et remplacées par les données par défaut.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Oui, tout réinitialiser'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
