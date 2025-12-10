'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/site-content';

export function MobileNav() {
  return (
    <div className="lg:hidden bg-background/95 border-t">
      <div className="container mx-auto flex flex-col px-4 py-4 space-y-4">
        {NAV_LINKS.map((link) =>
          link.subLinks ? (
            <Accordion type="single" collapsible key={link.name}>
              <AccordionItem value={link.name} className="border-b-0">
                <AccordionTrigger className="py-2 text-lg font-semibold hover:no-underline">
                  {link.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2 pl-4">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              key={link.name}
              href={link.href!}
              className="py-2 text-lg font-semibold"
            >
              {link.name}
            </Link>
          )
        )}
        <Button asChild className="w-full">
          <Link href="/contact">Obtenir un Devis</Link>
        </Button>
      </div>
    </div>
  );
}
