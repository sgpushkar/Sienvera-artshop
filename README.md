# 🎨 Artisan Studio — Your Handmade Art Shop

A beautiful, mobile-first art portfolio & shop website built with React + TypeScript + Vite.  
Upload your art in an **admin panel** — no code changes ever needed.

---

## 🚀 Quick Start (3 steps)

### 1. Install Node.js
Download from https://nodejs.org (LTS version recommended)

### 2. Install dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Then open http://localhost:5173 in your browser. Done! 🎉

---

## 📦 Build for production (deploy online)

```bash
npm run build
```
This creates a `dist/` folder. Upload that folder to any free host:
- **Netlify** → netlify.com/drop (drag & drop the dist folder)
- **Vercel** → vercel.com
- **GitHub Pages** → push to GitHub

---

## 🔐 Admin Panel

Go to: `yoursite.com/admin`  
Default password: **admin123**

In the admin panel you can:
- ✅ Upload photos of your art (drag & drop or tap to select)
- ✅ Add title, description, category (canvas / crochet / resin)
- ✅ Mark pieces as Available or Sold
- ✅ Edit or delete pieces
- ✅ Change your shop name, tagline, Instagram link, WhatsApp number
- ✅ Change your admin password

**All data is saved automatically in the browser's localStorage.**

---

## 📁 Project Structure

```
artshop/
├── src/
│   ├── components/
│   │   ├── Hero.tsx          ← Landing section
│   │   ├── Gallery.tsx       ← Art grid with tabs + lightbox
│   │   ├── Lightbox.tsx      ← Full-screen image viewer
│   │   ├── CustomOrder.tsx   ← Custom order section
│   │   └── Connect.tsx       ← Instagram / WhatsApp links
│   ├── pages/
│   │   ├── Home.tsx          ← Public shop page
│   │   └── Admin.tsx         ← Admin panel (password protected)
│   ├── hooks/
│   │   └── useStore.ts       ← State management
│   ├── utils/
│   │   └── storage.ts        ← localStorage read/write
│   └── types/
│       └── index.ts          ← TypeScript types
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🌸 Customising

All customisation is done through the **Admin Panel** — no code needed!

But if you want to change the colour palette, edit `src/index.css`:
```css
:root {
  --cream: #faf6f0;
  --clay: #c4885a;
  --terracotta: #a0522d;
  --sage: #8a9a7b;
  /* etc. */
}
```

---

Made with ♥ for your art
