import { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Cloud, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Console Connect | MatrixConnect',
  description: 'Connectez-vous directement et en privé aux principaux fournisseurs de cloud (AWS, Azure, Google Cloud) via la plateforme Console Connect.',
};

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;
const cloudProviders = [
    { name: 'Amazon Web Services', logoUrl: '/aws.svg' },
    { name: 'Microsoft Azure', logoUrl: '/azure.svg' },
    { name: 'Google Cloud', logoUrl: '/gcp.svg' },
    { name: 'Oracle Cloud', logoUrl: '/oracle.svg' },
    { name: 'IBM Cloud', logoUrl: '/ibm.svg' },
    { name: 'Alibaba Cloud', logoUrl: '/alibaba.svg' },
];

const ConsoleConnectLogo = () => (
    <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <text x="10" y="30" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="bold" fill="currentColor">Console Connect</text>
    </svg>
)


export default function ConsoleConnectPage() {
  return (
    <>
      <PageHero
        title="Console Connect"
        subtitle="Votre rampe d'accès privée et instantanée au cloud."
        image={findImage('hero-1')}
      />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start">
              <ConsoleConnectLogo />
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Une plateforme, des possibilités infinies</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                En partenariat avec Console Connect, MatrixConnect vous offre un accès direct, privé et à la demande aux plus grands fournisseurs de cloud mondiaux, ainsi qu'à un écosystème de datacenters et de partenaires SaaS. Oubliez la complexité des connexions internet publiques et bénéficiez de performances, d'une sécurité et d'une fiabilité accrues pour vos charges de travail cloud.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
                    <Zap className="h-10 w-10 text-accent"/>
                    <h3 className="mt-4 font-semibold text-lg">Provisionnement à la demande</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Activez et modifiez vos connexions en quelques clics, en quasi temps-réel.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
                    <Cloud className="h-10 w-10 text-accent"/>
                    <h3 className="mt-4 font-semibold text-lg">Connectivité Multi-Cloud</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Créez facilement une architecture multi-cloud et hybride performante.</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
