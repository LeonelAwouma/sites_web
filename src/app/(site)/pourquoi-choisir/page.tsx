import { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { Stats } from '../_components/Stats';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ADVANTAGE_CARDS, TESTIMONIALS } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Pourquoi Choisir MatrixConnect ?',
  description: 'Découvrez les avantages qui font de MatrixConnect le partenaire idéal pour vos besoins en télécommunications et sécurité.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

export default function PourquoiChoisirPage() {
  return (
    <>
      <PageHero
        title="Pourquoi choisir MatrixConnect ?"
        subtitle="L'excellence, l'engagement et l'innovation au service de votre entreprise."
        image={findImage('why-choose-us-hero')}
      />

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGE_CARDS.map((item) => (
              <Card key={item.title} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full inline-block">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Ce que disent nos clients
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            La satisfaction de nos clients est notre plus grande fierté.
          </p>
          <div className="mt-12 max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent>
                {TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                          <Image
                            src={testimonial.avatar.imageUrl}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="rounded-full"
                            data-ai-hint={testimonial.avatar.imageHint}
                          />
                          <blockquote className="mt-6 text-lg font-medium text-foreground italic">
                            "{testimonial.quote}"
                          </blockquote>
                          <p className="mt-4 font-semibold text-primary">
                            {testimonial.author}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>
      
      <Stats />
    </>
  );
}
