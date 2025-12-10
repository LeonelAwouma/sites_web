import { HeroSlider } from './_components/HeroSlider';
import { Welcome } from './_components/Welcome';
import { FeatureSection } from './_components/FeatureSection';
import { WhyChooseUs } from './_components/WhyChooseUs';
import { Stats } from './_components/Stats';
import { Clients } from './_components/Clients';
import { LatestNews } from './_components/LatestNews';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find((img) => img.id === id)!;

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Welcome />
      <FeatureSection
        image={findImage('sd-wan-feature')}
        title="La puissance du SD-WAN"
        description="Simplifiez la gestion de votre réseau, optimisez les performances de vos applications et réduisez vos coûts opérationnels grâce à notre solution SD-WAN intelligente et sécurisée. Prenez le contrôle total de votre infrastructure réseau."
        buttonText="Découvrir le SD-WAN"
        href="/solutions/sd-wan"
        imagePosition="left"
      />
      <FeatureSection
        image={findImage('interconnexion-feature')}
        title="Interconnexion de sites"
        description="Reliez l'ensemble de vos agences et de vos collaborateurs sur un réseau privé, sécurisé et performant. Notre solution MPLS garantit la confidentialité et la priorisation de vos flux de données critiques à l'échelle nationale et internationale."
        buttonText="Nos solutions d'interconnexion"
        href="/solutions/interconnexion"
        imagePosition="right"
      />
      <FeatureSection
        image={findImage('mssp-feature')}
        title="Sécurité MSSP"
        description="Protégez votre entreprise contre les cybermenaces avec notre offre de services de sécurité managés. De la surveillance 24/7 par notre SOC à la gestion de firewalls, nous sommes votre rempart contre les attaques."
        buttonText="Explorer nos services de sécurité"
        href="/solutions/mssp"
        imagePosition="left"
      />
      <WhyChooseUs />
      <Stats />
      <Clients />
      <LatestNews />
    </>
  );
}
