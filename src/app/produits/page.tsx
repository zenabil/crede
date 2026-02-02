'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/use-mock-data';
import type { Product } from '@/lib/types';
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import ProduitsLoading from './loading';
import { AddProductDialog } from '@/components/produits/add-product-dialog';
import { EditProductDialog } from '@/components/produits/edit-product-dialog';
import { DeleteProductDialog } from '@/components/produits/delete-product-dialog';


type SortKey = keyof Product | 'margin';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const { products, loading } = useMockData();

  const sortedAndFilteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode || '').includes(searchTerm)
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: string | number | null | undefined;
        let bValue: string | number | null | undefined;

        if (sortConfig.key === 'margin') {
          aValue = a.sellingPrice - a.purchasePrice;
          bValue = b.sellingPrice - b.purchasePrice;
        } else {
          aValue = a[sortConfig.key as keyof Product];
          bValue = b[sortConfig.key as keyof Product];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
        // Default sort by name if no sort config is set
        filtered.sort((a,b) => a.name.localeCompare(b.name));
    }


    return filtered;
  }, [searchTerm, sortConfig, products]);

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

  const headers: { key: SortKey; label: string; className?: string, isSortable: boolean }[] = [
    { key: 'name', label: 'Nom', isSortable: true },
    { key: 'category', label: 'Catégorie', className: 'hidden md:table-cell', isSortable: true },
    { key: 'barcode', label: 'Code-Barres', className: 'hidden lg:table-cell', isSortable: true },
    { key: 'purchasePrice', label: "Prix d'achat", className: 'text-right hidden sm:table-cell', isSortable: true },
    { key: 'sellingPrice', label: 'Prix de vente', className: 'text-right', isSortable: true },
    { key: 'stock', label: 'Stock', className: 'text-right hidden sm:table-cell', isSortable: true },
    { key: 'minStock', label: 'Stock min.', className: 'text-right hidden lg:table-cell', isSortable: true },
    { key: 'margin', label: 'Marge', className: 'text-right hidden md:table-cell', isSortable: true },
    { key: 'name', label: 'Actions', className: 'text-right', isSortable: false }, // dummy key for label
  ];

  if (loading) {
    return <ProduitsLoading />;
  }

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Produits
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des produits..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <AddProductDialog />
          </div>
      </header>

      {sortedAndFilteredProducts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mt-2">Essayez un autre terme de recherche.</p>
        </div>
      ) : (
          <div className="overflow-hidden rounded-lg border">
              <Table>
                  <TableHeader>
                      <TableRow>
                          {headers.map((header) => (
                              <TableHead key={header.label} className={cn('p-2', header.className)}>
                                  {header.isSortable ? (
                                    <Button variant="ghost" onClick={() => requestSort(header.key)} className="px-2 py-1 h-auto">
                                        {header.label}
                                        {getSortIcon(header.key)}
                                    </Button>
                                  ) : (
                                    <div className={cn("flex items-center h-full", header.className?.includes('text-right') ? 'justify-end pr-4' : '')}>
                                      {header.label}
                                    </div>
                                  )}
                              </TableHead>
                          ))}
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {sortedAndFilteredProducts.map((product) => {
                          const margin = product.sellingPrice - product.purchasePrice;
                          const isLowStock = product.stock <= product.minStock;
                          const isOutOfStock = product.stock === 0;
                          return (
                              <TableRow key={product.id} className={cn( (isLowStock || isOutOfStock) && 'bg-destructive/10 hover:bg-destructive/20')}>
                                  <TableCell className="font-medium p-4">{product.name}</TableCell>
                                  <TableCell className="p-4 hidden md:table-cell">
                                      <Badge variant="secondary">{product.category}</Badge>
                                  </TableCell>
                                  <TableCell className="p-4 hidden lg:table-cell text-muted-foreground font-mono">
                                    {product.barcode}
                                  </TableCell>
                                  <TableCell className="text-right font-mono p-4 hidden sm:table-cell">{formatCurrency(product.purchasePrice)}</TableCell>
                                  <TableCell className="text-right font-mono font-semibold p-4">{formatCurrency(product.sellingPrice)}</TableCell>
                                  <TableCell className={cn('text-right font-mono p-4 hidden sm:table-cell', (isLowStock || isOutOfStock) && 'font-bold text-destructive')}>{product.stock}</TableCell>
                                  <TableCell className="text-right font-mono p-4 hidden lg:table-cell">{product.minStock}</TableCell>
                                  <TableCell className={cn("text-right font-mono p-4 hidden md:table-cell", margin < 0 ? 'text-destructive' : 'text-accent' )}>{formatCurrency(margin)}</TableCell>
                                  <TableCell className="text-right p-4">
                                      <div className="flex items-center justify-end gap-0.5">
                                          <EditProductDialog product={product} />
                                          <DeleteProductDialog productId={product.id} productName={product.name} />
                                      </div>
                                  </TableCell>
                              </TableRow>
                          )
                      })}
                  </TableBody>
              </Table>
          </div>
      )}
    </div>
  );
}
