# Vercel Deployment Checklist ✅

## Files Created
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from build
- ✅ `VERCEL_DEPLOYMENT.md` - Deployment guide
- ✅ `client/.env.example` - Client environment variables
- ✅ `server/.env.example` - Server environment variables
- ✅ `client/vite.config.ts` - Updated with build optimization

## Pre-Deployment Checklist

### Local Testing
- [ ] Run `npm run install-all` to install all dependencies
- [ ] Run `npm run dev` to test locally
- [ ] Verify client runs on http://localhost:5173
- [ ] Verify server runs on http://localhost:4000
- [ ] Verify `/api/profile` endpoint works
- [ ] Verify React app loads profile data successfully

### Git Setup
- [ ] Add `.env.local` to `.gitignore` (if not already there)
- [ ] Git add and commit all files
- [ ] Push to your GitHub repository

### Vercel Setup
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] **IMPORTANT**: Select the root directory (not client folder)
- [ ] Vercel should auto-detect it's a monorepo

### Environment Variables (Vercel Dashboard)
Set these in Project Settings → Environment Variables:

**For Production:**
```
VITE_API_URL = https://your-api-backend.com/api
NODE_ENV = production
PORT = 4000
```

### Backend Deployment (Choose One)

#### Option A: Railway (Recommended - Free tier available)
1. Go to https://railway.app
2. Click "Create New Project" → "GitHub Repo"
3. Select your repository
4. Configure:
   - Build Command: `npm run build --prefix server`
   - Start Command: `npm start --prefix server`
   - Environment: Set PORT=4000
5. Deploy and get API URL
6. Update `VITE_API_URL` in Vercel to Railway URL

#### Option B: Render
1. Go to https://render.com
2. Create new "Web Service" from GitHub
3. Configure:
   - Build Command: `npm run build --prefix server`
   - Start Command: `npm start --prefix server`
4. Deploy and get API URL
5. Update `VITE_API_URL` in Vercel to Render URL

#### Option C: Heroku
1. Go to https://dashboard.heroku.com
2. Create new app
3. Connect GitHub repository
4. Deploy from server folder

### Common Issues & Solutions

**❌ 404 Error on Vercel**
- Cause: API URL not set or backend not running
- Solution: 
  1. Check `VITE_API_URL` environment variable in Vercel
  2. Ensure backend is deployed and running
  3. Test backend directly: `https://your-api-backend.com/api/profile`

**❌ CORS Errors**
- Cause: Backend not allowing requests from Vercel domain
- Solution: Update `cors()` in server/src/index.ts:
  ```typescript
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://your-vercel-domain.vercel.app',
      'https://your-api-backend.com'
    ]
  }));
  ```

**❌ Blank Page on Vercel**
- Cause: Build output directory incorrect
- Solution: Verify `client/vite.config.ts` has `outDir: 'dist'`

**❌ API returns 404**
- Cause: Backend not running or endpoint doesn't exist
- Solution: 
  1. Test endpoint locally: `curl http://localhost:4000/api/profile`
  2. Verify backend is deployed and running
  3. Check server/src/index.ts has the route

### Testing Production Build Locally

Before deploying to Vercel:

```bash
# Build client
npm run build --prefix client

# Build server
npm run build --prefix server

# Run server (from server directory)
cd server
npm start

# Serve client (from project root, requires a simple server like http-server)
npx http-server client/dist -p 3000
```

Then test:
- Open http://localhost:3000
- Verify profile loads from http://localhost:4000

### Deployment Monitoring

After deployment:
1. Check Vercel deployment logs: https://vercel.com/dashboard/your-project/deployments
2. Check backend deployment logs (Railway/Render/Heroku dashboard)
3. Test live URL: `https://your-app.vercel.app`
4. Monitor for errors in browser console (F12)

### Rollback Plan

If deployment fails:
1. Check Vercel build logs for errors
2. Fix issues locally and test with `npm run dev`
3. Commit and push changes
4. Vercel will auto-deploy on push

---

## File Structure for Reference

```
MYPROFILE/
├── vercel.json              ✅ Vercel config
├── .vercelignore            ✅ Ignore files
├── VERCEL_DEPLOYMENT.md     ✅ Guide
├── package.json
├── client/
│   ├── .env.example         ✅ Env template
│   ├── vite.config.ts       ✅ Updated
│   ├── package.json
│   ├── src/
│   │   ├── Profile.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
└── server/
    ├── .env.example         ✅ Env template
    ├── package.json
    ├── src/
    │   ├── index.ts
    │   └── profileData.ts
    └── tsconfig.json
```

---

Good luck! 🚀
