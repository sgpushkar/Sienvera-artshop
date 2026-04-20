# Sienvera Artshop

React + TypeScript + Vite storefront for an art studio.

## Quick start

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Supabase + Cloudinary setup

Create a `.env` file from `.env.example` and fill in:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

If these values are missing, the app falls back to local browser storage so you can still run it locally.

## Suggested Supabase schema

### `artworks`

```sql
create table if not exists artworks (
  id text primary key,
  title text not null,
  description text not null default '',
  category text not null check (category in ('canvas', 'crochet', 'resin')),
  image_url text not null,
  cloudinary_public_id text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);
```

### `store_config`

```sql
create table if not exists store_config (
  id text primary key,
  shop_name text not null,
  tagline text not null,
  instagram_url text not null,
  contact_email text not null,
  whatsapp_number text not null,
  admin_password text not null
);
```

Seed one config row:

```sql
insert into store_config (
  id,
  shop_name,
  tagline,
  instagram_url,
  contact_email,
  whatsapp_number,
  admin_password
) values (
  'primary',
  'Sienvera Studio',
  'Canvas paintings, crochet art and resin creations - each piece made by hand, made for you.',
  'https://www.instagram.com/',
  '',
  '',
  'admin123'
)
on conflict (id) do nothing;
```

## Cloudinary note

The current upload flow uses an unsigned upload preset from the frontend. That is the simplest path for now, but for stronger security you should later move uploads behind a server/API route.
