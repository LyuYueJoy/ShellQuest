# ShellQuest — Planning, Design and AI-Assisted Development Evidence

## 1. Document purpose

This document records the planning, design decisions, implementation process, testing evidence, AI prompts, agent instructions, and development context used while building ShellQuest.

It is intended to provide evidence that AI was used as a development assistant throughout the project, rather than only to produce final code. All AI-generated suggestions were reviewed, adapted, built, and tested by the developer before being accepted.

## 2. Project overview

ShellQuest is a tortoise-care application with gamification features. Users can manage tortoises, complete daily care tasks, earn experience points and coins, unlock achievements, purchase cosmetic items, and later customise an avatar.

The application uses:

- ASP.NET Core on .NET 10 for the backend
- Entity Framework Core with SQLite for persistence
- React and TypeScript for the frontend
- Material UI for the interface
- xUnit for backend automated tests
- Vitest and React Testing Library for frontend automated tests
- JWT-based authentication for protected user operations

## 3. Development plan

The work was divided into small, testable stages.

### Stage 1 — Dashboard gamification

- Extend the user model with XP, coins, and streak information.
- Add daily care tasks and user achievements.
- Automatically generate the current day's care tasks for each owned tortoise.
- Return level progress, daily progress, tasks, and the most recent achievement.
- Allow a user to complete a task and receive its reward once.
- Add repository, controller, dependency-injection registration, migrations, and tests.

### Stage 2 — Dashboard frontend

- Add TypeScript models matching the backend DTOs.
- Add authenticated API calls.
- Display level, XP, coins, streak, care-task progress, and recent achievement.
- Connect task completion to the backend and refresh visible progress.
- Add page and interaction tests.

### Stage 3 — Shop backend

- Add a shop catalogue, user inventory, and purchase history.
- Preserve the price paid at the time of purchase.
- Prevent duplicate ownership of non-consumable cosmetic items.
- Ensure users can purchase only active items and only when they have enough coins.
- Perform the coin deduction and inventory creation as one logical transaction.
- Add repository, controller, seeding support, migrations, and unit tests.

### Stage 4 — Shop frontend and assets

- Display real catalogue data returned by the backend.
- Add category filtering and purchase interactions.
- Handle authentication, loading, empty, success, and error states.
- Add frontend tests.
- Produce real visual assets with stable `AssetUrl` paths.
- Use transparent PNG overlays for wearable or shell items and WebP for full backgrounds.

### Stage 5 — Planned Avatar Studio

- Load items from the authenticated user's inventory.
- Equip items only when the user owns them.
- Store position, scale, rotation, and layer order.
- Allow a background to be selected independently from overlay items.
- Save and restore a customisation for a particular tortoise.

This final stage is a plan and is not claimed as completed in this document.

## 4. Design evidence

### 4.1 Dashboard data design

The user record was extended with:

- `TotalXp`
- `Coins`
- `CurrentStreak`
- `LongestStreak`
- `LastActiveDate`

The `DailyCareTasks` table stores the owner, tortoise, task type, task date, completion state, completion time, XP reward, and coin reward. A unique index across owner, tortoise, task type, and date prevents the automatic generator from creating duplicate daily tasks.

The `UserAchievements` table records unlocked achievements. A unique owner/type index prevents the same achievement from being unlocked more than once.

### 4.2 Daily-task behaviour

The dashboard repository generates missing tasks for the current date when dashboard data is requested. The generated task types are:

- Feed
- Bath
- Clean
- UVB
- Temperature

Each task belongs to both the authenticated owner and one of that owner's tortoises. Ownership checks are required for all reads and updates.

### 4.3 Shop data design

`ShopItems` stores catalogue information and visual-asset defaults:

- Name, description, category, and price
- `AssetKey`, `AssetUrl`, thumbnail, and asset type
- Default X and Y position
- Default scale and rotation
- Default Z-index
- Active state and sort order

`UserInventoryItems` connects a purchased item to its owner. The unique owner/item index prevents duplicate ownership.

`PurchaseTransactions` provides an audit record and stores `PricePaid`, so a later catalogue price change does not alter historical purchases.

### 4.4 Asset strategy

