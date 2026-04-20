import type { ArtPiece, StoreConfig } from '../types';

function getInstagramHandle(instagramUrl: string): string {
  const trimmed = instagramUrl.trim();
  if (!trimmed) return 'yourhandle';

  const normalized = trimmed.replace(/\/+$/, '');
  const candidate = normalized.split('/').pop() || 'yourhandle';
  return candidate.replace(/^@+/, '') || 'yourhandle';
}

export function buildInstagramEnquiryUrl(piece: ArtPiece, config: StoreConfig): string {
  const handle = getInstagramHandle(config.instagramUrl);
  const message = `Hi, I want to enquire about "${piece.title}" from ${config.shopName}.`;
  return `https://ig.me/m/${handle}?text=${encodeURIComponent(message)}`;
}

export function buildEmailEnquiryUrl(piece: ArtPiece, config: StoreConfig): string | null {
  const email = config.contactEmail.trim();
  if (!email) return null;

  const subject = `Art enquiry: ${piece.title}`;
  const body = [
    `Hi, I would like to enquire about "${piece.title}".`,
    '',
    `Artwork: ${piece.title}`,
    piece.description ? `Description: ${piece.description}` : null,
    '',
    'Please share availability, pricing, and next steps.',
  ]
    .filter(Boolean)
    .join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getInstagramHandleLabel(instagramUrl: string): string {
  return `@${getInstagramHandle(instagramUrl)}`;
}
