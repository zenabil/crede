'use client';

import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { signInWithGoogle, signOut } from '@/firebase/auth/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogIn,
  LogOut,
  UploadCloud,
  DownloadCloud,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GoogleDriveSettings() {
  const { user, loading } = useUser();
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La sauvegarde sur Google Drive sera bientôt disponible.',
    });
  };

  const handleRestore = () => {
    toast({
      title: 'Fonctionnalité à venir',
      description:
        'La restauration depuis Google Drive sera bientôt disponible.',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Déconnexion réussie',
    });
  };

  if (loading) {
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
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut />
              Se déconnecter
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Dernière sauvegarde: Jamais
            </p>
            <div className="flex items-center gap-2">
              <Button onClick={handleBackup} variant="outline">
                <UploadCloud />
                Sauvegarder
              </Button>
              <Button onClick={handleRestore}>
                <DownloadCloud />
                Restaurer
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
          <p className="mb-4 text-muted-foreground">
            Connectez-vous avec votre compte Google pour activer la sauvegarde
            et la restauration.
          </p>
          <Button onClick={signInWithGoogle}>
            <LogIn />
            Se connecter avec Google
          </Button>
        </div>
      )}
    </div>
  );
}
