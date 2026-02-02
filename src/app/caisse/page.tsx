'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  X,
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
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';

// Mock Data
const products = [
  { id: '1', name: 'Café Espresso', category: 'Boissons', price: 2.50, imageId: 'cafe-espresso' },
  { id: '2', name: 'Croissant au Beurre', category: 'Pâtisseries', price: 1.80, imageId: 'croissant-beurre' },
  { id: '3', name: 'Eau Minérale', category: 'Boissons', price: 1.20, imageId: 'eau-minerale' },
  { id: '4', name: "Jus d'Orange Frais", category: 'Boissons', price: 3.00, imageId: 'jus-orange' },
  { id: '5', name: 'Pain au Chocolat', category: 'Pâtisseries', price: 1.90, imageId: 'pain-chocolat' },
  { id: '6', name: 'Salade César', category: 'Salades', price: 7.20, imageId: 'salade-cesar' },
  { id: '7', name: 'Sandwich Poulet Crudités', category: 'Sandwichs', price: 5.50, imageId: 'sandwich-poulet' },
  { id: '8', name: 'Tarte au Citron', category: 'Pâtisseries', price: 3.50, imageId: 'tarte-citron' },
  { id: '9', name: 'Thé à la Menthe', category: 'Boissons', price: 2.20, imageId: 'the-menthe' },
  { id: '10', name: 'Muffin Myrtille', category: 'Pâtisseries', price: 2.75, imageId: 'muffin-myrtille' },
  { id: '11', name: 'Coca-Cola', category: 'Boissons', price: 1.50, imageId: 'coca-cola' },
  { id: '12', name: 'Wrap Végétarien', category: 'Sandwichs', price: 6.00, imageId: 'wrap-vegetarien' },
];

const productImages = imageData.caisse;

const categories = ['Toutes', 'Boissons', 'Pâtisseries', 'Sandwichs', 'Salades'];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageId: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CaissePage() {
  const [activeTab, setActiveTab] = useState('vente-1');
  const [carts, setCarts] = useState<Record<string, CartItem[]>>({ 'vente-1': [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  
  const activeCart = carts[activeTab] || [];

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
    const newTabId = `vente-${Object.keys(carts).length + 1}`;
    setCarts(prev => ({...prev, [newTabId]: []}));
    setActiveTab(newTabId);
  }

  const subtotal = useMemo(() => {
    return activeCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [activeCart]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Toutes' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);
  
  const getProductImage = (product: Product) => {
      const img = productImages.find(i => i.id === product.imageId);
      if (img) {
          return {
              url: `https://picsum.photos/seed/${img.seed}/${img.width}/${img.height}`,
              hint: img.hint
          }
      }
      return { url: 'https://picsum.photos/seed/placeholder/400/400', hint: 'placeholder' };
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
                                <Badge variant="secondary" className="absolute top-2 right-2">{formatCurrency(product.price)}</Badge>
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
                                <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                            </div>
                            <p className="font-semibold text-sm w-16 text-right">{formatCurrency(item.product.price * item.quantity)}</p>
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
            <Button className="w-full" size="lg">Paiement</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
