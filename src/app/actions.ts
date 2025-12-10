'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from "firebase/storage";
import { revalidatePath } from 'next/cache';
import { NewsletterSchema, ContactSchema, CareerSchema } from '@/lib/types';

type FormState = {
  message: string;
  success: boolean;
};

export async function subscribeToNewsletter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = NewsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message:
        validatedFields.error.flatten().fieldErrors.email?.[0] ||
        'Invalid input.',
      success: false,
    };
  }

  try {
    await addDoc(collection(db, 'subscribers'), {
      email: validatedFields.data.email,
      subscribedAt: serverTimestamp(),
    });
    return { message: 'Merci pour votre inscription !', success: true };
  } catch (error) {
    console.error('Error adding document to Firestore: ', error);
    return {
      message: 'Une erreur est survenue. Veuillez réessayer.',
      success: false,
    };
  }
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
    const validatedFields = ContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: "Erreur de validation. Veuillez vérifier vos champs.",
            success: false,
        };
    }

    try {
        // Here you would typically send an email using a service like SendGrid or Nodemailer
        // For this example, we'll just log the data and save it to Firestore.
        console.log("New contact form submission:", validatedFields.data);

        await addDoc(collection(db, 'contactSubmissions'), {
            ...validatedFields.data,
            submittedAt: serverTimestamp(),
        });
        
        return { message: "Votre message a bien été envoyé. Nous vous répondrons bientôt.", success: true };
    } catch (error) {
        console.error('Error submitting contact form: ', error);
        return { message: "Une erreur est survenue lors de l'envoi de votre message.", success: false };
    }
}


export async function submitCareerApplication(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = CareerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log(errors);
    const errorMsg = Object.values(errors).flat().join(' ');
    return {
      message: errorMsg || "Erreur de validation. Veuillez vérifier vos champs.",
      success: false,
    };
  }

  const { cv, ...applicationData } = validatedFields.data;

  try {
    let cvUrl = '';
    if (cv && cv.size > 0) {
      const storageRef = ref(storage, `cvs/${Date.now()}-${cv.name}`);
      const snapshot = await uploadBytes(storageRef, cv);
      cvUrl = snapshot.ref.fullPath;
    }

    await addDoc(collection(db, 'careerApplications'), {
      ...applicationData,
      cvUrl,
      submittedAt: serverTimestamp(),
    });

    revalidatePath('/carriere');
    return { message: "Votre candidature a bien été envoyée. Merci !", success: true };
  } catch (error) {
    console.error('Error submitting application: ', error);
    return { message: "Une erreur est survenue lors de l'envoi de votre candidature.", success: false };
  }
}
