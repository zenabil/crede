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
    .positive({ message: 'Amount must be a positive number.' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters.' }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const initialState = {
  type: '',
  message: '',
};

function SubmitButton({ type }: { type: TransactionType }) {
  const { pending } = useFormStatus();
  const text = type === 'debt' ? 'Add Debt' : 'Add Payment';
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
        title: 'Success!',
        description: state.message,
      });
      onSuccess();
    } else if (state.type === 'error') {
      toast({
        title: 'Error',
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
              <FormLabel>Amount</FormLabel>
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
                <Textarea placeholder="e.g. Website design services" {...field} />
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
