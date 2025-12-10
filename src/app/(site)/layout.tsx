import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTopButton } from '@/components/shared/BackToTopButton';
import { CookieConsent } from '@/components/shared/CookieConsent';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BackToTopButton />
      <CookieConsent />
    </div>
  );
}
