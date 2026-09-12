AI CODING AGENT RULES
1. Mission
You are an autonomous coding agent working on the Life RPG hackathon project.
Your objective is to implement the requirements in:

PRD.md

while maintaining:
progress.md

as the authoritative development progress log.
The project must be production-ready, secure, responsive, accessible, visually polished, and deployable.

2. DEVELOPMENT DIRECTORY BOUNDARY — CRITICAL
You are authorized to modify files ONLY inside the project/development directory provided for this repository.
Never intentionally modify, delete, move, rename, overwrite, or create files outside the project directory.

Do not attempt to modify:

/home/*
/root/*
/Users/*
/System/*
/Library/*
/Applications/*
/etc/*
/var/*
/usr/*
/opt/*
/tmp/*

or any other unrelated filesystem location.
Do not modify operating-system configuration.

Do not modify shell configuration.

Do not modify global package configuration.

Do not modify unrelated repositories.

Do not modify other projects.

Do not install system-wide software.

3. DESTRUCTIVE COMMAND SAFETY
Never run destructive commands unless absolutely necessary and explicitly constrained to the project directory.
NEVER execute commands such as:

rm -rf /
rm -rf ~
rm -rf *
sudo rm
sudo chmod
sudo chown
mkfs
fdisk
format
shutdown
reboot

Never execute recursive deletion commands against an ambiguous path.
Before any deletion, verify the exact path.

Prefer deleting individual known project files.

Never use shell commands whose expansion could unexpectedly include files outside the repository.

4. NO SYSTEM MODIFICATIONS
Do not:
Install global npm packages.
Modify global Python packages.
Modify OS PATH.
Modify shell profiles.
Modify system services.
Modify firewall configuration.
Modify DNS configuration.
Modify SSH configuration.
Modify unrelated environment variables.
Modify user accounts.
Modify permissions outside the project.
Use local project dependencies whenever possible.
5. PACKAGE MANAGEMENT
Use the project's existing package manager.
If the repository contains:

package-lock.json

prefer npm.
If it contains:

pnpm-lock.yaml

use pnpm.
If it contains:

yarn.lock

use yarn.
Do not replace the package manager without a strong reason.

Do not install unnecessary dependencies.

Every dependency should have a clear purpose.

6. COMMAND SAFETY
Before running a command, understand:
What it does.
What files it can modify.
Whether it can affect anything outside the project.
Whether it is necessary.
Prefer commands such as:
npm run dev
npm run build
npm run lint
npm run typecheck
git status
git diff

Avoid opaque scripts that execute unknown destructive operations.
7. GIT SAFETY
Git operations must remain inside the repository.
Never:

git push --force

unless explicitly requested.
Never rewrite public history unnecessarily.

Never delete branches unnecessarily.

Never reset or discard user work without confirmation.

Before destructive Git operations, inspect:

git status
git diff

Never overwrite existing user changes merely to make the working tree clean.
8. EXISTING USER WORK
Assume that any existing file may contain intentional user work.
Before replacing a file:

Read it.
Understand it.
Preserve useful existing work.
Modify only what is necessary.
Do not blindly regenerate the entire project if an existing implementation is already functional.
9. SECRETS
Never expose or commit:
JWT_SECRET
MONGODB_URI
API keys
passwords
private tokens
deployment credentials
OAuth secrets

Never print secrets in logs.
Never put secrets into source code.

Never commit .env.

Maintain:

.env.example

with placeholder values only.
10. AUTHENTICATION SECURITY
JWT authentication must use secure practices.
Use:

HTTP-only cookies
Secure cookies in production
SameSite protection
Short/minimal JWT payload
Strong JWT secret

Never store JWT authentication tokens in localStorage.
Never trust a client-provided:

userId
xp
gold
level
attribute
reward

The backend must calculate authoritative RPG values.
11. USER DATA ISOLATION
Every authenticated database operation must be scoped to the authenticated user.
Never trust:

req.body.userId
query.userId
URL userId
client user ID

for authorization.
The server must obtain the user identity from the verified JWT.

A user must never be able to read or modify another user's:

Tasks.
Character.
XP.
Gold.
Inventory.
History.
12. DATABASE SAFETY
Do not perform destructive database operations against production.
Never run:

drop database
drop collection
deleteMany({})

against a production database.
Never reset production data merely to solve a development problem.

Use a development database for destructive testing.

13. LOCALSTORAGE RULE
Do NOT use localStorage as the primary persistence mechanism.
The hackathon explicitly disqualifies applications whose primary data relies solely on localStorage.

Allowed uses:

Temporary UI preferences.
Non-critical visual settings.
Client-side caching where appropriate.
Not allowed:
Primary tasks.
XP.
Gold.
Character progression.
Inventory.
Authentication.
MongoDB must remain the source of truth.
14. BACKEND SOURCE OF TRUTH
Never trust the browser for:
XP reward
Gold reward
Level
Attributes
Streak
Inventory
Item price
Ownership
Quest ownership

The server must calculate and validate these values.
15. INPUT VALIDATION
All externally supplied input must be validated.
Use Zod or equivalent validation.

Validate:

Email.
Username.
Password.
Quest title.
Description.
Category.
Difficulty.
Attribute.
Item IDs.
Reject malformed requests.
Never assume the frontend validation is sufficient.

16. ERROR HANDLING
Never allow normal user/API errors to create blank screens.
Handle:

Authentication failure.
Unauthorized access.
Invalid input.
Missing resource.
Duplicate data.
Database errors.
Network failures.
Insufficient gold.
Duplicate purchase.
Duplicate quest completion.
Return useful HTTP status codes.
Do not expose stack traces to users.

17. FRONTEND RULES
The UI must be:
Responsive.
Accessible.
Keyboard navigable.
Visually cohesive.
Fast.
Do not introduce unnecessary loading screens.
Prefer skeletons for data loading.

Do not make hover the only way to access information or actions.

18. ANIMATION RULES
Animations should improve the experience, not damage usability.
Use:

Framer Motion.
CSS transforms.
Opacity.
Scale.
Spring animations.
Carefully scoped 3D effects.
Avoid:
Infinite heavy WebGL scenes.
Huge particle counts.
CPU-intensive animation loops.
Layout-shifting animations.
Animations that block interaction.
Respect:
prefers-reduced-motion

19. 3D RULES
React Three Fiber may be used.
However:

Functionality always has priority over 3D.
If a 3D effect causes:
Slow load.
Runtime errors.
Mobile issues.
WebGL failures.
Large bundle size.
replace or simplify it.
The application must still function if WebGL is unavailable.

Use graceful fallbacks.

20. PERFORMANCE
Avoid adding libraries just because they are popular.
Before installing a package, ask:

Does this materially improve the product or save meaningful development time?
Prefer existing dependencies.
Do not duplicate libraries with overlapping functionality.

21. SEO
The public landing page must have:
Proper title.
Meta description.
Open Graph metadata.
Semantic HTML.
Correct heading hierarchy.
Do not attempt to SEO-protect authenticated private pages at the expense of application performance.
22. ACCESSIBILITY
All important interactions must work with:
Tab
Enter
Space
Escape

Use semantic HTML.
Use accessible labels.

Use visible focus states.

Do not use clickable <div> elements when a <button> is appropriate.

Dialogs must be keyboard accessible.

23. RESPONSIVE DESIGN
Always test at least conceptually for:
Mobile
Tablet
Laptop
Desktop

Do not simply shrink desktop components.
Mobile navigation should remain easy to use.

24. NO FAKE FEATURES
Do not implement visual simulations that pretend to be real backend functionality.
For example, never make:

Gold increase visually

without persisting it.
Never fake:

Level progression
Shop purchases
Inventory
Quest completion

The feature must actually work.
25. NO FAKE PERSISTENCE
A feature is not considered complete until:
Action
↓
Database update
↓
Page refresh
↓
Persisted state still exists

This is particularly important for:
Quest creation.
Quest completion.
XP.
Level.
Gold.
Attributes.
Streak.
Purchases.
Inventory.
26. TEST AFTER CHANGES
After meaningful changes, run appropriate checks.
Examples:

npm run lint
npm run build

If a typecheck script exists:
npm run typecheck

Do not repeatedly run expensive commands when unnecessary.
27. BUILD FAILURE RULE
Never leave the project knowingly broken.
If a change introduces a build error:

Identify the cause.
Fix it.
Re-run the relevant check.
Update progress.md.
Do not simply document the failure and move on.
28. CONSOLE ERROR RULE
Normal application usage must not generate avoidable:
Unhandled Promise Rejection
TypeError
ReferenceError
React errors
Hydration errors

Investigate and fix them.
Warnings that are genuinely harmless may remain only if they cannot reasonably be fixed during the available time.

29. PROGRESS.MD — MANDATORY RULE
progress.md is a living project document.
You MUST update it after:

Every meaningful feature.
Every completed subtask.
Every bug fix.
Every architectural change.
Every visual improvement.
Every deployment change.
Every test result.
Every discovered issue.
Every blocked task.
Do not wait until the end of the project.
30. PROGRESS UPDATE FORMAT
After completing a small task, update:
progress.md

with:
Completed
Current State
Files Changed
Tests Performed
Known Issues
Next Task

Keep it concise but accurate.
Never claim something is complete if it has not been tested.

31. PROGRESS ACCURACY
Never fabricate progress.
Bad:

Authentication complete

when only the UI exists.
Good:

Registration UI complete.
API endpoint implemented.
MongoDB persistence tested locally.
Login still pending.

32. TASK EXECUTION LOOP
For every task:
1. Read relevant files.
2. Read PRD requirements.
3. Inspect progress.md.
4. Plan the smallest safe implementation.
5. Implement.
6. Test.
7. Fix errors.
8. Update progress.md.
9. Continue.

Do not skip step 8.
33. DO NOT OVERENGINEER
This is a 24-hour hackathon.
Prefer:

Simple
Reliable
Polished

over:
Complex
Fragile
Over-engineered

Do not introduce microservices.
Do not create unnecessary abstractions.

Do not build an unnecessary separate backend.

Do not implement features that are not relevant to judging before core requirements are complete.

34. PRIORITY ORDER
When deciding what to implement next:
P0:
Authentication
Database
Quest CRUD
Quest completion
XP
Leveling
Attributes
Streak
Gold
Shop
Deployment

P1:
Dashboard
Landing page
Animations
Responsive UI
Accessibility
SEO
Error handling

P2:
Advanced 3D
Extra themes
Advanced history
Extra badges
Decorative effects

Always finish P0 before spending significant time on P2.
35. TIME MANAGEMENT
If approximately:
18 hours remain

prioritize architecture and core functionality.
If:

10 hours remain

prioritize feature completion and integration.
If:

5 hours remain

stop adding major features.
Focus on:

Bugs.
Deployment.
Responsive fixes.
Accessibility.
SEO.
Demo flow.
If:
2 hours remain

freeze functionality.
Only fix critical bugs and prepare the submission.

36. DEPLOYMENT SAFETY
Before deployment:
Verify build locally.
Verify environment variables.
Verify MongoDB connection.
Verify production configuration.
Verify authentication.
Verify database persistence.
Verify public URL.
Never expose secrets in deployment logs.
37. README RULE
Keep README synchronized with the actual project.
Do not document features that do not exist.

Include:

Setup.
Environment variables.
Architecture.
Features.
Deployment.
Live URL.
Video URL when available.
38. HACKATHON RULE COMPLIANCE
Never violate the supplied problem statement.
Mandatory requirements take priority over optional creative additions.

Do not sacrifice:

Authentication
Database persistence
CRUD
RPG progression
Streaks
Attributes
Economy
Accessibility
Responsiveness
SEO
Deployment

for visual effects.
39. FINAL PRE-SUBMISSION CHECK
Before declaring the project finished, verify:
[ ] Public GitHub repository
[ ] At least 3 chronological commits
[ ] Backend code present
[ ] MongoDB persistence works
[ ] JWT authentication works
[ ] Registration works
[ ] Login works
[ ] Logout works
[ ] Quest CRUD works
[ ] Quest completion works
[ ] XP works
[ ] Non-linear leveling works
[ ] Attributes work
[ ] Streak works
[ ] Gold works
[ ] Shop works
[ ] Inventory persists
[ ] Refresh preserves data
[ ] Mobile works
[ ] Desktop works
[ ] Keyboard navigation works
[ ] SEO metadata exists
[ ] No critical console errors
[ ] Production build succeeds
[ ] Render deployment works
[ ] Public URL works
[ ] README exists
[ ] .env.example exists
[ ] Walkthrough video is 90–180 seconds
[ ] Video is under 100 MB
[ ] Video is publicly accessible

40. FINAL PRINCIPLE
When forced to choose between:
A beautiful feature that may break

and
A slightly simpler feature that definitely works

choose the second.
Then polish it.

The winning product is not the product with the most features.

It is the product that feels:

complete, alive, reliable, and memorable.