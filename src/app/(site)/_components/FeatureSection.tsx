import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
  image: ImagePlaceholder;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  imagePosition: 'left' | 'right';
}

export function FeatureSection({
  image,
  title,
  description,
  buttonText,
  href,
  imagePosition,
}: FeatureSectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={cn(
              'relative aspect-[4/3.5] rounded-lg overflow-hidden shadow-lg',
              imagePosition === 'right' && 'lg:order-last'
            )}
          >
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={image.imageHint}
            />
          </div>
          <div className="lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {title}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {description}
            </p>
            <div className="mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href={href}>
                  {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
