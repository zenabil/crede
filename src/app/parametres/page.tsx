'use client';
import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMockData } from '@/hooks/use-mock-data';
import { updateCompanyInfo, exportData, updateBreadUnitPrice } from '@/lib/mock-data/api';
import { useToast } from '@/hooks/use-toast';
import SettingsLoading from './loading';
import { Download, Save, Loader2, Check } from 'lucide-react';
import { ResetAllDataDialog } from '@/components/settings/reset-all-data-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';


const companyInfoSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis."),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: 'Veuillez saisir une adresse e-mail valide.' }).or(z.literal('')).optional(),
  logoUrl: z.string().url({ message: 'Veuillez entrer une URL valide.' }).or(z.literal('')).optional(),
  extraInfo: z.string().optional(),
  paymentTermsDays: z.coerce.number().int().min(0, 'Le nombre de jours doit être positif.'),
});

const appearanceSchema = z.object({
  currency: z.string().min(1, "La devise est requise.").max(5, "Le symbole ne peut pas dépasser 5 caractères."),
});

const breadSettingsSchema = z.object({
  breadUnitPrice: z.coerce.number().min(0, 'Le prix doit être un nombre positif.'),
});


// Color themes based on the image
const colorThemes = [
  { name: 'teal', hsl: '173 80% 40%', color: '#14b8a6' },
  { name: 'green', hsl: '142 71% 45%', color: '#22c55e' },
  { name: 'blue', hsl: '221 83% 53%', color: '#3b82f6' },
  { name: 'red', hsl: '0 72% 51%', color: '#ef4444' },
  { name: 'orange', hsl: '25 95% 53%', color: '#f97316' },
  { name: 'purple', hsl: '262 84% 59%', color: '#8b5cf6' },
  { name: 'yellow', hsl: '48 96% 53%', color: '#facc15' },
  { name: 'slate', hsl: '215 28% 17%', color: '#64748b' },
];

