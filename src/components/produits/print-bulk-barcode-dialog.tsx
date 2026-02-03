'use client';

import { useRef, useMemo } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Barcode as BarcodeIcon, Printer } from 'lucide-react';
import { useMockData } from '@/hooks/use-mock-data';
import { BulkBarcodeLabels } from './bulk-barcode-labels';
import type { Product } from '@/lib/types';

interface PrintBulkBarcodeDialogProps {
  productIds: string[];
}

export function PrintBulkBarcodeDialog({ productIds }: PrintBulkBarcodeDialogProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const { products: allProducts } = useMockData();

  const selectedProducts = useMemo(() => {
    const productMap = new Map(allProducts.map(p => [p.id, p]));
    return productIds.map(id => productMap.get(id)).filter((p): p is Product => !!p);
  }, [productIds, allProducts]);

  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
  });

  const productsWithBarcode = selectedProducts.filter(p => p.barcode);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={productIds.length === 0}>
            <BarcodeIcon />
            Imprimer les codes-barres ({productIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Imprimer les codes-barres en masse</DialogTitle>
          <DialogDescription>
            Aperçu des étiquettes pour les {productsWithBarcode.length} produit(s) sélectionné(s) avec un code-barres.
            Les produits sans code-barres ne seront pas imprimés.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 my-4 max-h-[60vh] overflow-y-auto bg-muted rounded-md p-4">
          <BulkBarcodeLabels ref={labelRef} products={productsWithBarcode} />
        </div>
        <DialogFooter>
          <Button onClick={handlePrint} disabled={productsWithBarcode.length === 0}>
            <Printer />
            Imprimer ({productsWithBarcode.length} étiquettes)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
