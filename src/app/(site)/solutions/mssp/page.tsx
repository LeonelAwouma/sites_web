import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield, Eye, Bug } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MSSP - Sécurité Managée | MatrixConnect',
  description: 'Protégez votre entreprise avec nos services de sécurité managés (MSSP) : SOC 24/7, Firewall as a Service, Pentest et plus encore.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

const msspServices = [
    {
        icon: Shield,
        title: "Firewall as a Service (FWaaS)",
        description: "Bénéficiez d'une protection périmétrique de pointe sans investissement matériel, entièrement gérée et mise à jour par nos experts."
    },
    {
        icon: Eye,
        title: "SOC 24/7",
        description: "Notre Security Operations Center surveille, détecte et répond aux menaces en temps réel, 24h/24 et 7j/7, pour assurer la sécurité de votre SI."
    },
    {
        icon: Bug,
        title: "Pentest & Audit de Sécurité",
        description: "Identifiez les vulnérabilités de votre infrastructure avant que les attaquants ne les exploitent, grâce à nos tests d'intrusion et audits complets."
    }
];

export default function MsspPage() {
  return (
    <>
      <PageHero
        title="MSSP - Sécurité Managée"
        subtitle="Votre partenaire de confiance pour la cybersécurité."
        image={findImage('mssp-feature')}
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Externalisez votre sécurité, concentrez-vous sur votre métier
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Face à des menaces de plus en plus complexes, la gestion de la sécurité informatique est un défi constant. En tant que Fournisseur de Services de Sécurité Managés (MSSP), nous mettons à votre disposition notre expertise et nos technologies pour protéger vos actifs les plus précieux.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {msspServices.map((service) => (
              <Card key={service.title} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
