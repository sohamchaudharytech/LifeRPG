Life RPG — Product Requirements Document
1. Project Overview
Hackathon
Tech Zephyr 4.0 — Web Hackathon
Organized by IIT Bhubaneswar
Round
Round 1 — Qualifying Round
Available Development Time
24 hours
Product
Life RPG
Product Tagline
Level up your real life.
Core Concept
Life RPG transforms real-world productivity into a video-game-like progression system.
Users create real-life quests such as:

Study for 60 minutes
Go to the gym
Complete a coding assignment
Read 20 pages
Drink enough water
Meditate
Practice a skill
Completing quests provides:
XP
Gold
Attribute XP
Streak progress
Character progression
Potential rewards
The experience should feel like a game rather than a productivity application.
2. Primary Objective
Build a complete, production-deployed full-stack web application that satisfies every mandatory requirement in the hackathon problem statement while providing a visually impressive and memorable user experience.
The application must demonstrate:

Secure user authentication.
Persistent database-backed user data.
Task/quest CRUD.
Non-linear RPG leveling.
Streak tracking.
Character attributes.
Reward/economy system.
Virtual inventory/items.
Responsive design.
Keyboard accessibility.
SEO-friendly public pages.
Smooth animations and interactions.
Robust error handling.
Production deployment.
A clear demonstration video.
3. Product Philosophy
The application should NOT look like:
A Bootstrap admin dashboard.
A generic SaaS template.
A normal todo application.
A spreadsheet.
A CRUD database UI.
It should feel like:
A futuristic game interface that happens to help the user improve their real life.
Every interaction should communicate progression.
Examples:

Instead of:

Task completed.
Use:
QUEST COMPLETE
+125 XP
+40 GOLD
INTELLECT +8
Instead of:
Task
Use:
Quest
Instead of:
Points
Use:
XP / Gold
Instead of:
Profile
Use:
Character
4. Target Users
Primary users:
Students
Developers
Gamers
People trying to build habits
Productivity enthusiasts
The interface should nevertheless be simple enough for a first-time user to understand within seconds.
5. Recommended Technology Architecture
Frontend
Next.js
TypeScript
React
Tailwind CSS
Framer Motion
React Three Fiber
Drei
Lucide React
Backend
Next.js Route Handlers / API endpoints.
Do NOT create a separate Express application unless technically necessary.

Database
MongoDB Atlas.
Authentication
JWT authentication using:
jose
HTTP-only secure cookies
bcrypt password hashing
Never store authentication tokens in localStorage.
Validation
Zod.
Deployment
Render.
Repository
GitHub.
6. High-Level Architecture
Browser
   |
   v
Next.js Application
   |
   +-------------------+
   |                   |
   v                   v
UI / React         API Routes
                       |
                       v
                 Auth Middleware
                       |
                       v
                    JWT
                       |
                       v
                  MongoDB Atlas

The frontend and backend live in the same repository.
7. Authentication Requirements
Users must be able to:
Register.
Login.
Logout.
Maintain an authenticated session.
Access only their own data.
Registration
Required fields:
Username
Email
Password
Validation:
Valid email.
Password minimum 8 characters.
Username minimum 3 characters.
Reject duplicate email.
Reject malformed input.
Passwords must NEVER be stored in plaintext.
Use bcrypt hashing.

JWT
Use JWT for session authentication.
Recommended implementation:

Login
  ↓
Validate credentials
  ↓
Generate JWT
  ↓
Set HTTP-only cookie
  ↓
Browser automatically sends cookie
  ↓
Protected API verifies JWT
  ↓
Extract user ID
  ↓
Query only that user's data

JWT should contain a minimal payload:
{
  "sub": "userId",
  "email": "user@example.com"
}

Never place passwords or sensitive user data inside the JWT.
Cookie
Authentication token should be stored in an HTTP-only cookie.
Recommended production settings:

httpOnly: true
secure: true
sameSite: lax

Do not use localStorage for authentication.
8. Database Design
MongoDB should contain at minimum the following collections.
Users
Example:
{
  _id,
  username,
  email,
  passwordHash,

  level,
  totalXp,
  currentXp,

  gold,

  streak,
  longestStreak,
  lastActivityDate,

  attributes: {
    strength,
    intellect,
    discipline,
    vitality,
    creativity
  },

  inventory: [
    {
      itemId,
      quantity
    }
  ],

  equippedTheme,

  createdAt,
  updatedAt
}

Tasks / Quests
{
  _id,
  userId,

  title,
  description,

  category,

  difficulty,

  xpReward,
  goldReward,

  attribute,

  completed,

  completedAt,

  createdAt,
  updatedAt
}

