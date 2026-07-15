# ShellQuest Development Handover

## 1. Project Overview

ShellQuest is a gamified tortoise-care community application for the MSA 2026 Phase 2 Software Assessment.

Technology stack:

- Frontend: React 19, TypeScript, Vite, Material UI
- Backend: ASP.NET Core Web API with .NET 10
- Database: SQLite with Entity Framework Core
- Authentication: JWT Bearer
- Password hashing: BCrypt
- API documentation: Scalar
- Backend testing: xUnit and Moq
- Frontend testing: Vitest and React Testing Library
- UI direction: responsive tortoise-themed Claymorphism
- Planned advanced feature: MUI light/dark theme switching

The project must retain a React frontend, .NET backend, EF Core persistence, CRUD, responsive design, routing, unit tests, deployment documentation, regular Git history, and evidence of AI-assisted development in `/specs`.

## 2. Current Development Goal

The completed feature is **My Tortoises**. The next feature is the full-stack **Dashboard**, which must include:

- Level
- XP
- Coins
- Today's Tasks
- Today's Progress
- Streak
- Recent Achievement

The Dashboard is the home page and should be one of the most visually impressive parts of the application.

## 3. Completed Authentication Work

The project already has:

- User registration and login
- BCrypt password hashing
- JWT generation and Bearer authentication
- Protected frontend routes
- Token and user data stored in `sessionStorage` as `shellQuestToken` and `shellQuestUser`
- A shared `apiClient.ts` that adds the Bearer token to authenticated requests

Do not replace JWT authentication with a fake Boolean login state.

## 4. Completed My Tortoises Backend

The backend supports a one-to-many relationship between User and Tortoise.

Current Tortoise fields:

```text
TortoiseId
OwnerId
Name
AgeMonths
WeightGrams
PhotoUrl
Notes
CreatedAt
Owner
```

Completed work:

- Tortoise model and User relationship
- EF Core migration `AddTortoiseTable`
- DTOs
- Repository interface and implementation
- JWT-protected controller
- Owner-scoped CRUD
- Photo upload and replacement
- Static file serving
- Scalar Bearer authentication support
- Backend unit tests

Endpoints:

```http
GET    /api/tortoises
GET    /api/tortoises/{id}
POST   /api/tortoises
PUT    /api/tortoises/{id}
DELETE /api/tortoises/{id}
POST   /api/tortoises/{id}/photo
```

Important security rule: the frontend must never submit `OwnerId`. The backend obtains it from `ClaimTypes.NameIdentifier` and checks both the tortoise ID and owner ID for individual operations.

Images support PNG, JPEG, and WebP up to 5 MB. Files use generated GUID names and are stored under:

```text
backend/wwwroot/uploads/tortoises/{ownerId}/
```

SQLite stores only the relative URL. A normal PUT preserves `PhotoUrl`; photo replacement uses only the dedicated photo endpoint.

Last known backend test result:

```text
Total: 18
Passed: 18
Failed: 0
```

## 5. Completed My Tortoises Frontend

Created frontend layers:

```text
frontend/src/types/tortoise.ts
frontend/src/services/tortoiseService.ts
```

The service includes:

```text
getTortoises
getTortoiseById
createTortoise
updateTortoise
deleteTortoise
uploadTortoisePhoto
```

The shared API client was updated so that it does not apply JSON content type to `FormData`:

```ts
if (!(options.body instanceof FormData)) {
  headers.set("Content-Type", "application/json");
}
```

Completed UI functionality:

- Responsive My Tortoises list
- Loading skeletons
- Empty and error states
- Retry action
- Responsive tortoise cards
- Add form with validation
- Photo selection and preview
- Create-first-then-upload workflow
- Read-only detail page
- Edit form populated with existing data
- Normal edits that preserve the existing photo
- Optional photo replacement
- MUI deletion confirmation dialog
- Successful deletion Snackbar
- Failed deletion handling

Suggested routes:

```text
/tortoises
/tortoises/new
/tortoises/:tortoiseId/edit
/tortoises/:tortoiseId
```

Keep the static `new` and `edit` routes before the general dynamic detail route.

