'use client';

import Link from 'next/link';
import { AppLogo } from './app-logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 mr-6">
          <AppLogo />
          <span className="text-xl font-semibold text-foreground">
            Gestion de Crédit
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className={cn(
                "transition-colors hover:text-foreground",
                pathname === '/' ? "text-foreground" : "text-muted-foreground"
            )}>
                Tableau de bord
            </Link>
            <Link href="/commandes" className={cn(
                "transition-colors hover:text-foreground",
                pathname.startsWith('/commandes') ? "text-foreground" : "text-muted-foreground"
            )}>
                Commandes
            </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
