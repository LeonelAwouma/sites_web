import { z } from 'zod';

export const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
});

export const ContactSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
  phone: z.string().min(8, { message: 'Le numéro de téléphone semble invalide.' }),
  company: z.string().optional(),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
});

export const CareerSchema = z.object({
    name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
    email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
    cv: z
      .any()
      .refine((files) => files?.length == 1, 'CV est requis.')
      .refine((files) => files?.[0]?.size <= 5000000, `La taille max est 5MB.`)
      .refine(
        (files) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files?.[0]?.type),
        '.pdf, .doc, .docx uniquement.'
      ),
    message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
});
