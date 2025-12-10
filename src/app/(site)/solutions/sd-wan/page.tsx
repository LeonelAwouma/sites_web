import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SD-WAN | MatrixConnect',
  description: 'Optimisez, sécurisez et simplifiez votre réseau d\'entreprise avec nos solutions SD-WAN. Découvrez les bénéfices et notre architecture.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;
const sdwanBenefits = [
    'Optimisation des performances applicatives (Office 365, Salesforce...)',
    'Réduction des coûts télécoms grâce à l\'utilisation de liens internet multiples',
    'Sécurité renforcée avec un pare-feu intégré et une micro-segmentation',
    'Agilité et déploiement rapide de nouveaux sites',
    'Visibilité et contrôle centralisés via une console unique',
    'Intégration native avec les fournisseurs de cloud (Console Connect)',
];

export default function SdWanPage() {
  return (
    <>
      <PageHero
        title="SD-WAN"
        subtitle="Le réseau nouvelle génération pour l'ère du cloud."
        image={findImage('sd-wan-feature')}
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Qu'est-ce que le SD-WAN ?</h2>
                <p className="mt-6 text-lg text-muted-foreground">
                    Le SD-WAN (Software-Defined Wide Area Network) est une approche révolutionnaire qui virtualise votre réseau étendu. Il permet de gérer de manière centralisée et intelligente l'ensemble de vos connexions (Fibre, 4G, Faisceau Hertzien), en routant le trafic applicatif sur le meilleur chemin disponible, en fonction de politiques de sécurité et de performance que vous définissez.
                </p>
                <h3 className="mt-8 text-xl font-semibold text-primary">Les bénéfices clés :</h3>
                <ul className="mt-4 space-y-3">
                    {sdwanBenefits.map(benefit => (
                        <li key={benefit} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg p-4 bg-white">
                <Image
                    src={findImage('sd-wan-feature').imageUrl}
                    alt="Schéma d'architecture SD-WAN"
                    fill
                    className="object-contain"
                    data-ai-hint={findImage('sd-wan-feature').imageHint}
                />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