Optional Completion History
If implementation time permits:
{
  _id,
  userId,
  taskId,

  xpEarned,
  goldEarned,
  attribute,
  
  completedAt
}

This provides stronger historical tracking.
9. Attribute System
Every quest belongs to an attribute.
Initial attributes:

Attribute	Example Quests
Strength	Gym, running, exercise
Intellect	Coding, studying, reading
Discipline	Meditation, waking early, routine
Vitality	Sleep, hydration, healthy food
Creativity	Drawing, writing, music

The user begins with:
Strength: 1
Intellect: 1
Discipline: 1
Vitality: 1
Creativity: 1

Completing a quest increases the relevant attribute.
Example:

Complete coding quest
↓
+10 Intellect XP

The frontend should display these as RPG character stats.
10. XP / Leveling System
The leveling system MUST be non-linear.
Do not use:

Level * 100

as a constant linear requirement.
Use an exponential/polynomial progression.

Recommended formula:

requiredXp(level) = Math.floor(100 * Math.pow(level, 1.5))

Example approximate progression:
Level 1 → 100 XP
Level 2 → 282 XP
Level 3 → 519 XP
Level 4 → 800 XP
Level 5 → 1118 XP

The exact displayed values do not need to be exposed to users.
The backend must be the authority for XP calculations.

11. XP Reward System
Quest rewards depend on difficulty.
Recommended difficulty levels:

Easy
Medium
Hard
Epic

Suggested rewards:
Easy:
+50 XP
+20 Gold

Medium:
+100 XP
+40 Gold

Hard:
+200 XP
+80 Gold

Epic:
+400 XP
+150 Gold

The backend determines the actual reward.
Never trust XP values sent by the browser.

A malicious user must not be able to send:

{
  "xpReward": 99999999
}

and receive that amount.
12. Quest System
Users must be able to:
Create quest.
Read quests.
Complete quest.
Edit quest.
Delete quest.
Filter quests.
View completed quests.
Create Quest
Fields:
Title
Description
Category
Difficulty
Attribute

The server determines:
XP reward.
Gold reward.
Quest Categories
Recommended:
Study
Fitness
Coding
Health
Creativity
Personal
Other
13. Quest Completion Flow
When a user completes a quest:
User clicks COMPLETE
        ↓
Optimistic UI animation
        ↓
API request
        ↓
Authenticate JWT
        ↓
Verify task belongs to user
        ↓
Verify task isn't already completed
        ↓
Calculate XP
        ↓
Calculate Gold
        ↓
Update user XP
        ↓
Calculate level
        ↓
Update attribute
        ↓
Update streak
        ↓
Mark quest completed
        ↓
Return updated character state
        ↓
Celebration animation

The backend is the source of truth.
14. Anti-Cheat Requirements
The frontend must NEVER be trusted for:
XP.
Gold.
Level.
Attribute values.
Ownership.
Quest completion rewards.
The client may request:
"Complete quest ABC"

The server calculates everything else.
Every protected query must filter using authenticated userId.

Never allow:

GET /api/tasks?userId=someone-else

to expose another user's tasks.
The backend must obtain user identity from the verified JWT rather than trusting a client-provided user ID.

15. Streak System
Track consecutive days of activity.
A user's streak should increase when they complete at least one quest during a new calendar day.

Example:

Monday → complete quest → streak 1
Tuesday → complete quest → streak 2
Wednesday → complete quest → streak 3

If a user misses a day:
Monday → activity
Tuesday → activity
Wednesday → no activity
Thursday → activity

New streak = 1

The implementation must use server-side dates consistently.
Avoid timezone bugs as much as possible.

16. Economy
Users earn Gold when completing quests.
Gold can be spent in the Shop.

Example shop:

COMMON
- Bronze Frame — 100 Gold

RARE
- Neon Avatar Ring — 300 Gold

EPIC
- Cyber Knight Theme — 750 Gold

LEGENDARY
- Cosmic Aura — 1500 Gold

The shop should contain approximately 6–10 items.
Items can include:

Profile frames.
Character themes.
Avatar effects.
Background effects.
Badges.
Purchasing an item:
Click BUY
↓
API request
↓
Authenticate
↓
Check gold
↓
Check ownership
↓
Deduct gold
↓
Add item to inventory
↓
Return updated inventory

Never trust the client's gold balance.
17. Main Application Pages
Public Landing Page
Route:
/

Purpose:
Sell the concept immediately.

Hero:

