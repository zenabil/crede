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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processSale } from '@/lib/mock-data/api';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  product: Product;
  quantity: number;
}

export function PaymentDialog({
  cartItems,
  onSuccess,
  total,
  trigger,
}: {
  cartItems: CartItem[];
  onSuccess: () => void;
  total: number;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Veuillez ajouter des produits avant de procéder au paiement.',
        variant: 'destructive',
      });
      return;
    }
    setIsPending(true);
    try {
      await processSale(cartItems);
      toast({
        title: 'Paiement réussi !',
        description: 'La vente a été enregistrée et le stock mis à jour.',
      });
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Failed to process sale', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : `Une erreur est survenue lors du traitement de la vente.`,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer le Paiement</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de finaliser une vente d'un total de{' '}
            <span className="font-bold">{formatCurrency(total)}</span>. Cette
            action mettra à jour le stock des produits. Êtes-vous sûr de vouloir
            continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handlePayment} disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Confirmer et Payer'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
