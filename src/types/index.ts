export type ArtCategory = 'canvas' | 'crochet' | 'resin';

export interface ArtPiece {
  id: string;
  title: string;
  description: string;
  category: ArtCategory;
  imageUrl: string;
  imageData?: string;
  cloudinaryPublicId?: string;
  available: boolean;
  createdAt: number;
}

export interface StoreConfig {
  shopName: string;
  tagline: string;
  instagramUrl: string;
  contactEmail: string;
  whatsappNumber: string;
  adminPassword: string;
}
