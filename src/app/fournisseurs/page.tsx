'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/use-mock-data';
import type { Supplier } from '@/lib/types';
import FournisseursLoading from './loading'; // Assuming you create this
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { AddSupplierDialog } from '@/components/fournisseurs/add-supplier-dialog';
import { EditSupplierDialog } from '@/components/fournisseurs/edit-supplier-dialog';
import { DeleteSupplierDialog } from '@/components/fournisseurs/delete-supplier-dialog';

type SortKey = keyof Supplier;
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function FournisseursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const { suppliers, loading } = useMockData();

  const sortedAndFilteredSuppliers = useMemo(() => {
    if (!suppliers) return [];
    let filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig, suppliers]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  if (loading) {
      return <FournisseursLoading />;
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Fournisseurs
          </h1>
          <p className="text-muted-foreground">
            Gérez vos relations et comptes fournisseurs.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
           <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des fournisseurs..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <AddSupplierDialog />
           </div>
        </CardHeader>
        <CardContent>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button variant="ghost" onClick={() => requestSort('name')} className="px-2 py-1 h-auto">Nom{getSortIcon('name')}</Button>
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                             <Button variant="ghost" onClick={() => requestSort('category')} className="px-2 py-1 h-auto">Catégorie{getSortIcon('category')}</Button>
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                             <Button variant="ghost" onClick={() => requestSort('contact')} className="px-2 py-1 h-auto">Contact{getSortIcon('contact')}</Button>
                          </TableHead>
                           <TableHead className="text-right">
                             <Button variant="ghost" onClick={() => requestSort('balance')} className="px-2 py-1 h-auto justify-end w-full">Solde{getSortIcon('balance')}</Button>
                          </TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndFilteredSuppliers.map((supplier) => (
                          <TableRow key={supplier.id}>
                              <TableCell className="font-medium">{supplier.name}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline">{supplier.category}</Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground">
                                <div className="flex flex-col">
                                  <span>{supplier.contact}</span>
                                  <span className="text-xs">{supplier.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell className={cn("text-right font-mono", supplier.balance > 0 ? 'text-destructive' : 'text-accent')}>
                                {formatCurrency(supplier.balance)}
                              </TableCell>
                              <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-0.5">
                                      <EditSupplierDialog supplier={supplier} />
                                      <DeleteSupplierDialog supplierId={supplier.id} supplierName={supplier.name} />
                                  </div>
                              </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             {sortedAndFilteredSuppliers.length === 0 && (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">Aucun fournisseur trouvé</h3>
                    <p className="text-muted-foreground mt-2">Essayez un autre terme de recherche ou ajoutez un nouveau fournisseur.</p>
                </div>
             )}
        </CardContent>
      </Card>
    </div>
  );
}
