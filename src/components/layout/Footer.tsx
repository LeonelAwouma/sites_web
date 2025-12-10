import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { SocialIcons } from '@/components/shared/SocialIcons';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { FOOTER_LINKS } from '@/lib/site-content';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-12 lg:col-span-4">
            <div className="space-y-4">
              <Logo />
              <p className="text-muted-foreground max-w-sm">
                Votre partenaire de confiance pour des solutions de connectivité
                et de sécurité de pointe.
              </p>
              <SocialIcons />
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-semibold text-foreground">Solutions</h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-semibold text-foreground">Entreprise</h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="font-semibold text-foreground">
              Rejoignez notre newsletter
            </h3>
            <p className="mt-2 text-muted-foreground">
              Recevez les dernières nouvelles et offres directement dans votre
              boîte de réception.
            </p>
            <NewsletterForm />
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} MatrixConnect. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
