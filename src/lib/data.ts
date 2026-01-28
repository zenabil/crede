import type { Customer, Transaction, CustomerWithBalance, TransactionType } from './types';

class DataStore {
  private customers: Customer[];
  private transactions: Transaction[];

  constructor() {
    this.customers = [
      { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
      { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
      { id: '3', name: 'Sam Wilson', email: 'sam.wilson@example.com', phone: '555-555-5555' },
      { id: '4', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '111-222-3333' },
    ];

    this.transactions = [
      { id: 't1', customerId: '1', type: 'debt', amount: 200, description: 'Website Development', date: new Date('2023-10-01T10:00:00Z').toISOString() },
      { id: 't2', customerId: '1', type: 'payment', amount: 50, description: 'Initial payment', date: new Date('2023-10-15T14:30:00Z').toISOString() },
      { id: 't3', customerId: '2', type: 'debt', amount: 100, description: 'Graphic Design Services', date: new Date('2023-09-20T09:00:00Z').toISOString() },
      { id: 't4', customerId: '2', type: 'payment', amount: 150, description: 'Paid in full with tip', date: new Date('2023-10-05T11:00:00Z').toISOString() },
      { id: 't5', customerId: '1', type: 'debt', amount: 300, description: 'SEO Services', date: new Date('2023-11-01T12:00:00Z').toISOString() },
      { id: 't6', customerId: '3', type: 'debt', amount: 500, description: 'Consulting', date: new Date('2023-11-10T16:00:00Z').toISOString() },
      { id: 't7', customerId: '3', type: 'payment', amount: 500, description: 'Paid', date: new Date('2023-11-12T10:00:00Z').toISOString() },
    ];
  }

  private calculateBalance(customerId: string): number {
    return this.transactions
      .filter(t => t.customerId === customerId)
      .reduce((acc, t) => {
        if (t.type === 'debt') {
          return acc + t.amount;
        } else {
          return acc - t.amount;
        }
      }, 0);
  }

  async getCustomers(): Promise<CustomerWithBalance[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return this.customers.map(c => ({
      ...c,
      balance: this.calculateBalance(c.id),
    }));
  }

  async getCustomerById(id: string): Promise<CustomerWithBalance | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const customer = this.customers.find(c => c.id === id);
    if (!customer) return null;
    return {
      ...customer,
      balance: this.calculateBalance(id),
    };
  }

  async getTransactionsForCustomer(customerId: string): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addCustomer({ name, email, phone }: Omit<Customer, 'id'>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }
  
  async addTransaction({ customerId, type, amount, description }: { customerId: string, type: TransactionType, amount: number, description: string }): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      customerId,
      type,
      amount,
      description,
      date: new Date().toISOString(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async getReportData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const customers = await this.getCustomers();
    const totalDebts = this.transactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = this.transactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
    
    return {
        totalDebts,
        totalPayments,
        netBalance: totalDebts - totalPayments,
        customerCount: customers.length,
        customersWithDebt: customers.filter(c => c.balance > 0).sort((a,b) => b.balance - a.balance),
    }
  }
}

// Singleton instance of the data store
export const db = new DataStore();