UI and styling are separated into `.tsx` and `.styles.ts` files. Components use MUI and theme values so that light/dark mode can be added later without rewriting every page.

## 6. Completed Frontend Unit Tests

Tests are separated from production code:

```text
frontend/src/test/setup.ts
frontend/tests/pages/MyTortoisesPage.test.tsx
frontend/vitest.config.ts
```

The My Tortoises test suite covers:

- Loading state
- Empty state
- Successful data display
- Tortoise count
- API error
- Retry
- Opening the delete confirmation dialog
- Cancelling deletion
- Successful deletion
- Failed deletion while preserving the tortoise

Confirmed result:

```text
Test Files  1 passed
Tests       10 passed
```

Vitest uses the following Windows-stable configuration:

```ts
pool: "threads",
maxWorkers: 1,
fileParallelism: false,
```

## 7. Current Position and Remaining Verification

There is no confirmed implementation blocker. The My Tortoises frontend unit tests pass.

The final frontend build was requested after the successful test run, but its result was not shown in the conversation. Before starting Dashboard work, run:

```powershell
cd frontend
npm test
npm run build
```

Also perform a short manual integration check with both frontend and backend running:

1. Log in.
2. Open `/tortoises`.
3. Add a tortoise with and without a photo.
4. View its details.
5. Edit text without changing the photo and confirm that the old photo remains.
6. Replace the photo.
7. Cancel deletion.
8. Confirm deletion.
9. Check the layout at mobile width.

## 8. Important Pitfalls to Avoid

### Do not rebuild completed functionality

Authentication and the My Tortoises backend are already implemented and tested. Do not recreate the model, repository, controller, JWT configuration, Scalar configuration, or upload implementation without a reproducible defect.

### Never accept OwnerId from the frontend

Ownership must always come from the authenticated JWT claim.

### Do not set multipart Content-Type manually

Do not set `multipart/form-data` yourself. The browser must generate the boundary. Do not apply `application/json` to `FormData` requests.

### Do not remove PhotoUrl during an ordinary update

Text edits use PUT and preserve the current photo. Photo changes use the separate photo endpoint.

### Avoid MUI icon barrel imports

This pattern caused Vitest to scan thousands of icon files on Windows and fail with `EMFILE: too many open files`:

```ts
import { PetsRounded } from "@mui/icons-material";
```

Use direct imports throughout the frontend:

```ts
import PetsRounded from "@mui/icons-material/PetsRounded";
```

### Follow TypeScript type-only imports

The project uses `verbatimModuleSyntax`. Types such as `ChangeEvent` and `FormEvent` must use `import type`.

### Be careful with MUI 9 typings

Some styled MUI components lose polymorphic `component` typing. Use `styled("img")` for images when necessary. Put problematic layout properties such as `alignItems`, `justifyContent`, and `fontWeight` in `sx`.

### Remember MUI Dialog accessibility behaviour

When a Dialog is open, MUI sets the background to `aria-hidden`. Component tests should close the dialog before querying background elements by accessible role.

### Preserve the Vitest worker configuration

The default forks pool timed out on Windows. Keep the threads/single-worker configuration unless there is a verified reason to change it.

### Do not commit generated or sensitive files

Keep these ignored:

```gitignore
frontend/node_modules/
frontend/dist/
frontend/coverage/
frontend/.env
frontend/.env.local
backend/bin/
backend/obj/
backend/ShellQuest.sqlite
```

## 9. Dashboard Recommended Data Design

Before writing code, inspect the existing User model, DbContext, repositories, controllers, Program.cs, App.tsx, theme, Navbar, and API client. Do not assume gamification fields already exist.

Suggested User gamification fields:

```text
TotalXp
Coins
CurrentStreak
LongestStreak
LastActiveDate
```

Prefer calculating Level from XP instead of storing both independently. A simple first rule could be:

```text
Level = TotalXp / 100 + 1
CurrentLevelXp = TotalXp % 100
XpRequiredForNextLevel = 100
```

Suggested daily task entity:

```text
DailyCareTaskId
OwnerId
TortoiseId
TaskType
TaskDate
IsCompleted
CompletedAt
XpReward
CoinReward
```

