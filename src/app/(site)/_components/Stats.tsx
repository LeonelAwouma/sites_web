import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { STATS_ITEMS } from '@/lib/site-content';

export function Stats() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS_ITEMS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-primary tracking-tighter">
                <AnimatedCounter end={stat.value} />
                {stat.suffix}
              </p>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
