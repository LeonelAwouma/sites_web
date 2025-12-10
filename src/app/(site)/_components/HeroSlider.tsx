'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { HERO_SLIDES } from '@/lib/site-content';
import Autoplay from 'embla-carousel-autoplay';

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  // CTAs par défaut si non définis dans les slides
  const defaultCTAs = {
    primary: { text: "Obtenir un Devis", url: "/contact" },
    secondary: { text: "Nos Solutions", url: "/solutions" }
  };

  // DEBUG - Vérifier les URLs des images
  React.useEffect(() => {
    console.log('HERO_SLIDES:', HERO_SLIDES);
    HERO_SLIDES.forEach((slide, i) => {
      console.log(`Slide ${i} image:`, slide.image?.imageUrl);
    });
  }, []);

  if (!HERO_SLIDES || HERO_SLIDES.length === 0) {
    return (
      <section className="relative h-screen min-h-[600px] w-full bg-red-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Aucune slide configurée</h1>
          <p>Vérifiez le fichier placeholder-images.json</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-gray-900">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.reset()}
      >
        <CarouselContent className="h-screen min-h-[600px] ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="h-screen min-h-[600px] pl-0">
              <div className="relative w-full h-screen min-h-[600px]">
                {/* Image avec fallback */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600">
                  {slide.image?.imageUrl ? (
                    <Image
                      src={slide.image.imageUrl}
                      alt={slide.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === 0}
                      onError={(e) => {
                        console.error(`Erreur chargement image slide ${index}:`, slide.image.imageUrl);
                        // Cache l'image en cas d'erreur
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-white text-2xl">Image manquante</p>
                    </div>
                  )}
                </div>

                {/* Overlay sombre - plus sombre pour mieux voir le logo */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Contenu texte */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 text-center text-white">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                      {slide.subtitle}
                    </p>
                    {/* Boutons CTA */}
                    <div className="flex gap-4 justify-center animate-fade-in-delay-2">
                      <Button asChild size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold">
                        <Link href={defaultCTAs.primary.url}>
                          {slide.cta1 || defaultCTAs.primary.text}
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="bg-white text-[#8BC34A] border-2 border-[#8BC34A] hover:bg-[#8BC34A] hover:text-white font-semibold">
                        <Link href={slide.href2 || defaultCTAs.secondary.url}>
                          {slide.cta2 || defaultCTAs.secondary.text}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Contrôles navigation */}
        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 text-white border-0" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 text-white border-0" />
      </Carousel>
    </section>
  );
}