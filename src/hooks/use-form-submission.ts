'use client';

import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UseFormSubmissionProps<T extends z.ZodType<any, any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  onSuccess?: () => void;
  formRef: React.RefObject<HTMLFormElement>;
  config?: {
    successMessage?: string;
    errorMessage?: string;
    validationErrorMessage?: string;
  };
}

export function useFormSubmission<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  onSuccess,
  formRef,
  config,
}: UseFormSubmissionProps<T>) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<z.inferFormattedError<T> | undefined>(
    undefined
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrors(undefined);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const validatedFields = schema.safeParse(data);

    if (!validatedFields.success) {
      setErrors(validatedFields.error.format());
      setIsPending(false);
      toast({
        title: 'Erreur',
        description:
          config?.validationErrorMessage ||
          'Veuillez corriger les erreurs ci-dessous.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit(validatedFields.data);

      toast({
        title: 'Succès !',
        description: config?.successMessage || 'Opération réussie.',
      });

      router.refresh();
      formRef.current?.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Erreur',
        description:
          config?.errorMessage ||
          "Une erreur est survenue lors de l'opération.",
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, errors, handleSubmit };
}
