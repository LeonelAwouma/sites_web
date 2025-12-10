import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CONNECTIVITY_OFFERS } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Connectivité | MatrixConnect',
  description: 'Solutions de connectivité très haut débit pour entreprises : Fibre dédiée, Faisceau Hertzien, VSAT et backup 4G/5G.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

export default function ConnectivitePage() {
  return (
    <>
      <PageHero
        title="Connectivité"
        subtitle="Le socle de votre performance numérique."
        image={findImage('solutions-hero')}
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Des solutions de connectivité sur-mesure
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Que vous soyez une PME ou un grand groupe, nous avons la solution
              internet et réseau qui répond à vos exigences de performance, de
              fiabilité et de sécurité.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {CONNECTIVITY_OFFERS.map((offer) => (
               <Card key={offer.title} className="shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                           <offer.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{offer.title}</h3>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{offer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
