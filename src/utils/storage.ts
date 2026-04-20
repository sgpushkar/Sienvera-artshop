import type { ArtPiece, StoreConfig } from '../types';
import { hasSupabaseConfig, supabase } from './supabase';

const ART_KEY = 'artshop_pieces';
const CONFIG_KEY = 'artshop_config';
const CONFIG_ROW_ID = 'primary';

export const defaultConfig: StoreConfig = {
  shopName: 'Your Art Studio',
  tagline: 'Canvas paintings, crochet art and resin creations - each piece made by hand, made for you.',
  instagramUrl: 'https://www.instagram.com/',
  contactEmail: '',
  whatsappNumber: '',
  adminPassword: 'admin123',
};

function normalizePiece(piece: Partial<ArtPiece> & { id: string; createdAt: number }): ArtPiece {
  return {
    id: piece.id,
    title: piece.title ?? '',
    description: piece.description ?? '',
    category: piece.category ?? 'canvas',
    imageUrl: piece.imageUrl ?? piece.imageData ?? '',
    imageData: piece.imageData,
    cloudinaryPublicId: piece.cloudinaryPublicId,
    available: piece.available ?? true,
    createdAt: piece.createdAt,
  };
}

function getLocalArtPieces(): ArtPiece[] {
  try {
    const raw = localStorage.getItem(ART_KEY);
    const parsed = raw ? (JSON.parse(raw) as ArtPiece[]) : [];
    return parsed.map((piece) => normalizePiece(piece));
  } catch {
    return [];
  }
}

function saveLocalArtPieces(pieces: ArtPiece[]): void {
  localStorage.setItem(ART_KEY, JSON.stringify(pieces));
}

function getLocalConfig(): StoreConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? { ...defaultConfig, ...(JSON.parse(raw) as Partial<StoreConfig>) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

function saveLocalConfig(config: StoreConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export async function getArtPieces(): Promise<ArtPiece[]> {
  if (!hasSupabaseConfig || !supabase) {
    return getLocalArtPieces();
  }

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return getLocalArtPieces();
  }

  return data.map((row) =>
    normalizePiece({
      id: String(row.id),
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.image_url,
      cloudinaryPublicId: row.cloudinary_public_id,
      available: row.available,
      createdAt: new Date(row.created_at).getTime(),
    })
  );
}

export async function saveArtPieces(pieces: ArtPiece[]): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    saveLocalArtPieces(pieces);
    return;
  }

  const payload = pieces.map((piece) => ({
    id: piece.id,
    title: piece.title,
    description: piece.description,
    category: piece.category,
    image_url: piece.imageUrl,
    cloudinary_public_id: piece.cloudinaryPublicId ?? null,
    available: piece.available,
    created_at: new Date(piece.createdAt).toISOString(),
  }));

  const { error } = await supabase.from('artworks').upsert(payload);
  if (error) {
    throw error;
  }
}

export async function addArtPiece(piece: ArtPiece): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    saveLocalArtPieces([piece, ...getLocalArtPieces()]);
    return;
  }

  const { error } = await supabase.from('artworks').insert({
    id: piece.id,
    title: piece.title,
    description: piece.description,
    category: piece.category,
    image_url: piece.imageUrl,
    cloudinary_public_id: piece.cloudinaryPublicId ?? null,
    available: piece.available,
    created_at: new Date(piece.createdAt).toISOString(),
  });

  if (error) {
    throw error;
  }
}

export async function updateArtPiece(updated: ArtPiece): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    saveLocalArtPieces(getLocalArtPieces().map((piece) => (piece.id === updated.id ? updated : piece)));
    return;
  }

  const { error } = await supabase
    .from('artworks')
    .update({
      title: updated.title,
      description: updated.description,
      category: updated.category,
      image_url: updated.imageUrl,
      cloudinary_public_id: updated.cloudinaryPublicId ?? null,
      available: updated.available,
      created_at: new Date(updated.createdAt).toISOString(),
    })
    .eq('id', updated.id);

  if (error) {
    throw error;
  }
}

export async function deleteArtPiece(id: string): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    saveLocalArtPieces(getLocalArtPieces().filter((piece) => piece.id !== id));
    return;
  }

  const { error } = await supabase.from('artworks').delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function getConfig(): Promise<StoreConfig> {
  if (!hasSupabaseConfig || !supabase) {
    return getLocalConfig();
  }

  const { data, error } = await supabase.from('store_config').select('*').eq('id', CONFIG_ROW_ID).maybeSingle();

  if (error || !data) {
    return getLocalConfig();
  }

  return {
    shopName: data.shop_name ?? defaultConfig.shopName,
    tagline: data.tagline ?? defaultConfig.tagline,
    instagramUrl: data.instagram_url ?? defaultConfig.instagramUrl,
    contactEmail: data.contact_email ?? defaultConfig.contactEmail,
    whatsappNumber: data.whatsapp_number ?? defaultConfig.whatsappNumber,
    adminPassword: data.admin_password ?? defaultConfig.adminPassword,
  };
}

export async function saveConfig(config: StoreConfig): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    saveLocalConfig(config);
    return;
  }

  const { error } = await supabase.from('store_config').upsert({
    id: CONFIG_ROW_ID,
    shop_name: config.shopName,
    tagline: config.tagline,
    instagram_url: config.instagramUrl,
    contact_email: config.contactEmail,
    whatsapp_number: config.whatsappNumber,
    admin_password: config.adminPassword,
  });

  if (error) {
    throw error;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
