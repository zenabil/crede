import { Inter } from 'next/font/google';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/layout/main-layout';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-body antialiased bg-background">
        <FirebaseClientProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
