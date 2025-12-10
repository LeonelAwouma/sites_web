'use client';

import Image from 'next/image';
import { CLIENT_LOGOS } from '@/lib/site-content';

export function Clients() {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Ils nous font confiance
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Nous sommes fiers de collaborer avec des leaders de tous les
          secteurs.
        </p>
        <div className="relative mt-12 overflow-hidden">
          <div className="flex animate-marquee hover:pause w-max">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 flex items-center justify-center mx-6"
              >
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={150}
                  height={75}
                  className="object-contain"
                  data-ai-hint={logo.imageHint}
                />
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .hover\\:pause:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
