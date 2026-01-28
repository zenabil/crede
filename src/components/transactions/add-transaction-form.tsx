'use client';

import { useRef } from 'react';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch, increment } from 'firebase/firestore';
import {
  CUSTOMERS_COLLECTION,
  TRANSACTIONS_COLLECTION,
} from '@/lib/firestore-collections';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/forms/submit-button';
import type { TransactionType } from '@/lib/types';
import { useFormSubmission } from '@/hooks/use-form-submission';

const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Le montant doit être un nombre positif.' }),
  description: z
    .string()
    .min(3, { message: 'La description doit comporter au moins 3 caractères.' }),
});

export function AddTransactionForm({
  type,
  customerId,
  onSuccess,
}: {
  type: TransactionType;
  customerId: string;
  onSuccess?: () => void;
}) {
  const firestore = useFirestore();
  const formRef = useRef<HTMLFormElement>(null);

  const text = type === 'debt' ? 'Ajouter une dette' : 'Ajouter un paiement';

  const { isPending, errors, handleSubmit } = useFormSubmission({
    formRef,
    schema: transactionSchema,
    onSuccess,
    config: {
      successMessage: 'Transaction ajoutée avec succès.',
      errorMessage: "Une erreur est survenue lors de l'ajout de la transaction.",
    },
    onSubmit: async (data) => {
      if (!firestore) throw new Error('Firestore not available');

      const batch = writeBatch(firestore);

      // Create new transaction document
      const transactionRef = doc(collection(firestore, TRANSACTIONS_COLLECTION));
      batch.set(transactionRef, {
        ...data,
        customerId,
        type,
        date: new Date().toISOString(),
      });

      // Update customer balance
      const customerRef = doc(firestore, CUSTOMERS_COLLECTION, customerId);
      const incrementAmount =
        type === 'debt' ? data.amount : -data.amount;
      batch.update(customerRef, { balance: increment(incrementAmount) });

      await batch.commit();
    },
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          defaultValue="0"
        />
        {errors?.amount && (
          <p className="text-sm font-medium text-destructive">
            {errors.amount._errors[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="ex: Services de conception de sites Web"
        />
        {errors?.description && (
          <p className="text-sm font-medium text-destructive">
            {errors.description._errors[0]}
          </p>
        )}
      </div>

      <SubmitButton isPending={isPending}>{text}</SubmitButton>
    </form>
  );
}
