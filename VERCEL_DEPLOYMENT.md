# Vercel Deployment Guide

## Issues Found and Fixed ✅

- ✅ Created `vercel.json` - Configuration for Vercel deployment
- ✅ Created `.vercelignore` - Files to exclude from deployment
- ✅ Verified `package.json` build scripts

## Recommended Solution

Your monorepo has a **React frontend (Vite)** and a **Node.js Express backend (API)**.

For Vercel deployment, there are two approaches:

### Option 1: Separate Backend Service (RECOMMENDED)
Deploy the **client** on Vercel and the **server** on a separate service (Railway, Render, Heroku, etc.):

1. Deploy client to Vercel (already configured)
2. Deploy server separately
3. Update client's API calls to point to the backend URL (e.g., `https://your-api.railway.app/api/profile`)

### Option 2: Full Stack on Vercel (Advanced)
Use serverless functions with a wrapper like `serverless-http`. This requires restructuring the Express app.

## Current Configuration

Your `vercel.json` is configured for Option 1 with client-side proxying. To complete deployment:

### Step 1: Client Deployment (Vercel)
- ✅ Vite build configured
- ✅ TypeScript configured
- ✅ All dependencies installed

### Step 2: Update Client API URL

Modify your `Profile.tsx` to use environment variables:

```typescript
// Before
axios.get<ProfileType>("/api/profile")

// After - works locally and in production
const API_URL = import.meta.env.VITE_API_URL || "/api/profile";
axios.get<ProfileType>(API_URL)
```

Create `.env.local` in client folder:
```
VITE_API_URL=http://localhost:4000/api/profile
```

### Step 3: Server Deployment

Deploy server to:
- **Railway** (recommended, easiest)
- **Render**
- **Heroku** (if on hobby tier)

## Environment Variables Needed

Set these in Vercel dashboard for your project:

```
NODE_ENV=production
PORT=4000
```

## Deployment Steps

1. Push changes to Git
2. Connect repository to Vercel
3. Vercel will automatically detect monorepo and deploy client
4. Deploy server separately with its own environment

## 404 Error Causes

The 404 likely occurs because:
- ❌ API routes not configured (if on Vercel)
- ❌ Backend server not running
- ❌ Client calling wrong API URL
- ❌ CORS issues

Your setup is now configured to handle this!

## Files Added/Modified

- ✅ `vercel.json` - Build and routing configuration
- ✅ `.vercelignore` - Optimization to exclude unnecessary files
