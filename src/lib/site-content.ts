import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';
import {
  Award,
  BarChart,
  Globe,
  HardHat,
  Headset,
  HeartHandshake,
  Network,
  ShieldCheck,
  Signal,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default or throw an error
    return {
      id: 'default',
      description: 'Default image',
      imageUrl: 'https://picsum.photos/seed/default/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};

export const NAV_LINKS = [
  {
    name: 'Accueil',
    href: '/',
  },
  {
    name: 'À propos',
    subLinks: [
      { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
      {
        name: 'Pourquoi choisir Matrix Télécoms ?',
        href: '/pourquoi-choisir',
      },
      { name: 'Carrière', href: '/carriere' },
    ],
  },
  {
    name: 'Solutions',
    subLinks: [
      { name: 'Connectivité', href: '/solutions/connectivite' },
      { name: 'Interconnexion', href: '/solutions/interconnexion' },
      { name: 'MSSP', href: '/solutions/mssp' },
      { name: 'SD-WAN', href: '/solutions/sd-wan' },
      { name: 'Console Connect', href: '/solutions/console-connect' },
    ],
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];

export const HERO_SLIDES = [
  {
    image: findImage('hero-1'),
    title: 'Connectivité Très Haut Débit',
    subtitle:
      'Des solutions internet fiables et ultra-rapides pour propulser votre entreprise.',
    cta1: 'Obtenir un Devis',
    cta2: 'En savoir plus',
    href2: '/solutions/connectivite',
  },
  {
    image: findImage('hero-2'),
    title: 'Interconnexion Globale',
    subtitle:
      'Connectez vos sites et vos équipes partout dans le monde avec notre réseau MPLS.',
    cta1: 'Obtenir un Devis',
    cta2: 'En savoir plus',
    href2: '/solutions/interconnexion',
  },
  {
    image: findImage('hero-3'),
    title: 'Sécurité Managée MSSP',
    subtitle:
      'Protégez vos actifs numériques avec nos services de cybersécurité 24/7.',
    cta1: 'Obtenir un Devis',
    cta2: 'En savoir plus',
    href2: '/solutions/mssp',
  },
  {
    image: findImage('hero-4'),
    title: 'La puissance du SD-WAN',
    subtitle:
      "Optimisez, sécurisez et simplifiez votre réseau d'entreprise avec le SD-WAN.",
    cta1: 'Obtenir un Devis',
    cta2: 'En savoir plus',
    href2: '/solutions/sd-wan',
  },
];

export const WHY_CHOOSE_US_ITEMS = [
  {
    icon: Zap,
    title: 'Infrastructure de Pointe',
    description:
      'Nous investissons continuellement dans les dernières technologies pour garantir des performances optimales.',
  },
  {
    icon: Headset,
    title: 'Support Expert 24/7',
    description:
      'Notre équipe de support technique est disponible à tout moment pour vous assister.',
  },
  {
    icon: Globe,
    title: 'Couverture Nationale',
    description:
      'Un réseau étendu pour connecter toutes vos agences, où qu’elles soient.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité Renforcée',
    description:
      'Des solutions de sécurité robustes pour protéger vos données et votre infrastructure.',
  },
];

export const STATS_ITEMS = [
  { value: 25, label: 'Ans d’expérience', suffix: '+' },
  { value: 100, label: 'Employés dévoués', suffix: '+' },
  { value: 450, label: 'Clients satisfaits', suffix: '+' },
  { value: 317, label: 'Millions de FCFA investis', suffix: 'M+' },
];

export const CLIENT_LOGOS = [
  findImage('client-logo-1'),
  findImage('client-logo-2'),
  findImage('client-logo-3'),
  findImage('client-logo-4'),
  findImage('client-logo-5'),
  findImage('client-logo-6'),
  findImage('client-logo-7'),
  findImage('client-logo-8'),
  findImage('client-logo-1'),
  findImage('client-logo-2'),
  findImage('client-logo-3'),
  findImage('client-logo-4'),
];

export const LATEST_NEWS_ITEMS = [
  {
    image: findImage('news-1'),
    category: 'Technologie',
    date: '15 Juil, 2024',
    title: 'MatrixConnect lance son nouveau service SD-WAN',
    description:
      'Découvrez comment notre nouvelle offre SD-WAN révolutionne la gestion de réseau pour les entreprises.',
  },
  {
    image: findImage('news-2'),
    category: 'Cybersécurité',
    date: '02 Juil, 2024',
    title: 'Les 5 menaces à surveiller en 2025',
    description:
      'Nos experts analysent les tendances et vous donnent les clés pour protéger votre organisation.',
  },
  {
    image: findImage('news-3'),
    category: 'Partenariat',
    date: '21 Juin, 2024',
    title: 'Un partenariat stratégique avec Console Connect',
    description:
      'MatrixConnect étend ses capacités cloud grâce à une intégration directe avec la plateforme Console Connect.',
  },
];

export const FOOTER_LINKS = {
  solutions: [
    { name: 'Connectivité', href: '/solutions/connectivite' },
    { name: 'Interconnexion', href: '/solutions/interconnexion' },
    { name: 'Sécurité MSSP', href: '/solutions/mssp' },
    { name: 'SD-WAN', href: '/solutions/sd-wan' },
  ],
  entreprise: [
    { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
    { name: 'Carrière', href: '/carriere' },
    { name: 'Contact', href: '/contact' },
  ],
};

export const TIMELINE_EVENTS = [
    { year: 1998, title: 'Fondation', description: 'Création de Matrix Télécoms avec une vision de connecter le pays.' },
    { year: 2005, title: 'Première Fibre', description: 'Déploiement de notre première liaison en fibre optique, une révolution à l’époque.' },
    { year: 2012, title: 'Expansion Nationale', description: 'Ouverture de nouvelles agences et extension de notre couverture réseau.' },
    { year: 2018, title: 'Lancement MSSP', description: 'Création de notre pôle cybersécurité pour répondre aux nouvelles menaces.' },
    { year: 2024, title: 'Adoption du SD-WAN', description: 'Intégration des technologies SD-WAN pour des réseaux plus intelligents et agiles.' },
];

export const TEAM_MEMBERS = [
    { name: 'Jean Dupont', role: 'PDG & Fondateur', image: findImage('team-member-1') },
    { name: 'Aïcha Traoré', role: 'Directrice Technique', image: findImage('team-member-2') },
    { name: 'Moussa Diop', role: 'Directeur Commercial', image: findImage('team-member-3') },
    { name: 'Fatou Ndiaye', role: 'Responsable RH', image: findImage('team-member-4') },
];

export const ADVANTAGE_CARDS = [
    { icon: HardHat, title: 'Infrastructure Robuste', description: 'Une infrastructure propriétaire, redondante et à la pointe de la technologie.' },
    { icon: Headset, title: 'Support Proactif 24/7', description: 'Notre NOC surveille votre réseau en permanence et intervient avant même que vous ne constatiez un problème.' },
    { icon: HeartHandshake, title: 'Partenaire de Confiance', description: 'Nous bâtissons des relations à long terme basées sur la transparence et l’excellence.' },
    { icon: Wrench, title: 'Solutions sur Mesure', description: 'Nous concevons des solutions adaptées à vos besoins spécifiques et à votre budget.' },
    { icon: ShieldCheck, title: 'Sécurité Intégrée', description: 'La sécurité est au cœur de toutes nos offres, du transport de données à l’accès internet.' },
    { icon: Users, title: 'Équipes Certifiées', description: 'Nos ingénieurs possèdent les plus hautes certifications de l’industrie (Cisco, Fortinet, etc.).' }
];

export const TESTIMONIALS = [
    { quote: "MatrixConnect a transformé notre infrastructure réseau. Leur support est tout simplement exceptionnel.", author: "Directeur Informatique, Grande Banque", avatar: findImage('testimonial-1') },
    { quote: "La fiabilité de leur connexion fibre est inégalée. Nous n'avons plus aucune coupure.", author: "PDG, Groupe Industriel", avatar: findImage('testimonial-1') },
    { quote: "Leur service MSSP nous a permis de nous concentrer sur notre métier en toute sérénité.", author: "Responsable Sécurité, E-commerce", avatar: findImage('testimonial-1') },
];

export const JOB_OFFERS = [
    { title: 'Ingénieur Réseau Senior (NOC)', location: 'Dakar', type: 'Temps plein' },
    { title: 'Technicien Fibre Optique', location: 'Thiès', type: 'Temps plein' },
    { title: 'Analyste en Cybersécurité (SOC)', location: 'Dakar', type: 'Temps plein' },
    { title: 'Commercial Terrain B2B', location: 'Saint-Louis', type: 'Temps plein' },
];

export const CONNECTIVITY_OFFERS = [
    { icon: Signal, title: "Fibre Dédiée", description: "Bénéficiez d'une connexion internet symétrique et garantie, avec des débits allant jusqu'à 10 Gbps, pour une performance maximale de vos applications critiques." },
    { icon: Globe, title: "Multiple Access (Faisceau Hertzien)", description: "Une alternative fiable à la fibre pour les zones difficiles d'accès, offrant un très haut débit sans les contraintes du génie civil." },
    { icon: Network, title: "VSAT", description: "Assurez une connectivité dans les zones les plus reculées grâce à nos solutions satellitaires performantes, idéales pour les secteurs minier, agricole ou les ONG." },
    { icon: BarChart, title: "Backup 4G/5G", description: "Garantissez la continuité de vos activités avec une solution de basculement automatique sur les réseaux mobiles 4G/5G en cas de coupure de votre lien principal." },
];