Cosmetic assets are stored as ordinary frontend public files, while the database stores stable URLs and placement defaults.

- Hats, shells, flowers, and glasses use transparent PNG files.
- Full-scene backgrounds use WebP.
- Placement metadata is separate from image content so Avatar Studio can adjust X, Y, scale, rotation, and Z-index later.
- Generated assets follow the application's friendly Claymorphism visual style.

This separation prevents binary image data from being stored in SQLite and keeps future avatar editing flexible.

## 5. Implementation evidence

### 5.1 Dashboard response verified during development

The dashboard endpoint returned level 1, 0 XP, 0 coins, 0 streak, and ten generated care tasks for two tortoises. Each tortoise received the five planned task types. This demonstrated that task generation, tortoise ownership, DTO mapping, and progress calculation were connected successfully.

### 5.2 Database migrations

Two significant migrations were created and built successfully:

- `AddDashboardGamification`
- `AddShopTables`

The migrations include foreign keys, uniqueness constraints, indices, and reversible `Down` operations.

### 5.3 Real shop catalogue assets

The current catalogue uses these asset paths:

```text
/assets/shop/hats/hat-straw.png
/assets/shop/hats/hat-wizard.png
/assets/shop/hats/hat-crown.png
/assets/shop/shells/shell-forest.png
/assets/shop/shells/shell-sunset.png
/assets/shop/shells/shell-galaxy.png
/assets/shop/accessories/flower-dandelion.png
/assets/shop/accessories/glasses-round.png
/assets/shop/backgrounds/garden.webp
```

The final assets were checked for file type and dimensions. Overlay items have an alpha channel, and the garden background has a clear central composition area for the tortoise avatar.

## 6. Testing and verification evidence

### 6.1 Backend

The recorded .NET test run completed successfully:

```text
Test summary: total 22, failed 0, passed 22, skipped 0
backend net10.0 build succeeded
backend.Tests net10.0 build succeeded
```

Backend tests covered the implemented dashboard and shop behaviours, including successful cases and validation/ownership cases.

### 6.2 Frontend

One recorded frontend test run reported:

```text
Test Files  2 passed (2)
Tests       17 passed (17)
```

A separate Vitest worker startup timeout occurred while starting a thread worker. The run contained no failed assertions because the worker did not start. The environment issue was investigated separately and the developer later confirmed that the tests ran successfully.

This distinction is important: an infrastructure timeout is not recorded as a successful test, and successful assertions are not used to conceal an unhandled test-runner error.

### 6.3 Manual verification

The developer also manually verified:

- The authenticated dashboard response had the expected shape.
- Daily tasks appeared for both owned tortoises.
- Shop endpoints rejected expired authentication with `401 Unauthorized`.
- Logging in again supplied a valid token.
- Real product images were served and displayed correctly in the frontend.

## 7. AI-assisted development workflow

AI was used for:

- Breaking features into implementation stages
- Reviewing Entity Framework migrations
- Designing entities, DTOs, repositories, and API responsibilities
- Planning authentication and ownership validation
- Suggesting test cases and interpreting test output
- Diagnosing a Vitest worker startup timeout
- Designing the shop asset model for future avatar transformations
- Drafting seed-data structure
- Generating visual product assets from written art prompts
- Producing this evidence document

The developer remained responsible for:

- Selecting which suggestions to implement
- Editing and integrating code into the existing project
- Running migrations and builds
- Running automated tests
- Testing endpoints with real authentication
- Confirming that assets were served correctly
- Rejecting or postponing features that were outside the immediate scope

## 8. Development prompt log

The following prompts are retained as evidence of the iterative AI-assisted process. They include planning, implementation, debugging, and design requests—not only requests for final code.

### 8.1 Dashboard and gamification prompts

```text
I am going to implement the backend next.
```

```text
Build succeeded. Next, create IDashboardRepository and DashboardRepository to read user game data, automatically generate today's tasks, and return the most recent achievement.
```

```text
The result is correct. Continue to the next step.
```

```text
Before the page unit tests, I also want users to be able to add, delete, and edit tasks.
```

```text
Each person should also have a fixed maximum amount of XP they can earn per day. First give me an approach for task CRUD and the daily XP limit.
```