LEVEL UP
YOUR REAL LIFE.

Supporting text:
Turn your daily goals into quests,
earn XP, build your character,
and become the protagonist of your own life.

CTA:
START YOUR JOURNEY

Secondary CTA:
EXPLORE THE SYSTEM

The landing page should be highly visual.
18. Dashboard
Route:
/dashboard

This is the primary authenticated screen.
Display:

Character Header
LEVEL 12

████████████░░░░

2,840 / 4,120 XP

🔥 14 DAY STREAK

💰 1,240 GOLD

Attributes
Cards:
STR  24
INT  31
DIS  19
VIT  27
CRE  16

Active Quests
Show 3–6 quests.
Each card contains:

Quest name.
Category.
Difficulty.
XP reward.
Gold reward.
Attribute.
Complete button.
19. Quest Page
Route:
/quests

Features:
All quests.
Search.
Filter by category.
Filter by difficulty.
Completed/active filters.
Create quest.
Edit quest.
Delete quest.
20. Character Page
Route:
/character

Display:
Character identity.
Current level.
XP.
Streak.
Attributes.
Badges.
Equipped items.
Inventory.
This page should feel like an RPG character sheet.
21. Shop Page
Route:
/shop

Display:
Current gold.
Item cards.
Rarity.
Price.
Owned state.
Buy button.
Purchased items should persist after refresh.
22. History Page
Route:
/history

Display:
Completed quests.
XP earned.
Gold earned.
Attribute gained.
Completion dates.
If time becomes constrained, this page can be simplified but should remain functional if implemented.
23. 3D / Visual Design Direction
Use a futuristic cyber-fantasy aesthetic.
Suggested palette:

Background:
#05060A

Surface:
#0B0F18

Primary:
#7C3AED

Secondary:
#06B6D4

Accent:
#22D3EE

Success:
#22C55E

Gold:
#F59E0B

Danger:
#EF4444

Use gradients sparingly but effectively.
Example:

Purple → Cyan

Typography should feel futuristic but remain highly readable.
Possible typography:

Space Grotesk
Inter
JetBrains Mono for numeric/stat elements
24. 3D Experience
Use React Three Fiber only where it creates meaningful visual impact.
Do NOT turn the entire application into a heavy 3D scene.

Recommended:

Landing Page
Large floating 3D crystal/core/orb.
It slowly rotates.

User movement creates subtle parallax.

Dashboard
Small animated energy core behind the character stats.
Level Up
When a user levels up:
Screen glow.
Particle burst.
Scale animation.
3D object expands.
XP bar fills.
Level number animates.
Shop
Subtle 3D hover effects on rare/legendary items.
Avoid continuously rendering expensive scenes unnecessarily.

Use:

transform
opacity
CSS gradients
Framer Motion
GPU-friendly animations
for most micro-interactions.
25. "Endless Scaling" Visual Effects
The requested scaling aesthetic should mean:
Elements subtly breathe.
Hover cards expand.
Level-up elements dramatically scale.
Background particles continuously move.
XP bars animate.
Buttons have tactile press states.
Do not implement infinite uncontrolled scaling animations that cause layout shifts or performance issues.
Use bounded animations such as:

scale: 1 → 1.03 → 1

for idle effects.
For major events:

0.8 → 1.15 → 1

with spring physics.
26. Completion Animation
Quest completion should be the application's signature interaction.
Example:

[COMPLETE QUEST]

        ↓

button compresses

        ↓

green/cyan energy burst

        ↓

+125 XP floats upward

        ↓

+40 GOLD floats upward

        ↓

attribute card pulses

        ↓

XP bar fills

        ↓

if level threshold reached:

LEVEL UP!

        ↓

screen glow + particles

This interaction should feel rewarding.
27. Level-Up Experience
If completing a quest causes a level-up:
Display an overlay:

LEVEL UP

12 → 13

YOUR POWER GROWS

+1 CHARACTER LEVEL
+STAT BONUS

CONTINUE

Use:
Framer Motion.
CSS glow.
Particle effects.
Optional lightweight 3D effect.
The overlay must be dismissible with:
Mouse.
Enter.
Space.
Escape.
28. Responsive Design
Must work on:
Mobile.
Tablet.
Laptop.
Desktop.
Mobile navigation should use:
Bottom navigation

with:
Home
Quests
Character
Shop

Desktop can use:
Left sidebar

Do not simply shrink the desktop layout.
Design mobile intentionally.

