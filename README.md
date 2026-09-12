# Life RPG — Level Up Your Real Life ⚔️

> **Tech Zephyr 4.0 — Web Hackathon** | Organized by IIT Bhubaneswar  
> **Product Tagline**: *Level up your real life.*

Transform real-world productivity, study sessions, workouts, and habits into an authentic video-game RPG progression system. Complete quests, gain XP, ascend through a non-linear leveling curve, build 5 character attributes, defend your daily streak, earn Gold, and customize your hero in the virtual bazaar.

---

## 🌟 Key Features

### 1. 🛡️ Authoritative RPG Progression Engine
- **Non-Linear Level Curve**: Uses exponential polynomial formula `Math.floor(100 * Math.pow(level, 1.5))` rather than trivial linear multipliers.
- **5 Core Attributes**:
  - **Strength**: Fitness, workouts, physical endurance
  - **Intellect**: Coding, deep study, reading
  - **Discipline**: Routines, mindfulness, meditation
  - **Vitality**: Sleep, hydration, healthy meals
  - **Creativity**: Art, design, writing, problem-solving
- **Server-Side Integrity**: Anti-cheat architecture where the client requests quest completion, and the backend calculates XP, Gold, attributes, streaks, and level promotions authoritatively.

### 2. 📜 Quest Management System
- Full CRUD operations with category filtering (`Study`, `Fitness`, `Coding`, `Health`, `Creativity`, `Personal`, `Other`).
- Difficulty tiers (`Easy`, `Medium`, `Hard`, `Epic`) with dynamic reward previews.
- Instant celebratory tactile feedback with confetti particle bursts and upward floating reward chips.

### 3. 🪙 Virtual Economy & Armory Shop
- Earn Gold for every completed quest.
- Purchase cosmetic equipment:
  - **Frames**: Bronze Frame, Void Armor Frame
  - **Badges**: Neon Adventurer Badge, Chrono Singularity Core
  - **Themes**: Synthwave Sunset, Cyber Knight
  - **Auras**: Cosmic Aura with animated starfield
- Server-side gold balance validation, unique ownership checks, and persistent inventory.

### 4. 🔥 Streak Defense Engine
- UTC calendar-day streak tracking.
- Consecutive daily activity rewards streak progression; gap days reset the streak safely with zero timezone anomalies.

### 5. 💎 3D Holographic Core & Visual Design
- Futuristic cyber-fantasy theme (`#05060A`, `#0B0F18`, `#7C3AED`, `#06B6D4`, `#F59E0B`).
- Floating, interactive 3D geometric crystal powered by **Three.js** / **React Three Fiber**.
- Automatic, graceful CSS animated fallback if WebGL is unavailable or user enables `prefers-reduced-motion`.

### 6. ♿ Accessibility & SEO
- Full keyboard navigation: `Tab` focus rings, `Enter`/`Space` activation, `Escape` to dismiss modals.
- Semantic HTML5 structure (`main`, `nav`, `header`, `section`, `button`) with screen reader friendly ARIA roles.
- Open Graph tags, Twitter Card metadata, and JSON-LD structured schema markup.

---

## 🏗️ Architecture & Technology Stack

```
Browser (Next.js 14 App Router + Tailwind CSS + Framer Motion + R3F)
   │
   ▼
Edge Middleware (Route Protection & Session Verification)
   │
   ▼
API Route Handlers (/api/auth, /api/tasks, /api/character, /api/shop)
   │
   ▼
JWT Authentication (jose HS256 + HTTP-only Secure Cookies + Bcryptjs)
   │
   ▼
MongoDB Atlas (Users, Quests, History Collections)
```

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Three.js, React Three Fiber.
- **Backend**: Next.js Route Handlers, Zod Validation, Jose (JWT), Bcryptjs.
- **Database**: MongoDB Atlas with IPv4 connection pooling.
- **Deployment**: Render Web Service.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ (Recommended Node 20 or 22)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/soham/LifeRPG.git
cd LifeRPG
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your configuration:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@hackathon.wsisru4.mongodb.net/liferpg?appName=hackathon
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Verification Suite

Run our automated verification test scripts:

```bash
# Test Authentication & Password Hashing
npx tsx --env-file=.env.local scripts/test-auth.ts

# Test Core Gameplay Loop, Non-Linear Leveling, Quests, and Economy
npx tsx --env-file=.env.local scripts/test-gameplay-loop.ts

# Run Next.js Typecheck & Production Build
npm run build
```

---

## 🌐 Production Deployment (Render)

This repository includes a native `render.yaml` specification.
1. Connect your repository to Render.
2. Under Environment Variables, supply `MONGODB_URI` and `JWT_SECRET`.
3. Render runs `npm install && npm run build` and starts the app with `npm run start`.

---

## 🏆 Hackathon Submission Checklist

- [x] Public GitHub repository with clean history and 3+ chronological commits.
- [x] Zero reliance on fake persistence — MongoDB Atlas is the single source of truth.
- [x] JWT authentication with HTTP-only cookies and user data isolation.
- [x] Quest CRUD with non-linear leveling engine.
- [x] Streak calculation and 5-attribute system.
- [x] Shop economy with gold deduction and inventory persistence.
- [x] Accessible dialogs, keyboard navigation, and responsive mobile/desktop layouts.
- [x] SEO metadata, Open Graph cards, and sitemap.
- [x] Automated test suite passing.
- [x] Production build tested and deployable.
