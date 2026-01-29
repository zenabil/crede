'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollectionOnce } from '@/hooks/use-collection-once';
import { getCustomers, addTransaction } from '@/lib/mock-data/api';
import type { Customer } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

export default function CommandesPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [breadPrice, setBreadPrice] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleDataChanged = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('datachanged', handleDataChanged);
    return () => {
      window.removeEventListener('datachanged', handleDataChanged);
    };
  }, []);

  const fetchCustomers = useCallback(async () => {
    const data = await getCustomers();
    if (!data) return [];
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [refreshTrigger]);

  const { data: customers, loading: customersLoading } =
    useCollectionOnce<Customer>(fetchCustomers);

  const handleOrderChange = (customerId: string, quantityStr: string) => {
    const quantity = parseInt(quantityStr, 10);
    setOrders((prev) => ({
      ...prev,
      [customerId]: isNaN(quantity) || quantity < 0 ? 0 : quantity,
    }));
  };

  const totalAmount = useMemo(() => {
    return Object.values(orders).reduce((total, quantity) => {
      return total + (quantity || 0) * breadPrice;
    }, 0);
  }, [orders, breadPrice]);

  const totalQuantity = useMemo(() => {
    return Object.values(orders).reduce(
      (total, quantity) => total + (quantity || 0),
      0
    );
  }, [orders]);

  const handleSaveOrders = async () => {
    setIsSubmitting(true);
    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const ordersToProcess = Object.entries(orders).filter(
      ([_, quantity]) => quantity > 0
    );

    if (ordersToProcess.length === 0) {
      toast({
        title: 'Aucune commande à enregistrer',
        description: 'Veuillez saisir des quantités pour au moins un client.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const promises = ordersToProcess.map(([customerId, quantity]) => {
        return addTransaction({
          customerId,
          type: 'debt',
          amount: quantity * breadPrice,
          description: `Commande pain (${quantity} x ${formatCurrency(
            breadPrice
          )}) du ${today}`,
        });
      });

      await Promise.all(promises);

      toast({
        title: 'Succès !',
        description: `${ordersToProcess.length} commandes ont été enregistrées avec succès.`,
      });

      setOrders({});
      window.dispatchEvent(new Event('datachanged'));
    } catch (error) {
      console.error('Failed to save orders', error);
      toast({
        title: 'Erreur',
        description:
          "Une erreur est survenue lors de l'enregistrement des commandes.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (customersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Commandes de Pain
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="bread-price"
              className="text-sm font-medium whitespace-nowrap"
            >
              Prix du pain:
            </label>
            <Input
              id="bread-price"
              type="number"
              value={breadPrice}
              onChange={(e) => setBreadPrice(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
          </div>
          <Button
            onClick={handleSaveOrders}
            disabled={isSubmitting || !customers || customers.length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Entrer les quantités pour aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead className="w-36 text-right">Quantité</TableHead>
                      <TableHead className="w-40 text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers && customers.length > 0 ? (
                      customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={orders[customer.id] || ''}
                              onChange={(e) =>
                                handleOrderChange(customer.id, e.target.value)
                              }
                              className="w-24 ml-auto text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(
                              (orders[customer.id] || 0) * breadPrice
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                          Aucun client trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Résumé de la journée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <div className="flex justify-between items-center font-medium">
                <span>Quantité totale:</span>
                <span className="font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Montant total:</span>
                <span className="font-mono">{formatCurrency(totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