29. Accessibility
Must support:
Keyboard navigation.
Visible focus indicators.
Semantic buttons.
Semantic headings.
Form labels.
Accessible dialogs.
Accessible error messages.
Sufficient color contrast.
Reduced motion preference.
Interactive elements must be reachable with Tab.
Buttons must work with Enter/Space.

Do not make important interactions dependent solely on hover.

Respect:

prefers-reduced-motion

30. SEO
The public landing page must contain:
Descriptive title.
Meta description.
Open Graph metadata.
Semantic HTML.
Proper heading hierarchy.
Descriptive page content.
Suggested title:
Life RPG — Level Up Your Real Life

Suggested description:
Turn real-life goals into quests, earn XP, build your character, maintain streaks, and level up your life.

Authenticated application pages do not need to be aggressively indexed.
The landing page is the primary SEO target.

31. Performance Requirements
Target:
Fast initial load.
No unnecessary JavaScript.
Optimized images.
Lazy-loaded 3D components where appropriate.
No massive assets.
No unnecessary continuous animations.
No blocking network requests where avoidable.
Use loading skeletons.
Use optimistic UI only where rollback is safe.

32. Error Handling
The application must never display a blank screen because of a normal API failure.
Handle:

Invalid login
Invalid registration
Duplicate email
Empty quest
Network failure
Unauthorized request
Expired session
Quest not found
Already completed quest
Insufficient gold
Already owned item
Database failure

Display user-friendly messages.
Example:

Quest couldn't be completed.
Your progress is safe — please try again.

Never expose:
Database connection strings.
Stack traces.
JWT secrets.
Internal server errors.
33. API Design
Recommended routes:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/tasks/:id/complete

GET    /api/character
GET    /api/history

GET    /api/shop
POST   /api/shop/:itemId/purchase

All protected routes must verify JWT authentication.
34. API Security
Every mutation must verify:
User is authenticated.
Requested resource belongs to the user.
Input passes Zod validation.
Operation is logically valid.
Never trust:
userId
xp
gold
level
attribute
reward

from the client.
35. Environment Variables
Create:
.env.example

with:
MONGODB_URI=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=

If additional environment variables become necessary, add them to .env.example.
Never commit .env.

Never hardcode secrets.

36. UI Components
Recommended reusable components:
Button
Card
Modal
Input
Select
ProgressBar
XPBar
StatCard
QuestCard
QuestForm
CharacterHeader
AttributeCard
StreakCard
GoldDisplay
ShopItem
InventoryItem
LevelUpModal
Toast
LoadingSkeleton
EmptyState
Navbar
Sidebar
MobileNav
ParticleBackground

37. Folder Structure
Recommended structure:
/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── quests/
│   ├── character/
│   ├── shop/
│   ├── history/
│   └── api/
│       ├── auth/
│       ├── tasks/
│       ├── character/
│       ├── shop/
│       └── history/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── quests/
│   ├── character/
│   ├── shop/
│   └── effects/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── validation/
│   ├── rpg/
│   └── utils/
│
├── models/
│
├── types/
│
├── public/
│
├── middleware.ts
│
├── README.md
├── PRD.md
├── RULES.md
├── progress.md
├── .env.example
└── package.json

38. RPG Engine
Create centralized RPG functions.
Example conceptual API:

calculateQuestReward()
calculateRequiredXp()
calculateLevelFromXp()
calculateLevelProgress()
applyQuestCompletion()
calculateStreak()

Do not scatter progression formulas throughout UI components.
The backend should use the same centralized RPG logic.

39. Seed Data
The application may include predefined shop items and optionally starter quests.
Example starter quests:

Complete 30 minutes of coding
Read 10 pages
Do 20 push-ups
Drink 2L of water
Meditate for 10 minutes

Starter quests should belong to the authenticated user after account creation.
Do not use fake persistent user progress.

The database must remain the source of truth.

40. First-Time User Experience
After registration:
Registration
↓
Character creation / welcome
↓
Starter character
↓
Starter quests
↓
Dashboard

Keep onboarding short.
Do not force the user through a long wizard.

41. Empty States
If no quests exist:
YOUR QUEST BOARD IS EMPTY

Every legend starts with a single quest.

[CREATE YOUR FIRST QUEST]

If no history:
NO ADVENTURES YET

Complete your first quest to begin your story.

42. Loading States
Every page that requires network data should have a loading state.
Use skeletons instead of blank screens.

Example:

████████████████
████████
████████████

Avoid displaying:
Loading...

everywhere unless appropriate.
43. Optimistic UI
Quest completion may use optimistic updates.
However:

