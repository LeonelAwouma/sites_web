'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitCareerApplication } from '@/app/actions';
import { CareerSchema } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type CareerFormValues = z.infer<typeof CareerSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Envoi en cours...' : 'Envoyer ma candidature'}
    </Button>
  );
}

export function CareerForm() {
  const { toast } = useToast();
  const form = useForm<CareerFormValues>({
    resolver: zodResolver(CareerSchema),
    defaultValues: {
      name: '',
      email: '',
      cv: undefined,
      message: '',
    },
  });

  const formAction = async (formData: FormData) => {
    const result = await submitCareerApplication({ message: '', success: false }, formData);
    toast({
      title: result.success ? 'Succès' : 'Erreur',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
    if (result.success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cv"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Votre CV (PDF, DOC, DOCX - 5MB max)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => onChange(e.target.files)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message / Lettre de motivation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Parlez-nous de vous..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
