'use client';

import { SEED_CUSTOMERS, SEED_TRANSACTIONS, SEED_BREAD_ORDERS, SEED_BREAD_UNIT_PRICE } from './seed';
import type { Customer, Transaction, BreadOrder } from '@/lib/types';

interface MockData {
  customers: Customer[];
  transactions: Transaction[];
  breadOrders: BreadOrder[];
  breadUnitPrice: number;
}

// In-memory store
export let mockDataStore: MockData = {
  customers: [],
  transactions: [],
  breadOrders: [],
  breadUnitPrice: 10,
};

const LOCAL_STORAGE_KEY = 'gestion-credit-data';

// Function to save the entire data store to localStorage
export function saveData() {
  if (typeof window !== 'undefined') {
    try {
      const dataToSave = JSON.stringify(mockDataStore);
      localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
      // Dispatch an event to notify components of data change
      window.dispatchEvent(new Event('datachanged'));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }
}

// Function to load data from localStorage or seed if it doesn't exist
export function loadData() {
    if (typeof window === 'undefined') return;
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Simple migration to add email field if it doesn't exist
            if (parsedData.customers && parsedData.customers.length > 0 && !('email' in parsedData.customers[0])) {
                parsedData.customers = parsedData.customers.map((c: any) => ({ ...c, email: 'N/A' }));
            }
            mockDataStore = parsedData;

        } else {
            // Seed initial data if localStorage is empty
            resetToSeedData();
        }
    } catch (error) {
        console.error("Failed to load data from localStorage, resetting to seed data.", error);
        resetToSeedData();
    }
}

export function resetToSeedData() {
    const customers: Customer[] = SEED_CUSTOMERS.map((c, i) => ({ ...c, id: (i + 1).toString() }));
    const transactions: Transaction[] = SEED_TRANSACTIONS.map((t, i) => ({
        ...t,
        id: (i + 1).toString(),
        // Assign transactions to customers in a round-robin fashion for demo
        customerId: customers[i % customers.length]!.id,
    }));
    const breadOrders: BreadOrder[] = SEED_BREAD_ORDERS.map((o, i) => ({
      ...o,
      id: (i + 1).toString()
    }));
    
    mockDataStore = {
        customers,
        transactions,
        breadOrders,
        breadUnitPrice: SEED_BREAD_UNIT_PRICE,
    };
    saveData();
}


// Initial load when the module is first imported on the client
if (typeof window !== 'undefined') {
    loadData();
}
