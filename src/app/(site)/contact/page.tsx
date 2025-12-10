import { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ContactForm } from './_components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | MatrixConnect',
  description: 'Contactez-nous pour toute question ou demande de devis. Retrouvez nos adresses et notre formulaire de contact.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        subtitle="Notre équipe est à votre disposition pour répondre à toutes vos questions."
        image={findImage('contact-hero')}
      />

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-bold tracking-tight text-primary">Nos Coordonnées</h3>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Siège Social</h4>
                  <p className="text-muted-foreground">123, Avenue de la République, Dakar, Sénégal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Téléphone</h4>
                  <p className="text-muted-foreground">+221 33 800 00 00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-muted-foreground">contact@matrixconnect.sn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="relative h-[400px] w-full">
            <Image
                src={findImage('map').imageUrl}
                alt="Carte de localisation de nos bureaux"
                fill
                className="object-cover"
                data-ai-hint={findImage('map').imageHint}
            />
        </div>
      </section>
    </>
  );
}
