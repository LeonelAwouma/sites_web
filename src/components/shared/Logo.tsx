import Link from 'next/link';
import { Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  isScrolled?: boolean;
}

export function Logo({ isScrolled = false }: LogoProps) {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-2 group transition-all" 
      aria-label="MatrixConnect Home"
    >
      <Network 
        className={cn(
          "h-8 w-8 transition-colors",
          isScrolled 
            ? "text-[#8BC34A]" 
            : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        )} 
      />
      <span 
        className={cn(
          "text-xl font-bold tracking-tight sm:text-2xl transition-colors",
          isScrolled 
            ? "text-gray-900" 
            : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        )}
      >
        MatrixConnect
      </span>
    </Link>
  );
}