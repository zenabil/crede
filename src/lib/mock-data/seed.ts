import type { Customer, Transaction, BreadOrder, Expense, Supplier } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

export const SEED_CUSTOMERS: Omit<Customer, 'id' | 'totalDebts' | 'totalPayments'>[] = [
  { name: 'Boulangerie Al-Amal', email: 'contact@al-amal.dz', phone: '0555-123456', createdAt: formatISO(subDays(new Date(), 45)), balance: 1250, settlementDay: 'Dimanche' },
  { name: 'Pâtisserie Le Délice', email: 'patisserie.delice@example.com', phone: '0555-654321', createdAt: formatISO(subDays(new Date(), 90)), balance: 0, settlementDay: 'le 1er du mois' },
  { name: 'Café du Coin', email: 'cafe.coin@gmail.com', phone: '0555-987654', createdAt: formatISO(subDays(new Date(), 15)), balance: 4500, settlementDay: 'Lundi' },
  { name: 'Supérette Rahma', email: 'rahma.superette@yahoo.com', phone: '0555-456789', createdAt: formatISO(subDays(new Date(), 60)), balance: -500, settlementDay: 'Jeudi' },
  { name: 'Client de passage', email: 'N/A', phone: 'N/A', createdAt: formatISO(subDays(new Date(), 5)), balance: 0 },
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

export const SEED_EXPENSES: Omit<Expense, 'id'>[] = [
  { description: 'Achat de farine', category: 'Matières Premières', amount: 25000, date: formatISO(new Date()) },
  { description: 'Facture électricité', category: 'Charges', amount: 12000, date: formatISO(subDays(new Date(), 2)) },
  { description: 'Sacs à pain', category: 'Emballage', amount: 5000, date: formatISO(subDays(new Date(), 5)) },
  { description: 'Salaire employé', category: 'Salaires', amount: 40000, date: formatISO(subDays(new Date(), 0)) },
];

export const SEED_SUPPLIERS: Omit<Supplier, 'id'>[] = [
  { id: '1', name: 'Moulin Sidi Ali', contact: 'contact@sidiali.dz', phone: '021-55-66-77', balance: 15000, category: 'Matières Premières' },
  { id: '2', name: 'Emballage & Co.', contact: 'commercial@emballage.co', phone: '023-88-99-00', balance: -2000, category: 'Emballage' },
  { id: '3', name: 'Le Jardin Secret', contact: 'jardin.secret@email.com', phone: '0550-10-20-30', balance: 0, category: 'Fruits & Légumes' },
  { id: '4', name: 'Maintenance Express', contact: 'support@maintex.dz', phone: '021-44-33-22', balance: 7500, category: 'Services' },
];


export const SEED_BREAD_UNIT_PRICE = 10;
