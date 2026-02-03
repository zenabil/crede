'use client';

import React from 'react';
import type { Product, Customer } from '@/lib/types';
import { useMockData } from '@/hooks/use-mock-data';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

interface CartItem {
  product: Product;
  quantity: number;
}

export interface ReceiptData {
  cart: CartItem[];
  customer: Customer | null | undefined;
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  changeDue: number;
  saleDate: string;
}

interface ReceiptProps {
  receiptData: ReceiptData | null;
}

export const Receipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  const { settings } = useMockData();
  const { companyInfo } = settings;

  if (!receiptData) {
    return null;
  }

  const { cart, customer, subtotal, discount, total, amountPaid, changeDue, saleDate } = receiptData;

  return (
    <div id="receipt-to-print" className="hidden">
       <style jsx global>{`
        @media print {
          body > :not(#receipt-to-print) {
            display: none !important;
          }
          #receipt-to-print {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div className="w-[80mm] mx-auto p-2 bg-white text-black font-mono">
        <div className="text-center">
            {companyInfo.logoUrl && (
                <Image src={companyInfo.logoUrl} alt={companyInfo.name} width={80} height={40} className="mx-auto my-2 object-contain" />
            )}
          <h2 className="text-lg font-bold">{companyInfo.name}</h2>
          <p className="text-xs">{companyInfo.address}</p>
          <p className="text-xs">{companyInfo.phone}</p>
          <p className="text-xs">{companyInfo.extraInfo}</p>
        </div>

        <div className="my-3 border-t border-b border-dashed border-black py-1">
          <p className="flex justify-between text-xs">
            <span>Date: {format(new Date(saleDate), 'dd/MM/yy HH:mm', { locale: fr })}</span>
            <span>Ticket: {new Date(saleDate).getTime().toString().slice(-6)}</span>
          </p>
          {customer && (
            <p className="text-xs">Client: {customer.name}</p>
          )}
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dashed border-black">
              <th className="text-left font-bold">PRODUIT</th>
              <th className="text-right font-bold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <React.Fragment key={item.product.id}>
                <tr>
                    <td className="text-left py-1">{item.product.name}</td>
                    <td className="text-right">{formatCurrency(item.product.sellingPrice * item.quantity)}</td>
                </tr>
                <tr className="text-muted-foreground">
                    <td className="text-left pl-2 pb-1">
                        {item.quantity} x {formatCurrency(item.product.sellingPrice)}
                    </td>
                    <td></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="my-3 border-t border-dashed border-black pt-2 text-xs space-y-1">
          <p className="flex justify-between">
            <span>SOUS-TOTAL</span>
            <span>{formatCurrency(subtotal)}</span>
          </p>
          {discount > 0 && (
            <p className="flex justify-between">
              <span>REDUCTION</span>
              <span>-{formatCurrency(discount)}</span>
            </p>
          )}
          <p className="flex justify-between font-bold text-sm">
            <span>TOTAL A PAYER</span>
            <span>{formatCurrency(total)}</span>
          </p>
        </div>

         <div className="my-3 border-t border-dashed border-black pt-2 text-xs space-y-1">
            <p className="flex justify-between">
                <span>MONTANT PAYE</span>
                <span>{formatCurrency(amountPaid)}</span>
            </p>
            {customer && (total - amountPaid > 0) && (
                <p className="flex justify-between">
                    <span>RESTE SUR COMPTE</span>
                    <span>{formatCurrency(total - amountPaid)}</span>
                </p>
            )}
             <p className="flex justify-between">
                <span>MONNAIE RENDUE</span>
                <span>{formatCurrency(changeDue)}</span>
            </p>
        </div>
        
        <p className="text-center text-xs mt-4">Merci pour votre visite !</p>
      </div>
    </div>
  );
};
