// This file simulates reading from a database file.
// The data is sourced from database.json.

import type { Customer, Transaction } from '@/lib/types';
// We are using a JSON file to simulate an external database like an Excel sheet.
import database from './database.json';

// In-memory data store with mutable arrays.
// The initial data is a deep copy from the imported JSON,
// allowing mutations in memory without affecting the original import.
// Note: These changes will be lost on page refresh, just like editing
// an Excel file without saving.
export const mockDataStore: {
  customers: Customer[];
  transactions: Transaction[];
} = {
  customers: JSON.parse(JSON.stringify(database.customers)),
  transactions: JSON.parse(JSON.stringify(database.transactions)),
};
