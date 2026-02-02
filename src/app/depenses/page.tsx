'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
import DepensesLoading from './loading';
import { AddExpenseDialog } from '@/components/depenses/add-expense-dialog';
import { EditExpenseDialog } from '@/components/depenses/edit-expense-dialog';
import { DeleteExpenseDialog } from '@/components/depenses/delete-expense-dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export default function DepensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { expenses, loading } = useMockData();

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter(expense => {
        const searchMatch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        let dateMatch = true;
        if (startDate) {
            dateMatch = dateMatch && new Date(expense.date) >= new Date(startDate);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            dateMatch = dateMatch && new Date(expense.date) < end;
        }

        return searchMatch && dateMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, expenses, startDate, endDate]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [filteredExpenses]);
  
  if (loading) {
      return <DepensesLoading />;
  }
  
  const dateRangeLabel = () => {
    if (startDate && endDate) {
        return `${format(new Date(startDate), "dd MMM yyyy", { locale: fr })} - ${format(new Date(endDate), "dd MMM yyyy", { locale: fr })}`
    }
    if(startDate) {
        return `À partir du ${format(new Date(startDate), "dd MMM yyyy", { locale: fr })}`;
    }
    if(endDate) {
        return `Jusqu'au ${format(new Date(endDate), "dd MMM yyyy", { locale: fr })}`;
    }
    return "Choisir une plage de dates";
  }

  const hasExpenses = expenses.length > 0;

  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Dépenses
        </h1>
        <div className="flex items-center gap-2 w-full flex-wrap sm:w-auto sm:flex-nowrap">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des dépenses..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!hasExpenses} />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className="w-full sm:w-[260px] justify-start text-left font-normal"
                    disabled={!hasExpenses}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">{dateRangeLabel()}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor='start-date'>Date de début</Label>
                        <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='end-date'>Date de fin</Label>
                        <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    {(startDate || endDate) && <Button variant="ghost" onClick={() => {setStartDate(''); setEndDate('')}}>Effacer</Button>}
                </PopoverContent>
            </Popover>
            <AddExpenseDialog />
        </div>
      </header>
      
      <Card>
        <CardHeader>
           <CardTitle>Gestion des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(expense.date), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{expense.description}</TableCell>
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
                      )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                {hasExpenses ? 'Aucune dépense pour cette période.' : 'Aucune dépense enregistrée.'}
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter>
            <div className='flex w-full justify-between font-semibold text-base'>
                <span>Total des dépenses pour la période</span>
                <span>{formatCurrency(totalExpenses)}</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
