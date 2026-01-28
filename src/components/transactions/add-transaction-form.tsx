'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addTransactionAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { TransactionType } from '@/lib/types';

const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Le montant doit être un nombre positif.' }),
  description: z
    .string()
    .min(3, { message: 'La description doit comporter au moins 3 caractères.' }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const initialState = {
  type: '',
  message: '',
};

function SubmitButton({ type }: { type: TransactionType }) {
  const { pending } = useFormStatus();
  const text = type === 'debt' ? 'Ajouter une dette' : 'Ajouter un paiement';
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : text}
    </Button>
  );
}

export function AddTransactionForm({
  type,
  customerId,
  onSuccess,
}: {
  type: TransactionType;
  customerId: string;
  onSuccess: () => void;
}) {
  const [state, formAction] = useFormState(addTransactionAction, initialState);
  const { toast } = useToast();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: 'Succès !',
        description: state.message,
      });
      onSuccess();
    } else if (state.type === 'error') {
      toast({
        title: 'Erreur',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, onSuccess]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="customerId" value={customerId} />
        <input type="hidden" name="type" value={type} />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="ex: Services de conception de sites Web" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton type={type} />
      </form>
    </Form>
  );
}