export default function SettingsPage() {
  const { settings, loading } = useMockData();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [activeColor, setActiveColor] = useState('teal');

  const companyFormRef = useRef<HTMLFormElement>(null);
  const appearanceFormRef = useRef<HTMLFormElement>(null);
  const breadFormRef = useRef<HTMLFormElement>(null);

  const { isPending: isCompanyPending, errors: companyErrors, handleSubmit: handleCompanySubmit } = useFormSubmission({
    formRef: companyFormRef,
    schema: companyInfoSchema,
    config: {
      successMessage: "Informations sur l'entreprise mises à jour.",
      errorMessage: 'Impossible de mettre à jour les informations.',
    },
    onSubmit: async (data) => {
      await updateCompanyInfo(data);
    },
  });

  const { isPending: isAppearancePending, errors: appearanceErrors, handleSubmit: handleAppearanceSubmit } = useFormSubmission({
    formRef: appearanceFormRef,
    schema: appearanceSchema,
    config: {
      successMessage: 'Devise mise à jour.',
      errorMessage: 'Impossible de mettre à jour la devise.',
    },
    onSubmit: async (data) => {
      await updateCompanyInfo({ currency: data.currency });
    },
  });

   const { isPending: isBreadSettingsPending, errors: breadSettingsErrors, handleSubmit: handleBreadSettingsSubmit } = useFormSubmission({
    formRef: breadFormRef,
    schema: breadSettingsSchema,
    config: {
      successMessage: 'Prix du pain mis à jour.',
      errorMessage: 'Impossible de mettre à jour le prix.',
    },
    onSubmit: async (data) => {
      await updateBreadUnitPrice(data.breadUnitPrice);
    },
  });
  
  useEffect(() => {
    setMounted(true);
    const storedColor = localStorage.getItem('frucio-theme-color') || 'teal';
    applyColor(storedColor, false); // don't show toast on initial load
  }, []);

  const applyColor = (colorName: string, showToast = true) => {
    const selectedTheme = colorThemes.find(t => t.name === colorName);
    if (!selectedTheme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', selectedTheme.hsl);
    root.style.setProperty('--accent', selectedTheme.hsl); // Keep accent same as primary
    root.style.setProperty('--ring', selectedTheme.hsl);
    
    // For dark mode, let's just lighten the color a bit as a simple heuristic
    const [h, s, l] = selectedTheme.hsl.split(' ').map(v => parseFloat(v.replace('%', '')));
    const darkPrimary = `${h} ${s}% ${Math.min(l + 10, 100)}%`;
    
    const darkStyles = document.querySelector('style[data-dark-theme-override]');
    if (darkStyles) {
      darkStyles.innerHTML = `.dark { --primary: ${darkPrimary}; --accent: ${darkPrimary}; --ring: ${darkPrimary}; }`;
    } else {
      const newStyle = document.createElement('style');
      newStyle.setAttribute('data-dark-theme-override', 'true');
      newStyle.innerHTML = `.dark { --primary: ${darkPrimary}; --accent: ${darkPrimary}; --ring: ${darkPrimary}; }`;
      document.head.appendChild(newStyle);
    }
    
    localStorage.setItem('frucio-theme-color', colorName);
    setActiveColor(colorName);
    if (showToast) {
       toast({ title: 'Thème de couleur mis à jour.' });
    }
  }


  const handleExportData = () => {
    try {
      exportData();
      toast({
        title: 'Exportation réussie',
        description: 'Vos données sont en cours de téléchargement.',
      });
    } catch (error) {
        toast({
            title: 'Erreur',
            description: 'Impossible d\'exporter les données.',
            variant: 'destructive',
        });
    }
  };

  if (loading || !mounted) {
    return <SettingsLoading />;
  }

  const companyInfo = settings.companyInfo;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre entreprise et de votre application.
        </p>
      </header>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Informations sur l'entreprise</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="data">Gestion des données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
            <Card>
                <form onSubmit={handleCompanySubmit} ref={companyFormRef}>
                    <CardHeader>
                        <CardTitle>Informations sur l'entreprise</CardTitle>
                        <CardDescription>
                            Ces informations seront utilisées dans les factures et autres documents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de l'entreprise</Label>
                                <Input id="name" name="name" defaultValue={companyInfo.name} />
                                {companyErrors?.name && <p className="text-sm font-medium text-destructive">{companyErrors.name._errors[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" name="phone" defaultValue={companyInfo.phone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" name="address" defaultValue={companyInfo.address} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={companyInfo.email} />
                             {companyErrors?.email && <p className="text-sm font-medium text-destructive">{companyErrors.email._errors[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">URL du Logo</Label>
                            <Input id="logoUrl" name="logoUrl" defaultValue={companyInfo.logoUrl} />
                            {companyErrors?.logoUrl && <p className="text-sm font-medium text-destructive">{companyErrors.logoUrl._errors[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="extraInfo">Informations Supplémentaires (N° Fiscal, etc.)</Label>
                            <Textarea id="extraInfo" name="extraInfo" defaultValue={companyInfo.extraInfo} />
                        </div>
                         <div className="space-y-2 max-w-sm">
                            <Label htmlFor="paymentTermsDays">Conditions de paiement (jours)</Label>
                            <Input id="paymentTermsDays" name="paymentTermsDays" type="number" defaultValue={companyInfo.paymentTermsDays} />
                            <p className="text-xs text-muted-foreground">Le nombre de jours avant qu'une facture ne soit considérée comme due.</p>
                            {companyErrors?.paymentTermsDays && <p className="text-sm font-medium text-destructive">{companyErrors.paymentTermsDays._errors[0]}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isCompanyPending}>
                           {isCompanyPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save />}
                           Enregistrer
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
            <Card>
                <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                        Les modifications de l'apparence sont enregistrées automatiquement, sauf la devise.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <form onSubmit={handleAppearanceSubmit} ref={appearanceFormRef} className="max-w-xs space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Devise</Label>
                            <Input id="currency" name="currency" defaultValue={companyInfo.currency} />
                            {appearanceErrors?.currency && <p className="text-sm font-medium text-destructive">{appearanceErrors.currency._errors[0]}</p>}
                        </div>
                         <Button type="submit" disabled={isAppearancePending}>
                           {isAppearancePending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save />}
                           Enregistrer la devise
                        </Button>
                     </form>

                     <div className="space-y-2">
                        <Label>Thème</Label>
                        <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">Light</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">Dark</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system">System</Label>
                            </div>
                        </RadioGroup>
                     </div>

                     <div className="space-y-2">
                        <Label>Couleurs</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {colorThemes.map((ct) => (
                                <Button
                                    key={ct.name}
                                    variant="outline"
                                    size="icon"
                                    className={cn(
                                        "h-12 w-12 rounded-lg justify-center items-center flex",
                                        activeColor === ct.name && "border-2 border-ring"
                                    )}
                                    style={{ backgroundColor: ct.color }}
                                    onClick={() => applyColor(ct.name)}
                                >
                                    {activeColor === ct.name && <Check className="h-6 w-6 text-white" />}
                                    <span className="sr-only">{ct.name}</span>
                                </Button>
                            ))}
                        </div>
                     </div>

                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="modules">
          <Card>
            <form onSubmit={handleBreadSettingsSubmit} ref={breadFormRef}>
              <CardHeader>
                <CardTitle>Paramètres des modules</CardTitle>
                <CardDescription>
                  Gérez les paramètres spécifiques aux fonctionnalités comme les commandes de pain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 max-w-sm">
                    <Label htmlFor="breadUnitPrice">Prix unitaire du pain (pour les commandes)</Label>
                    <Input id="breadUnitPrice" name="breadUnitPrice" type="number" step="0.01" defaultValue={settings.breadUnitPrice} />
                    <p className="text-xs text-muted-foreground">Ce prix est utilisé pour calculer le total des nouvelles commandes de pain.</p>
                    {breadSettingsErrors?.breadUnitPrice && <p className="text-sm font-medium text-destructive">{breadSettingsErrors.breadUnitPrice._errors[0]}</p>}
                </div>
              </CardContent>
              <CardFooter>
                  <Button type="submit" disabled={isBreadSettingsPending}>
                     {isBreadSettingsPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save />}
                     Enregistrer le prix
                  </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="data">
             <Card>
                <CardHeader>
                  <CardTitle>Gestion des données</CardTitle>
                  <CardDescription>
                    Gérez l'importation, l'exportation et la réinitialisation de vos données.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleExportData} variant="outline">
                        <Download className="mr-2 h-4 w-4"/>
                        Exporter les données
                    </Button>
                   <ResetAllDataDialog />
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      L'exportation crée une sauvegarde complète de vos données (clients, produits, transactions, etc.) dans un fichier JSON. La réinitialisation effacera toutes les données actuelles et les remplacera par les données de démonstration initiales.
                    </p>
                </CardFooter>
              </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
