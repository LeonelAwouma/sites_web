'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { NAV_LINKS } from '@/lib/site-content';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { MobileNav } from './MobileNav';

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isSticky
          ? 'bg-white/95 shadow-md backdrop-blur-sm'
          : 'bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo avec meilleure visibilité */}
        <div 
          className={cn(
            'transition-all duration-300',
            !isSticky && 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
          )}
          style={!isSticky ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' } : undefined}
        >
          <Logo />
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {NAV_LINKS.map((link) =>
                link.subLinks ? (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuTrigger 
                      className={cn(
                        'font-medium transition-colors',
                        isSticky 
                          ? 'text-gray-900 hover:text-[#8BC34A]' 
                          : 'text-white hover:text-[#8BC34A] drop-shadow-md'
                      )}
                    >
                      {link.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {link.subLinks.map((subLink) => (
                          <ListItem
                            key={subLink.name}
                            href={subLink.href}
                            title={subLink.name}
                          >
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={link.name}>
                    <Link 
                      href={link.href!}
                      className={cn(
                        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                        isSticky 
                          ? 'text-gray-900 hover:text-[#8BC34A]' 
                          : 'text-white hover:text-[#8BC34A] drop-shadow-md',
                        pathname === link.href && 'text-[#8BC34A]'
                      )}
                    >
                      {link.name}
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Bouton CTA vert */}
          <Button 
            asChild 
            className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/contact">Obtenir un Devis</Link>
          </Button>
        </div>

        {/* Menu mobile */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              isSticky ? 'text-gray-900' : 'text-white hover:text-[#8BC34A]'
            )}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && <MobileNav />}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#8BC34A] focus:bg-accent focus:text-accent-foreground',
            className
          )}
          href={props.href || '#'}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';