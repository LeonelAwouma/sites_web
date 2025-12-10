import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interconnexion | MatrixConnect',
  description: 'Connectez vos sites en toute sécurité avec nos solutions MPLS VPN et site-to-site. Bénéficiez d\'une couverture mondiale et de performances garanties.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;
const benefits = [
    'Sécurité et confidentialité des données',
    'Qualité de Service (QoS) pour vos applications critiques',
    'Gestion centralisée et simplifiée du réseau',
    'Haute disponibilité et redondance',
    'Performances garanties (SLA)',
    'Évolutivité pour accompagner votre croissance',
];

export default function InterconnexionPage() {
  return (
    <>
      <PageHero
        title="Interconnexion"
        subtitle="Unifiez votre réseau d'entreprise, en toute sécurité."
        image={findImage('interconnexion-hero')}
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Réseau Privé Virtuel MPLS</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Interconnectez l'ensemble de vos sites (siège, agences, data centers) au sein d'un réseau privé, étanche à Internet, qui garantit la sécurité, la performance et la priorisation de vos flux de données. Notre solution MPLS est la colonne vertébrale de votre système d'information.
              </p>
              <ul className="mt-6 space-y-3">
                {benefits.map(benefit => (
                    <li key={benefit} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                    </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={findImage('map').imageUrl}
                    alt="Carte de couverture mondiale"
                    fill
                    className="object-cover"
                    data-ai-hint={findImage('map').imageHint}
                />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