Save previous state.
Send request.
If request succeeds, reconcile with server.
If request fails, rollback.
Show an error.
Never permanently mutate local state without server confirmation.
44. Deployment
Deploy to Render.
Production requirements:

Build succeeds.
Start command works.
MongoDB connects.
Environment variables configured.
Public URL accessible.
Authentication works.
Database writes work.
Refreshing the application does not lose data.
45. Git Requirements
Repository must contain at least 3 chronological commits.
Recommended commit strategy:

commit 1:
Initialize Next.js project and architecture

commit 2:
Implement authentication and MongoDB persistence

commit 3:
Implement quest/RPG engine

commit 4:
Implement dashboard and character system

commit 5:
Implement shop/economy

commit 6:
Implement visual polish and animations

commit 7:
SEO, accessibility, error handling

commit 8:
Production deployment and final fixes

Do not squash everything into one commit.
46. README Requirements
README must include:
Project overview.
Features.
Tech stack.
Architecture.
Setup instructions.
Environment variables.
MongoDB setup.
Local development instructions.
Production deployment instructions.
Authentication explanation.
RPG progression explanation.
Screenshots if available.
Live demo link.
Video link.
47. Walkthrough Video Requirements
Video must be:
90–180 seconds.
Under 100 MB.
Publicly accessible.
No login required to view.
The video should demonstrate:
1. Landing page
2. Sign up
3. Login
4. Dashboard
5. Create quest
6. Complete quest
7. XP animation
8. Attribute increase
9. Level progression
10. Gold reward
11. Shop purchase
12. Refresh page
13. Show persisted state

The persistence demonstration is particularly important.
48. Demo Strategy
The demo should be rehearsed.
Start with:

"What if your productivity app felt like a game?"
Immediately show the landing page.
Then:

Login
↓
Dashboard
↓
Complete quest
↓
XP explosion
↓
Level up
↓
Shop
↓
Refresh

Avoid spending video time explaining code.
Demonstrate functionality.

49. Definition of Done
The project is NOT complete until:
Authentication
 Registration works.
 Login works.
 Logout works.
 Passwords are hashed.
 JWT authentication works.
 HTTP-only cookie is used.
 Unauthorized users cannot access protected APIs.
 Users cannot access another user's data.
Database
 MongoDB connection works.
 User data persists.
 Quest data persists.
 Character state persists.
 Inventory persists.
 Refresh does not reset progress.
RPG
 XP works.
 Non-linear levels work.
 Attributes work.
 Streak works.
 Gold works.
 Shop works.
 Inventory works.
UI
 Landing page polished.
 Dashboard polished.
 Quest management polished.
 Character page polished.
 Shop polished.
 Animations work.
 Mobile layout works.
 Desktop layout works.
Accessibility
 Keyboard navigation.
 Focus states.
 Labels.
 Semantic HTML.
 Reduced-motion support.
SEO
 Metadata.
 Semantic structure.
 Open Graph metadata.
 Public landing page optimized.
Deployment
 GitHub public.
 3+ commits.
 Render deployment working.
 Production MongoDB working.
 No runtime crashes.
 No console errors during normal usage.
 .env.example exists.
 README complete.
 Demo video complete.
50. Priority System
When time becomes limited, use this priority order.
P0 — Absolutely Required
Authentication.
MongoDB persistence.
Quest CRUD.
Quest completion.
XP.
Leveling.
Attributes.
Streak.
Gold.
Shop.
Production deployment.
No runtime crashes.
P1 — High Scoring
Beautiful dashboard.
Landing page.
Quest completion animation.
Level-up animation.
Responsive UI.
Character page.
Accessibility.
SEO.
Error handling.
P2 — Polish
3D landing scene.
Advanced particle effects.
Additional themes.
Inventory animations.
History visualization.
Extra badges.
Advanced transitions.
If time is running out, sacrifice P2 before sacrificing P0/P1.
51. Critical Engineering Principle
The project should prioritize:
Reliability
    >
Functionality
    >
UX
    >
Visual effects

A beautiful application that crashes during judging is a failed submission.
A functional application with exceptional UX and controlled visual effects is the target.

52. Final Product Vision
The finished application should make a user feel:
"I want to complete one more task because I want to see my character level up."
That emotional loop is the core of Life RPG.
The fundamental loop is:

REAL-LIFE ACTION
       ↓
QUEST COMPLETION
       ↓
INSTANT FEEDBACK
       ↓
XP + GOLD + ATTRIBUTE
       ↓
CHARACTER PROGRESSION
       ↓
REWARDS
       ↓
MOTIVATION
       ↓
MORE REAL-LIFE ACTION

