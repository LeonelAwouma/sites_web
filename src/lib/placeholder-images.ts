// lib/placeholder-images.ts
import imagesData from './placeholder-images.json';

export interface ImagePlaceholder {
  id: string;
  imageUrl: string;
  description: string;
  imageHint: string;
}

export const PlaceHolderImages: ImagePlaceholder[] = imagesData.placeholderImages;
