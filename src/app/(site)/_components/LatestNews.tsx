import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LATEST_NEWS_ITEMS } from '@/lib/site-content';
import { ArrowRight } from 'lucide-react';

export function LatestNews() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Actualités et Analyses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Restez informé des dernières tendances du secteur des
            télécommunications et de la cybersécurité.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {LATEST_NEWS_ITEMS.map((item) => (
            <Card
              key={item.title}
              className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={item.image.imageUrl}
                    alt={item.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={item.image.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary">{item.category}</Badge>
                  <p className="text-muted-foreground">{item.date}</p>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-tight">
                  <Link href="#" className="hover:text-primary">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link
                  href="#"
                  className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lire la suite <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
