import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: ImagePlaceholder;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[400px] w-full flex items-center justify-center">
      <Image
        src={image.imageUrl}
        alt={image.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={image.imageHint}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative text-center text-white p-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
