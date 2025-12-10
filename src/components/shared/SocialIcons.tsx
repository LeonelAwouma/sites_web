import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://facebook.com',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://youtube.com',
  },
];

export function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
            <social.icon className="h-5 w-5" />
          </Link>
        </Button>
      ))}
    </div>
  );
}
