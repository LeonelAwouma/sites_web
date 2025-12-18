import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import AIAssistant from '@/components/AIAssistant';

export const metadata: Metadata = {
  title: 'MatrixConnect - Solutions de Télécommunications',
  description:
    'MatrixConnect est votre partenaire de confiance pour des solutions de connectivité, d’interconnexion, de sécurité MSSP et de SD-WAN.',
    verification: {
    google: 'cK8NeArJyjIbChCLr927PV33wySXr7iXcQTJRbTnSTo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        {children}
        <Toaster />
         <AIAssistant />
      </body>
    </html>
  );
}
