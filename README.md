# Professional Profile - Next.js

A modern, single-page professional profile application built with **Next.js 14**, optimized for **Vercel deployment**.

## Features

✅ **Single Project Structure** - No monorepo complexity  
✅ **Full-Stack Ready** - Frontend + API routes in one project  
✅ **Vercel Optimized** - Zero-config deployment to Vercel  
✅ **PDF Export** - Download profile as PDF  
✅ **Responsive Design** - Mobile-friendly layout  
✅ **TypeScript** - Type-safe codebase  
✅ **Fast** - Built-in Next.js optimizations  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── profile/
│   │       └── route.ts          # API endpoint for profile data
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── profile.tsx               # Profile component
├── lib/
│   └── profileData.ts            # Profile data
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json
```

## API Endpoints

### Get Profile Data
```
GET /api/profile
```

Example:
```bash
curl http://localhost:3000/api/profile
```

## Deploy to Vercel

### Option 1: Automatic (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your repository
5. Click "Deploy"

**That's it!** Your app is live. 🚀

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

## Features

- **Download PDF** - Export profile as multi-page PDF
- **Responsive Design** - Works on all devices
- **Fast API** - Serverless functions
- **Type-Safe** - Full TypeScript support

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- html2canvas + jsPDF
- CSS 3

## Troubleshooting

### Dev server not starting?
```bash
npm run build
```

### Deploy fails?
Check Vercel logs and ensure all dependencies are in `package.json`.

### Need custom profile data?
Edit `lib/profileData.ts` and restart.

## Production Checklist

- ✅ Profile data complete
- ✅ Links working
- ✅ PDF downloads correctly
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Deployed to Vercel

## Support

- [Next.js Docs](https://nextjs.org)
- [Vercel Docs](https://vercel.com/docs)

---

**Ready to deploy?** Push to GitHub and connect to Vercel!
