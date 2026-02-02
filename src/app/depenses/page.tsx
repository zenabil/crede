'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  TrendingDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMockData } from '@/hooks/use-mock-data';
import DepensesLoading from './loading'; // Assuming you create this
import { AddExpenseDialog } from '@/components/depenses/add-expense-dialog';
import { EditExpenseDialog } from '@/components/depenses/edit-expense-dialog';
import { DeleteExpenseDialog } from '@/components/depenses/delete-expense-dialog';

export default function DepensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { expenses, loading } = useMockData();

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, expenses]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [filteredExpenses]);
  
  if (loading) {
      return <DepensesLoading />;
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Suivi des Dépenses
          </h1>
          <p className="text-muted-foreground">
            Enregistrez et consultez toutes vos dépenses professionnelles.
          </p>
        </div>
      </header>
      
      <Card>
        <CardHeader>
           <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher une dépense..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <AddExpenseDialog />
           </div>
        </CardHeader>
        <CardContent>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-destructive">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-0.5">
                                  <EditExpenseDialog expense={expense} />
                                  <DeleteExpenseDialog expenseId={expense.id} expenseDescription={expense.description} />
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </div>
             {filteredExpenses.length === 0 && (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">Aucune dépense trouvée</h3>
                    <p className="text-muted-foreground mt-2">Essayez un autre terme de recherche ou ajoutez une nouvelle dépense.</p>
                </div>
             )}
        </CardContent>
      </Card>
      
       <Card className="bg-destructive/5 dark:bg-destructive/10 border-destructive/20">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="text-destructive">Total des Dépenses Affichées</CardTitle>
           <TrendingDown className="h-6 w-6 text-destructive" />
         </CardHeader>
         <CardContent>
           <p className="text-3xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
         </CardContent>
       </Card>
    </div>
  );
}
