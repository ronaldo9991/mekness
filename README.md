# Mekness Web3 Trading Platform

A refined Web3-inspired front-end for the Mekness trading ecosystem. This project reimagines the official Mekness website with a black-and-gold palette, glassmorphism, animated grids, and immersive micro-interactions while keeping all content aligned with data from [mekness.com](https://mekness.com).

## ✨ Highlights
- **Modern hero experience** with particle fields, animated trading cards, and bold typography.
- **Floating Web3 navbar** and enhanced brand logo with neon glow.
- **Promotional and partnership cards** rebuilt with pop-up transitions and section scroll targeting.
- **Account Types & Compare Spreads** merged into a unified section featuring interactive highlighting.
- **Downloads section** for MetaTrader 5 desktop, web, and mobile (with QR codes for App Store, Google Play, and Huawei AppGallery).
- **Dedicated Forex and Contact pages** adapted from Mekness content, including counting animations and collapsible privacy policy.
- **Responsive design** tuned for desktop, tablet, and mobile with reduced scroll gaps and proportional spacing.

## 📁 Project Structure
```
client/        # React + TypeScript front-end (Vite)
  src/
    components/  # Shared UI elements and custom sections
    pages/       # Home, About, Forex, Contact, Auth, Dashboards
server/        # Express API & routing (Session management, admin endpoints)
```

## 🚀 Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

> The Express server expects environment variables (e.g., session secret, database URLs) via `.env`. These values are excluded from version control.

## 📦 Deployment
The project is optimized for deployment on platforms like [Vercel](https://vercel.com/). Import the GitHub repo, then use these defaults:
- **Build command:** `npm run build`
- **Output directory:** `client/dist`

Backend services can be hosted separately (e.g., Render, Railway) or merged into a monorepo deployment.

## 🔗 Key Resources
- Official Mekness site: https://mekness.com
- MT5 downloads reference: https://mekness.com/downloads

## 📝 License
Copyright © 2025 Mekness Limited. All rights reserved.