```text
Do not implement this yet.
```

The last prompt is evidence that the developer controlled scope and did not automatically accept every proposed feature.

### 8.2 Achievement prompt

```text
What can appear under Recent Achievement?
```

### 8.3 Shop planning and backend prompts

```text
Implement the Shop feature first. Give me the database design and the endpoints and functions that need to be implemented.
```

```text
Where should the product images come from? Should they use icons or something else? Later, users need to adjust item position and size. That probably belongs to Avatar, but it would be better to consider it now so it is easier to implement later.
```

```text
Now implement the Shop backend first.
```

```text
I do not want to add data here.
```

```text
For now I do not want to add data. Just implement the functionality.
```

```text
Unit tests.
```

```text
The tests passed. Next step.
```

```text
I want to add real product data now.
```

```text
What is the ShopDataSeeder code?
```

### 8.4 Authentication and debugging prompts

```text
It displays 401 Unauthorized.
```

```text
It says my token has expired.
```

```text
It is fixed now. No problem. Frontend.
```

```text
npx vitest run .\tests\pages\ShopPage.test.tsx --reporter=verbose

Error: [vitest-pool]: Failed to start threads worker...
Caused by: Timeout waiting for worker to respond
```

### 8.5 Visual asset prompts

The following written prompts were used to generate actual shop assets.

#### Forest Shell

```text
Create a single isolated domed tortoise shell cosmetic overlay for ShellQuest in a soft handcrafted clay style. Use forest green scutes with lighter green leaf motifs. Show only the shell, with no tortoise body, text, UI, or extra objects. Use a uniform chroma background so it can be converted to a transparent PNG. Keep a consistent three-quarter front view suitable for avatar overlay placement.
```

#### Sunset Shell

```text
Create a single isolated domed tortoise shell cosmetic overlay for ShellQuest in a soft handcrafted clay style. Use warm coral, orange, and burgundy sunset colours with sun, wave, moon, and star motifs. Show only the shell, with no tortoise body, text, UI, or extra objects. Use a uniform chroma background so it can be converted to a transparent PNG.
```

#### Galaxy Shell

```text
Create a single isolated domed tortoise shell cosmetic overlay for ShellQuest in a soft handcrafted clay style. Use deep blue and violet galaxy textures with stars, planets, moons, constellations, and glowing nebulae. Show only the shell, with no tortoise body, text, UI, or extra objects. Use a uniform chroma background so it can be converted to a transparent PNG.
```

#### Dandelion accessory

```text
Create a single cute dandelion flower accessory for a tortoise avatar customisation game called ShellQuest. Use a soft handcrafted polymer-clay style matching a warm pet-care UI. Include one golden-yellow flower, a short curved green stem, and two small leaves. Centre and isolate the item with no tortoise, pot, ground, text, or border. Use a uniform chroma background for transparent-background processing.
```

#### Round-glasses accessory

```text
Create one pair of cute round eyeglasses as an avatar overlay for ShellQuest. Use a soft handcrafted polymer-clay style. Include two symmetrical amber-gold round frames, a small bridge, short curved arms, and subtle lens highlights. Use a nearly front-facing view, with no face, tortoise, text, or extra objects. Use a uniform chroma background for transparent-background processing.
```

#### Garden background

```text
Create a charming garden habitat background for ShellQuest in a polished handcrafted clay style. Use a wide landscape composition with green grass, flowers, stepping stones, shrubs, a wooden fence, warm sunlight, and a pale blue sky. Leave a spacious uncluttered central area where a user's tortoise avatar can be composited. Do not include a tortoise, people, text, UI, or logos.
```

### 8.6 Documentation prompt

```text
Create a downloadable Markdown document that contains evidence of planning, design, and AI-assisted development. Include AI prompt files, agent instructions, context/config files, and prompts used during development—not just final code.
```

## 9. Agent instructions used for AI collaboration

The following project-level instructions describe how the AI assistant was expected to work. They can also be placed in a repository `AGENTS.md` file if the submission requires a separate agent-instruction file.

