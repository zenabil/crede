import type { Customer, Transaction, BreadOrder } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

export const SEED_CUSTOMERS: Omit<Customer, 'id' | 'totalDebts' | 'totalPayments'>[] = [
  { name: 'Boulangerie Al-Amal', phone: '0555-123456', createdAt: formatISO(subDays(new Date(), 45)), balance: 1250, settlementDay: 'Dimanche' },
  { name: 'Pâtisserie Le Délice', phone: '0555-654321', createdAt: formatISO(subDays(new Date(), 90)), balance: 0, settlementDay: 'le 1er du mois' },
  { name: 'Café du Coin', phone: '0555-987654', createdAt: formatISO(subDays(new Date(), 15)), balance: 4500, settlementDay: 'Lundi' },
  { name: 'Supérette Rahma', phone: '0555-456789', createdAt: formatISO(subDays(new Date(), 60)), balance: -500, settlementDay: 'Jeudi' },
  { name: 'Client de passage', phone: 'N/A', createdAt: formatISO(subDays(new Date(), 5)), balance: 0 },
];

export const SEED_TRANSACTIONS: Omit<Transaction, 'id' | 'customerId'>[] = [
    { type: 'debt', amount: 3000, date: formatISO(subDays(new Date(), 20)), description: 'Achat de marchandises' },
    { type: 'payment', amount: 2000, date: formatISO(subDays(new Date(), 18)), description: 'Paiement partiel' },
    { type: 'debt', amount: 250, date: formatISO(subDays(new Date(), 15)), description: 'Pain et croissants' },
    { type: 'debt', amount: 1500, date: formatISO(subDays(new Date(), 5)), description: 'Commande spéciale' },
    { type: 'payment', amount: 1500, date: formatISO(subDays(new Date(), 5)), description: 'Règlement commande' },
    { type: 'debt', amount: 500, date: formatISO(subDays(new Date(), 1)), description: 'Avance sur commande' },
    { type: 'payment', amount: 1000, date: formatISO(subDays(new Date(), 10)), description: 'Acompte' },
];

export const SEED_BREAD_ORDERS: Omit<BreadOrder, 'id'>[] = [
    { name: "Boulangerie Al-Amal", quantity: 100, unitPrice: 10, totalAmount: 1000, isPaid: false, isDelivered: false, createdAt: formatISO(new Date()), isPinned: true, customerId: '1', customerName: 'Boulangerie Al-Amal' },
    { name: "Pâtisserie Le Délice", quantity: 50, unitPrice: 10, totalAmount: 500, isPaid: true, isDelivered: false, createdAt: formatISO(new Date()), isPinned: false, customerId: '2', customerName: 'Pâtisserie Le Délice' },
    { name: "Café du Coin", quantity: 75, unitPrice: 10, totalAmount: 750, isPaid: false, isDelivered: true, createdAt: formatISO(new Date()), isPinned: false, customerId: '3', customerName: 'Café du Coin' },
    { name: "Vente directe", quantity: 20, unitPrice: 10, totalAmount: 200, isPaid: true, isDelivered: true, createdAt: formatISO(subDays(new Date(), 1)), isPinned: false, customerId: null, customerName: null },
];

export const SEED_BREAD_UNIT_PRICE = 10;
