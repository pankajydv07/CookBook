# 🚀 Deployment Guide - CookBook App

## ✅ Backend Already Configured!

Your serverless JSON backend is live at:
**https://my-json-server.typicode.com/pankajydv07/CookBook/**

## 📦 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/pankajydv07/CookBook.git

# Push code
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Import Project"**
4. Select your **CookBook** repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **Key**: `VITE_JSON_SERVER_URL`
   - **Value**: `https://my-json-server.typicode.com/pankajydv07/CookBook`
7. Click **Deploy**

✅ Done! Your app will be live in ~2 minutes!

---

## 🌐 Alternative: Deploy to Netlify

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variable:
   - `VITE_JSON_SERVER_URL` = `https://my-json-server.typicode.com/pankajydv07/CookBook`
6. Deploy!

---

## 🔧 Environment Variables

The app uses these environment variables:

- **`VITE_JSON_SERVER_URL`**: Your JSON server URL (already configured)
- **`VITE_SPOONACULAR_KEY`**: Optional - for external recipe search

---

## 📱 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run JSON server (optional for local testing)
npm run json-server
```

---

## 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## ✨ Features

- 🎨 3D Animated Homepage with particle effects
- 🌈 Warm, appetizing color palette
- 📱 Fully responsive design
- 🔐 User authentication
- ❤️ Favorites system
- 📖 Recipe management (CRUD operations)
- 🔍 Search functionality
- 💾 Serverless backend with My JSON Server

---

## 🎯 Quick Deploy Commands

```bash
# 1. Commit changes
git add .
git commit -m "Ready for deployment"

# 2. Push to GitHub
git push origin main

# 3. Deploy to Vercel (if CLI installed)
vercel --prod
```

---

## 📝 Notes

- The production build automatically uses your serverless JSON backend
- All API calls will point to `https://my-json-server.typicode.com/pankajydv07/CookBook/`
- No additional backend setup required!
- The app is ready to deploy immediately

**Your app is production-ready! 🎉**