Initial task types:

```text
Feed
Bath
Clean
UVB
Temperature
```

Define a consistent date strategy before implementing streaks and today's tasks. Avoid accidental day changes caused by mixing UTC and New Zealand local dates.

Suggested achievement data:

```text
UserAchievementId
OwnerId
AchievementType
Title
Description
UnlockedAt
```

## 10. Recommended Dashboard API

Prefer one authenticated aggregate endpoint instead of many frontend requests:

```http
GET /api/dashboard
```

Example response:

```json
{
  "level": 3,
  "totalXp": 245,
  "currentLevelXp": 45,
  "xpRequiredForNextLevel": 100,
  "coins": 120,
  "currentStreak": 5,
  "todayProgress": {
    "completed": 3,
    "total": 5,
    "percentage": 60
  },
  "todayTasks": [
    {
      "taskId": 1,
      "taskType": "Feed",
      "tortoiseId": 1,
      "tortoiseName": "Mochi",
      "isCompleted": true,
      "xpReward": 10,
      "coinReward": 5
    }
  ],
  "recentAchievement": {
    "title": "Five Day Streak",
    "description": "Completed care tasks for five days.",
    "unlockedAt": "2026-07-15T10:00:00Z"
  }
}
```

The endpoint must obtain the user ID from JWT, not from query parameters or frontend data.

## 11. Recommended Dashboard Implementation Order

Work one logical step at a time and build/test after every step:

1. Inspect the current User model, DbContext, repositories, controllers, and migrations.
2. Confirm the XP, Coins, Level, and Streak calculation rules.
3. Add the required gamification fields and daily task entity.
4. Add an achievement entity or a deliberately simplified first version.
5. Configure EF Core relationships.
6. Create and apply a migration.
7. Create Dashboard response DTOs.
8. Implement Dashboard repository/service logic.
9. Implement a JWT-protected Dashboard controller.
10. Run backend build and unit tests.
11. Test the endpoint in Scalar.
12. Create frontend Dashboard types.
13. Create `dashboardService.ts` using the shared API client.
14. Create the Dashboard page and separate `.styles.ts` file.
15. Replace the Dashboard placeholder route in App.tsx.
16. Implement loading, error, success, no-task, and no-achievement states.
17. Verify desktop, tablet, and mobile layouts.
18. Add backend and frontend unit tests.
19. Run `dotnet test`, `npm test`, and `npm run build`.

## 12. Dashboard UI Direction

Suggested structure:

```text
Welcome area
  - Welcome message
  - Level badge
  - XP progress bar

Summary cards
  - Level
  - XP
  - Coins
  - Streak

Today's Tasks
  - Task list
  - Completion controls
  - XP and coin rewards

Today's Progress
  - Circular or linear progress
  - Completed / total count

Recent Achievement
  - Achievement icon
  - Title
  - Description
  - Unlock date
```

Use MUI components, responsive CSS Grid, the existing Claymorphism direction, and tortoise-inspired moss green, shell brown, and warm neutral colours. Keep layout and styles separate. Derive colours from `theme.palette` so future light/dark mode remains straightforward.

## 13. Instruction for the Next AI Session

Continue the existing ShellQuest repository. Do not create a new project and do not rewrite Authentication or My Tortoises.

The next task is to implement the Dashboard frontend and backend with Level, XP, Coins, Today's Tasks, Today's Progress, Streak, and Recent Achievement.

Before writing code, inspect the relevant existing backend and frontend files. Work one logical step at a time, provide complete code for created or replaced files, and wait for build/test results after each step.

Backend requirements:

- JWT-derived owner identity
- EF Core persistence
- DTOs and clean repository/service separation
- Aggregate `GET /api/dashboard`
- Backend unit tests
- Preserve Scalar

Frontend requirements:

- React TypeScript and MUI
- Separate `.tsx` and `.styles.ts` files
- Theme-derived colours for future light/dark mode
- Responsive tortoise-themed Claymorphism
- Shared API client and dedicated service
- Loading, error, empty, and success states
- Vitest component unit tests

