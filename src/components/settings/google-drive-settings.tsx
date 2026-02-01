'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, initializeFirebase } from '@/firebase/auth/api-public';
import { Button } from '@/components/ui/button';
import { signInWithGoogle, signOut, getGoogleAccessToken } from '@/firebase/auth/api-public';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogIn,
  LogOut,
  UploadCloud,
  DownloadCloud,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getBackupMetadata,
  backupDataToGoogleDrive,
  restoreDataFromGoogleDrive,
} from '@/lib/google-drive';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { mockDataStore, saveData } from '@/lib/mock-data';

// Initialize firebase for auth only in this component
initializeFirebase();

export function GoogleDriveSettings() {
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);

  const fetchMetadata = useCallback(async () => {
    if (!user) {
      setLastBackup(null);
      setIsMetadataLoading(false);
      return;
    }

    const token = getGoogleAccessToken();
    if (!token) {
      setLastBackup(null);
      setIsMetadataLoading(false);
      return;
    }

    setIsMetadataLoading(true);
    try {
      const metadata = await getBackupMetadata(token);
      setLastBackup(metadata?.modifiedTime || null);
    } catch (error) {
      console.error('Failed to fetch backup metadata', error);
      setLastBackup(null);
    } finally {
      setIsMetadataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté avec votre compte Google.',
      });
      // The useUser hook will update user state, triggering a metadata fetch
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
        variant: 'destructive',
      });
    }
  };

  const handleBackup = async () => {
    setIsSyncing(true);
    const token = getGoogleAccessToken();
    if (!token) {
      toast({
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter pour continuer.',
        variant: 'destructive',
      });
      setIsSyncing(false);
      return;
    }
    try {
      await backupDataToGoogleDrive(token);
      await fetchMetadata(); // Refresh last backup date
      toast({
        title: 'Sauvegarde réussie',
        description: 'Vos données ont été sauvegardées sur Google Drive.',
      });
    } catch (error) {
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder les données. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    const token = getGoogleAccessToken();
    if (!token) {
      toast({
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter pour continuer.',
        variant: 'destructive',
      });
      setIsRestoring(false);
      return;
    }
    try {
      const restoredData = await restoreDataFromGoogleDrive(token);
      
      // Replace data in the store
      mockDataStore.customers = restoredData.customers;
      mockDataStore.transactions = restoredData.transactions;
      mockDataStore.breadOrders = restoredData.breadOrders;
      mockDataStore.breadUnitPrice = restoredData.breadUnitPrice;

      saveData();

      toast({
        title: 'Restauration réussie',
        description: 'Vos données ont été restaurées depuis Google Drive.',
      });
    } catch (error) {
      toast({
        title: 'Erreur de restauration',
        description: error instanceof Error ? error.message : 'Impossible de restaurer les données.',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Déconnexion réussie',
    });
  };

  const renderLastBackup = () => {
    if (isMetadataLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (lastBackup) {
      return `Dernière sauvegarde: ${formatDistanceToNow(new Date(lastBackup), { addSuffix: true, locale: fr })}`;
    }
    return 'Dernière sauvegarde: Jamais';
  }

  if (userLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold text-lg mb-2">
          Synchronisation Google Drive
        </h3>
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold text-lg mb-2">
        Synchronisation Google Drive
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sauvegardez vos données en toute sécurité sur votre Google Drive et
        restaurez-les à tout moment.
      </p>

      {user ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.displayName || 'User'}
                />
                <AvatarFallback>
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut} disabled={isSyncing || isRestoring}>
              <LogOut />
              Se déconnecter
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0 flex items-center gap-2">
              {renderLastBackup()}
            </p>
            <div className="flex items-center gap-2">
              <Button onClick={handleBackup} variant="outline" disabled={isSyncing || isRestoring}>
                {isSyncing ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                Sauvegarder
              </Button>
              <AlertDialog>
                 <AlertDialogTrigger asChild>
                    <Button disabled={isRestoring || isSyncing || !lastBackup}>
                      {isRestoring ? <Loader2 className="animate-spin" /> : <DownloadCloud />}
                      Restaurer
                    </Button>
                 </AlertDialogTrigger>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                       <AlertDialogTitle>Êtes-vous sûr de vouloir restaurer ?</AlertDialogTitle>
                       <AlertDialogDescription>
                          <div className="flex items-start gap-4 bg-destructive/10 p-4 rounded-lg mt-2">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <div className="flex-1">
                               Cette action est irréversible. Toutes vos données actuelles (clients, transactions, commandes) seront
                               <span className="font-bold"> définitivement remplacées </span>
                               par la version sauvegardée sur Google Drive.
                            </div>
                          </div>
                       </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                       <AlertDialogCancel>Annuler</AlertDialogCancel>
                       <AlertDialogAction onClick={handleRestore} className="bg-destructive hover:bg-destructive/90">
                          Oui, restaurer mes données
                       </AlertDialogAction>
                    </AlertDialogFooter>
                 </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
          <p className="mb-4 text-muted-foreground">
            Connectez-vous avec votre compte Google pour activer la sauvegarde
            et la restauration.
          </p>
          <Button onClick={handleSignIn}>
            <LogIn />
            Se connecter avec Google
          </Button>
        </div>
      )}
    </div>
  );
}
