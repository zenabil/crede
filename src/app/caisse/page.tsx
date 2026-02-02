'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  PlusCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';
import { useMockData } from '@/hooks/use-mock-data';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentDialog } from '@/components/caisse/payment-dialog';


const productImages = imageData.caisse;

interface CartItem {
  product: Product;
  quantity: number;
}

// Helper to generate a slug from a product name
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/'/g, '')              // Remove apostrophes
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};


export default function CaissePage() {
  const { products, loading } = useMockData();

  const [activeTab, setActiveTab] = useState('vente-1');
  const [carts, setCarts] = useState<Record<string, CartItem[]>>({ 'vente-1': [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  
  const activeCart = carts[activeTab] || [];

  const categories = useMemo(() => {
    if (!products) return [];
    const allCategories = products.map(p => p.category);
    return ['Toutes', ...Array.from(new Set(allCategories))];
  }, [products]);

  const addToCart = (product: Product) => {
    setCarts(prevCarts => {
        const newCarts = {...prevCarts};
        const cart = [...(newCarts[activeTab] || [])];
        const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }
        newCarts[activeTab] = cart;
        return newCarts;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCarts(prevCarts => {
        const newCarts = {...prevCarts};
        const cart = [...(newCarts[activeTab] || [])];
        const itemIndex = cart.findIndex(item => item.product.id === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
        }
        newCarts[activeTab] = cart;
        return newCarts;
    });
  };
  
  const addNewTab = () => {
    const nextId = Object.keys(carts).length + 1;
    // Basic check to prevent infinite tabs
    if(nextId > 10) return;
    const newTabId = `vente-${nextId}`;
    setCarts(prev => ({...prev, [newTabId]: []}));
    setActiveTab(newTabId);
  }
  
  const handlePaymentSuccess = () => {
      // Clear the current cart
      setCarts(prevCarts => {
          const newCarts = {...prevCarts};
          newCarts[activeTab] = [];
          return newCarts;
      });
  }

  const subtotal = useMemo(() => {
    return activeCart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  }, [activeCart]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Toutes' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);
  
  const getProductImage = (product: Product) => {
      const imageId = slugify(product.name);
      const img = productImages.find(i => i.id === imageId);
      if (img) {
          return {
              url: `https://picsum.photos/seed/${img.seed}/${img.width}/${img.height}`,
              hint: img.hint
          }
      }
      return { url: `https://picsum.photos/seed/${product.id}/400/400`, hint: 'product' };
  }
  
  if (loading) {
      return (
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
          <div className="flex-grow flex flex-col">
              <Card>
                  <CardHeader>
                      <Skeleton className="h-10 w-full" />
                  </CardHeader>
              </Card>
              <div className="flex-grow overflow-auto p-1 mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {[...Array(10)].map((_, i) => (
                           <Card key={i} className="overflow-hidden">
                              <Skeleton className="w-full h-32" />
                              <CardContent className="p-3 space-y-2">
                                  <Skeleton className="h-5 w-3/4" />
                                  <Skeleton className="h-4 w-1/2" />
                                  <Skeleton className="h-9 w-full mt-2" />
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              </div>
          </div>
           <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
               <Card className="flex flex-col h-full">
                  <CardHeader>
                      <Skeleton className="h-10 w-3/4" />
                  </CardHeader>
                  <div className="flex-grow p-4 flex items-center justify-center">
                     <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <div className="p-4 border-t mt-auto space-y-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Separator />
                      <Skeleton className="h-7 w-full" />
                      <Skeleton className="h-11 w-full" />
                  </div>
               </Card>
           </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-8rem)]">
      {/* Products Section */}
      <div className="flex-grow flex flex-col">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher des produits... (F1)" className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative">
                <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Saisir le code-barres... (F2)" className="pl-8" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Catégories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
               <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
                </div>
            </div>
          </CardHeader>
        </Card>
        <div className="flex-grow overflow-auto p-1 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => {
                    const { url, hint } = getProductImage(product);
                    return (
                        <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <Image
                                    src={url}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="object-cover w-full h-32"
                                    data-ai-hint={hint}
                                />
                                <Badge variant="secondary" className="absolute top-2 right-2">{formatCurrency(product.sellingPrice)}</Badge>
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                <Button className="w-full mt-2" size="sm" onClick={() => addToCart(product)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
        <Card className="flex flex-col h-full">
            <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between">
                    <TabsList>
                        {Object.keys(carts).map(tabId => (
                            <TabsTrigger key={tabId} value={tabId}>{tabId.replace('-', ' ')}</TabsTrigger>
                        ))}
                    </TabsList>
                    <Button size="icon" variant="ghost" onClick={addNewTab}><Plus /></Button>
                  </div>
                </Tabs>
            </CardHeader>
          <div className="flex-grow overflow-auto p-4">
            {activeCart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg>
                    <p className="mt-2 text-sm">Ajouter des produits...</p>
                </div>
            ): (
                <div className="space-y-4">
                    {activeCart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4">
                            <Image src={getProductImage(item.product).url} alt={item.product.name} width={48} height={48} className="rounded-md" data-ai-hint={getProductImage(item.product).hint} />
                            <div className="flex-grow">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">{formatCurrency(item.product.sellingPrice)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                            </div>
                            <p className="font-semibold text-sm w-16 text-right">{formatCurrency(item.product.sellingPrice * item.quantity)}</p>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateQuantity(item.product.id, 0)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          <div className="p-4 border-t mt-auto space-y-4">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Réduction</span>
                    <Button variant="link" size="sm" className="h-auto p-0">Ajouter</Button>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Général</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <PaymentDialog
                cartItems={activeCart}
                total={subtotal}
                onSuccess={handlePaymentSuccess}
                trigger={<Button className="w-full" size="lg" disabled={activeCart.length === 0}>Paiement</Button>}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
