import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { JOB_OFFERS } from '@/lib/site-content';
import { CareerForm } from './_components/CareerForm';

export const metadata: Metadata = {
  title: 'Carrière | MatrixConnect',
  description: 'Rejoignez une équipe passionnée et innovante. Découvrez nos offres d\'emploi et postulez pour faire partie de l\'aventure MatrixConnect.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

export default function CarrierePage() {
  return (
    <>
      <PageHero
        title="Rejoignez-nous"
        subtitle="Construisons ensemble le futur des télécommunications."
        image={findImage('career-hero')}
      />

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Notre Culture d'Entreprise</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Chez MatrixConnect, nous croyons en la puissance de la collaboration, de l'innovation et du développement personnel. Nous offrons un environnement de travail stimulant où chaque talent peut s'épanouir et avoir un impact réel.
              </p>
              <ul className="mt-6 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">✓ Projets stimulants et innovants</li>
                <li className="flex items-center gap-2">✓ Formation continue et certifications</li>
                <li className="flex items-center gap-2">✓ Équilibre vie pro / vie perso</li>
                <li className="flex items-center gap-2">✓ Esprit d'équipe et entraide</li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Nos Offres Actuelles</h2>
              <div className="mt-6 space-y-4">
                {JOB_OFFERS.map(job => (
                  <Card key={job.title} className="shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.location} <Badge variant="outline" className="ml-2">{job.type}</Badge></p>
                      </div>
                      <Button variant="outline" size="sm">Voir l'offre</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Candidature Spontanée</CardTitle>
              </CardHeader>
              <CardContent>
                <CareerForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
