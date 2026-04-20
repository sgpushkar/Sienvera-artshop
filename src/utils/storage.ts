import type { ArtPiece, StoreConfig } from '../types';

const ART_KEY = 'artshop_pieces';
const CONFIG_KEY = 'artshop_config';

export const defaultConfig: StoreConfig = {
  shopName: 'Your Art Studio',
  tagline: 'Canvas paintings, crochet art & resin creations — each piece made by hand, made for you.',
  instagramUrl: 'https://www.instagram.com/',
  contactEmail: '',
  whatsappNumber: '',
  adminPassword: 'admin123',
};

// ── Art Pieces ──────────────────────────────────────────
export function getArtPieces(): ArtPiece[] {
  try {
    const raw = localStorage.getItem(ART_KEY);
    return raw ? (JSON.parse(raw) as ArtPiece[]) : [];
  } catch {
    return [];
  }
}

export function saveArtPieces(pieces: ArtPiece[]): void {
  localStorage.setItem(ART_KEY, JSON.stringify(pieces));
}

export function addArtPiece(piece: ArtPiece): void {
  const pieces = getArtPieces();
  saveArtPieces([piece, ...pieces]);
}

export function updateArtPiece(updated: ArtPiece): void {
  const pieces = getArtPieces().map((p) => (p.id === updated.id ? updated : p));
  saveArtPieces(pieces);
}

export function deleteArtPiece(id: string): void {
  saveArtPieces(getArtPieces().filter((p) => p.id !== id));
}

// ── Config ───────────────────────────────────────────────
export function getConfig(): StoreConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? { ...defaultConfig, ...(JSON.parse(raw) as Partial<StoreConfig>) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(config: StoreConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// ── ID helper ────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
