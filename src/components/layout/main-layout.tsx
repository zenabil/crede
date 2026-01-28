'use client';

import Link from 'next/link';
import { AppLogo } from './app-logo';
import { useAuth, useUser } from '@/firebase';
import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user && auth) {
      signInAnonymously(auth);
    }
  }, [user, loading, auth]);

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo />
          <span className="text-xl font-semibold text-foreground">
            Gestion de Crédit
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut />
            <span className="sr-only">Déconnexion</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
