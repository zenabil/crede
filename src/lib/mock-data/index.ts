// This file simulates the data structure of a database.xlsx file
// with 'customers' and 'transactions' sheets.

import type { Customer, Transaction } from '@/lib/types';
import { subDays } from 'date-fns';

let customers: Customer[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    phone: '01-23-45-67-89',
    createdAt: subDays(new Date(), 10).toISOString(),
    balance: 15000,
  },
  {
    id: '2',
    name: 'Marie Curie',
    phone: '09-87-65-43-21',
    createdAt: subDays(new Date(), 30).toISOString(),
    balance: -5000,
  },
  {
    id: '3',
    name: 'Pierre Martin',
    phone: '06-11-22-33-44',
    createdAt: subDays(new Date(), 5).toISOString(),
    balance: 0,
  },
];

let transactions: Transaction[] = [
  // Transactions for Jean Dupont (id: 1)
  {
    id: 't1',
    customerId: '1',
    type: 'debt',
    amount: 20000,
    date: subDays(new Date(), 8).toISOString(),
    description: 'Achat de matériel',
  },
  {
    id: 't2',
    customerId: '1',
    type: 'payment',
    amount: 5000,
    date: subDays(new Date(), 2).toISOString(),
    description: 'Paiement partiel',
  },
  // Transactions for Marie Curie (id: 2)
  {
    id: 't3',
    customerId: '2',
    type: 'debt',
    amount: 10000,
    date: subDays(new Date(), 25).toISOString(),
    description: 'Services rendus',
  },
  {
    id: 't4',
    customerId: '2',
    type: 'payment',
    amount: 15000,
    date: subDays(new Date(), 15).toISOString(),
    description: 'Paiement complet et avance',
  },
];

// In-memory data store with mutable arrays.
// This is a simple implementation for demonstration purposes.
// In a real-world scenario without a DB, you might use localStorage
// or a state management library.
export const mockDataStore = {
  customers,
  transactions,
};
