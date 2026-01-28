'use server';

import { z } from 'zod';
import { db } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import type { TransactionType } from './lib/types';

const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters.' }),
});

const transactionSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number.' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters.' }),
  customerId: z.string(),
  type: z.enum(['debt', 'payment']),
});

export async function addCustomerAction(prevState: any, formData: FormData) {
  try {
    const validatedFields = customerSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
      return {
        type: 'error',
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Please correct the errors below.',
      };
    }

    await db.addCustomer(validatedFields.data);

    revalidatePath('/');
    return { type: 'success', message: 'Customer added successfully.' };
  } catch (e) {
    return {
      type: 'error',
      message: 'An unexpected error occurred.',
    };
  }
}

export async function addTransactionAction(
  prevState: any,
  formData: FormData
) {
  try {
    const validatedFields = transactionSchema.safeParse({
      amount: formData.get('amount'),
      description: formData.get('description'),
      customerId: formData.get('customerId'),
      type: formData.get('type'),
    });

    if (!validatedFields.success) {
      return {
        type: 'error',
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Please correct the errors below.',
      };
    }
    
    await db.addTransaction({
      ...validatedFields.data,
      type: validatedFields.data.type as TransactionType,
    });

    revalidatePath('/');
    revalidatePath(`/customers/${validatedFields.data.customerId}`);
    revalidatePath('/reports');
    return {
      type: 'success',
      message: 'Transaction recorded successfully.',
    };
  } catch (e) {
    return {
      type: 'error',
      message: 'An unexpected error occurred.',
    };
  }
}
