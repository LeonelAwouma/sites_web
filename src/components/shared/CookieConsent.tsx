'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-md transition-transform duration-500',
        isVisible ? 'translate-y-0' : 'translate-y-[200%]'
      )}
    >
      <Card className="shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Cookie className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Nous utilisons des cookies</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ce site utilise des cookies pour améliorer votre expérience. En
                continuant, vous acceptez notre{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                  politique de confidentialité
                </Link>
                .
              </p>
              <Button onClick={handleAccept} className="mt-4 w-full sm:w-auto">
                Accepter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
