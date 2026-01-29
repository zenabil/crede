import { AddTransactionForm } from './add-transaction-form';
import type { TransactionType } from '@/lib/types';
import { FormDialog } from '@/components/forms/form-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function AddTransactionDialog({
  type,
  customerId,
  trigger,
  defaultAmount,
  defaultDescription,
}: {
  type: TransactionType;
  customerId: string;
  trigger?: React.ReactNode;
  defaultAmount?: number;
  defaultDescription?: string;
}) {
  const isDebt = type === 'debt';

  const title = isDebt ? 'Ajouter une dette' : 'Ajouter un paiement';
  const description = isDebt
    ? 'Ajoutez une nouvelle dette due par le client. Cela augmentera le solde du client.'
    : 'Ajoutez un paiement reçu du client. Cela diminuera le solde du client.';
  const buttonText = isDebt ? 'Ajouter une dette' : 'Ajouter un paiement';
  const Icon = isDebt ? PlusCircle : MinusCircle;

  const variant = isDebt ? 'outline' : 'default';

  const defaultTrigger = (
    <Button variant={variant}>
      <Icon />
      {buttonText}
    </Button>
  );

  return (
    <FormDialog
      title={title}
      description={description}
      trigger={trigger || defaultTrigger}
      form={
        <AddTransactionForm
          type={type}
          customerId={customerId}
          defaultAmount={defaultAmount}
          defaultDescription={defaultDescription}
        />
      }
    />
  );
}