```markdown
# ShellQuest Agent Instructions

## Working approach

- Implement one small feature stage at a time.
- Inspect the existing project structure and conventions before proposing code.
- Do not replace unrelated developer changes.
- Use repository and DTO layers consistently with the existing backend.
- Apply authentication and ownership checks to user-specific data.
- Keep controllers thin and business/database logic in the appropriate service or repository.
- Do not seed example data until the developer explicitly approves it.

## Database changes

- Use Entity Framework Core migrations.
- Include foreign keys, useful indices, and uniqueness constraints.
- Ensure migrations contain a valid reversible `Down` method.
- Do not edit generated migration history manually unless required and reviewed.

## Testing

- Build after structural backend changes.
- Add unit tests for success, validation, insufficient-balance, duplicate, not-found, authentication, and ownership cases where applicable.
- Run the relevant test file first, followed by the complete suite.
- Do not treat a test-runner infrastructure error as a passing test.

## Frontend

- Keep API response types explicit in TypeScript.
- Show loading, empty, error, and success states.
- Preserve accessibility through labels and semantic controls.
- Store product assets under stable public paths.

## AI transparency

- Preserve significant prompts and decisions in Markdown.
- State which suggestions were AI-assisted.
- Require developer review, compilation, and testing before accepting generated code.
```

## 10. Development context/config record

The following context was supplied to the AI assistant during development. This section can be copied into a separate `AI_CONTEXT.md` file later if the assessment requires multiple files.

```yaml
project: ShellQuest
backend:
  framework: ASP.NET Core
  dotnet_version: 10.0
  orm: Entity Framework Core
  database: SQLite
  tests: xUnit
frontend:
  framework: React
  language: TypeScript
  component_library: Material UI
  tests: Vitest and React Testing Library
authentication:
  method: JWT bearer token
features_completed:
  - dashboard gamification data
  - automatic daily care-task generation
  - task completion rewards
  - user achievements and recent achievement
  - shop catalogue backend
  - purchases and user inventory
  - shop frontend
  - real shop visual assets
features_deferred:
  - user-created task CRUD
  - daily XP cap
features_planned:
  - Avatar Studio
asset_policy:
  overlays: transparent PNG
  backgrounds: WebP
  database_storage: stable asset URL and placement defaults
quality_checks:
  - compile backend
  - run backend automated tests
  - run frontend automated tests
  - manually verify authenticated API behaviour
  - manually verify public assets load
```

## 11. Key decisions and rationale

1. **Generate daily tasks idempotently.** A uniqueness constraint makes repeated dashboard requests safe.
2. **Store purchase history separately from inventory.** Inventory describes current ownership; transactions preserve an audit trail and historical price.
3. **Keep catalogue images outside the database.** This reduces database size and lets the frontend serve static files efficiently.
4. **Store placement defaults now.** This avoids a disruptive catalogue redesign when Avatar Studio is added.
5. **Protect purchase operations with authentication.** The server derives the owner from the authenticated identity rather than trusting an owner ID sent by the browser.
6. **Treat expired JWTs as an authentication issue.** A `401` caused by an expired token is resolved through reauthentication, not by weakening endpoint security.
7. **Defer task CRUD and daily XP limits.** These ideas were documented but intentionally kept outside the current implementation scope.

## 12. Risks and future improvements

- Add refresh-token handling or a clear frontend re-login flow for expired JWTs.
- Add concurrency protection around coin deduction if the application moves beyond a single-user SQLite development environment.
- Add integration tests against the real HTTP pipeline in addition to repository/controller unit tests.
- Store avatar placements using normalised coordinates so layouts remain stable across screen sizes.
- Consider thumbnails or responsive image variants for slower devices.
- Confirm licences and attribution requirements for every non-generated third-party asset.
- Split this evidence record into `AGENTS.md`, `AI_CONTEXT.md`, and feature-specific prompt files if the submission rubric expects separate files.

## 13. Declaration

AI contributed planning suggestions, draft code structures, debugging guidance, test ideas, written documentation, and visual-asset generation. The developer reviewed the output, chose the implementation scope, integrated changes, executed builds and tests, diagnosed authentication behaviour, and manually verified the finished features.

This document deliberately records both successful work and encountered issues to provide an accurate development history.