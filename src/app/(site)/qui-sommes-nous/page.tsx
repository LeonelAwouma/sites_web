import Image from 'next/image';
import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TEAM_MEMBERS, TIMELINE_EVENTS } from '@/lib/site-content';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ? | MatrixConnect',
  description: 'Découvrez l’histoire, la mission, la vision et l’équipe qui font de MatrixConnect un leader des télécommunications.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"></div>
      {TIMELINE_EVENTS.map((event, index) => (
        <div key={event.year} className="relative flex items-center my-10">
          <div className="w-1/2 pr-8 text-right">
            {index % 2 === 0 && (
              <>
                <h3 className="text-xl font-bold text-primary">{event.year}</h3>
                <h4 className="font-semibold mt-1">{event.title}</h4>
                <p className="text-muted-foreground mt-2">{event.description}</p>
              </>
            )}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
          <div className="w-1/2 pl-8">
            {index % 2 !== 0 && (
              <>
                <h3 className="text-xl font-bold text-primary">{event.year}</h3>
                <h4 className="font-semibold mt-1">{event.title}</h4>
                <p className="text-muted-foreground mt-2">{event.description}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


export default function QuiSommesNousPage() {
  const certifications = [
    'ISO 9001:2015',
    'ISO 27001:2013',
    'Cisco Gold Partner',
    'Fortinet Advanced Partner',
  ];

  return (
    <>
      <PageHero
        title="Qui sommes-nous ?"
        subtitle="Plus qu'un fournisseur, un partenaire de votre croissance."
        image={findImage('about-hero')}
      />

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Notre Histoire</h2>
            <p className="mt-4 text-lg text-muted-foreground">Depuis 1998, nous bâtissons les autoroutes de l'information pour connecter les entreprises et les Hommes.</p>
          </div>
          <div className="mt-16 max-w-4xl mx-auto">
            <Timeline />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">Notre Mission</h3>
            <p className="mt-4 text-muted-foreground">Fournir des solutions de télécommunications innovantes, fiables et sécurisées qui accélèrent la transformation numérique de nos clients.</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">Notre Vision</h3>
            <p className="mt-4 text-muted-foreground">Être l'opérateur d'infrastructures de référence, reconnu pour son excellence opérationnelle et son engagement envers le succès de ses clients.</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">Nos Valeurs</h3>
            <p className="mt-4 text-muted-foreground">Intégrité, Proximité Client, Innovation, Excellence et Esprit d'équipe sont les piliers de notre culture d'entreprise.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Notre Équipe Dirigeante</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Des leaders passionnés et expérimentés, engagés à vos côtés.</p>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map(member => (
              <Card key={member.name} className="overflow-hidden shadow-md">
                <div className="relative aspect-square">
                  <Image src={member.image.imageUrl} alt={member.name} fill className="object-cover" data-ai-hint={member.image.imageHint} />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-primary">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Certifications et Partenariats</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Notre expertise est reconnue par les plus grands organismes et constructeurs internationaux.</p>
          <div className="mt-12 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-4">
            {certifications.map(cert => (
              <div key={cert} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="font-medium text-muted-foreground">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
