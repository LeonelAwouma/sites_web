'use server';

/**
 * @fileOverview This file defines a Genkit flow for enhancing website content using AI.
 *
 * The flow takes website content as input and uses a language model to generate improved content
 * that is more engaging, accurate, and likely to drive higher conversion rates.
 *
 * @exports enhanceWebsiteContent - The main function to enhance website content.
 * @exports EnhanceWebsiteContentInput - The input type for the enhanceWebsiteContent function.
 * @exports EnhanceWebsiteContentOutput - The output type for the enhanceWebsiteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceWebsiteContentInputSchema = z.object({
  content: z.string().describe('The website content to be enhanced.'),
});

export type EnhanceWebsiteContentInput = z.infer<
  typeof EnhanceWebsiteContentInputSchema
>;

const EnhanceWebsiteContentOutputSchema = z.object({
  enhancedContent: z
    .string()
    .describe('The AI-enhanced version of the website content.'),
});

export type EnhanceWebsiteContentOutput = z.infer<
  typeof EnhanceWebsiteContentOutputSchema
>;

/**
 * Enhances the given website content using AI.
 *
 * @param input - The input object containing the website content to enhance.
 * @returns A promise that resolves to an object containing the enhanced content.
 */
export async function enhanceWebsiteContent(
  input: EnhanceWebsiteContentInput
): Promise<EnhanceWebsiteContentOutput> {
  return enhanceWebsiteContentFlow(input);
}

const enhanceWebsiteContentPrompt = ai.definePrompt({
  name: 'enhanceWebsiteContentPrompt',
  input: {schema: EnhanceWebsiteContentInputSchema},
  output: {schema: EnhanceWebsiteContentOutputSchema},
  prompt: `You are an expert copywriter specializing in improving website content for user engagement and conversion.

  Please review the following website content and generate an improved version that is more engaging, accurate, and likely to drive higher conversion rates.

  Original Content: {{{content}}}

  Focus on:
  - Clarity and conciseness
  - Compelling language
  - SEO optimization
  - Persuasiveness
`,
});

const enhanceWebsiteContentFlow = ai.defineFlow(
  {
    name: 'enhanceWebsiteContentFlow',
    inputSchema: EnhanceWebsiteContentInputSchema,
    outputSchema: EnhanceWebsiteContentOutputSchema,
  },
  async input => {
    const {output} = await enhanceWebsiteContentPrompt(input);
    return output!;
  }
);
