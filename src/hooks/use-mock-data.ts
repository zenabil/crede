'use client';
import { useState, useEffect } from 'react';
import { mockDataStore, loadData } from '@/lib/mock-data';
import type {
  Customer,
  Transaction,
  BreadOrder,
  AppSettings,
  Expense,
  Supplier,
} from '@/lib/types';

interface MockDataState {
  customers: Customer[];
  transactions: Transaction[];
  breadOrders: BreadOrder[];
  expenses: Expense[];
  suppliers: Supplier[];
  settings: AppSettings;
  loading: boolean;
}

export function useMockData(): MockDataState {
  const [data, setData] = useState<MockDataState>({
    customers: [],
    transactions: [],
    breadOrders: [],
    expenses: [],
    suppliers: [],
    settings: { breadUnitPrice: 10 },
    loading: true,
  });

  useEffect(() => {
    const handleDataChange = () => {
      // Create a new object to trigger re-render
      setData({
        customers: [...mockDataStore.customers],
        transactions: [...mockDataStore.transactions],
        breadOrders: [...mockDataStore.breadOrders],
        expenses: [...mockDataStore.expenses],
        suppliers: [...mockDataStore.suppliers],
        settings: { breadUnitPrice: mockDataStore.breadUnitPrice },
        loading: false,
      });
    };

    // Initial load might be async if localStorage is slow, so we start with loading true.
    loadData();
    handleDataChange(); // Set initial data

    window.addEventListener('datachanged', handleDataChange);

    return () => {
      window.removeEventListener('datachanged', handleDataChange);
    };
  }, []);

  return data;
}
