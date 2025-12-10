import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';

export function Welcome() {
  const welcomeImage = PlaceHolderImages.find((img) => img.id === 'welcome-image');

  if (!welcomeImage) {
    return null;
  }

  return (
    <section 
      className="py-16 sm:py-24 bg-secondary"
      aria-labelledby="welcome-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={welcomeImage.imageUrl}
              alt={welcomeImage.description}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              data-ai-hint={welcomeImage.imageHint}
            />
          </div>

          {/* Contenu */}
          <div>
            <h2 
              id="welcome-heading"
              className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
            >
              Bienvenue dans l'univers du très haut débit
            </h2>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              MatrixConnect est un opérateur d'infrastructures de premier plan,
              fournissant des solutions de connectivité fiables et performantes
              aux entreprises de toutes tailles. Notre réseau de fibre optique de
              pointe est le socle de votre transformation numérique.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-end gap-4">
              <div className="text-6xl sm:text-7xl font-bold text-primary tracking-tighter">
                <AnimatedCounter end={1} />
              </div>
              <div className="pb-1">
                <p className="text-2xl font-bold text-foreground">Gbps</p>
                <p className="text-muted-foreground">Vitesse Maximale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}