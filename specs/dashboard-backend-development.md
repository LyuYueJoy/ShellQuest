# ShellQuest Dashboard Backend Development

## 1. Feature Goal

The Dashboard backend was created for the ShellQuest gamified tortoise-care application. It provides the authenticated user with:

- Level and XP progress
- Coins
- Current and longest streaks
- Today's care tasks and progress
- Recent achievement

This work supports the MSA 2026 Phase 2 requirements for a .NET 10 backend, EF Core persistence, gamification, security, API documentation, and backend unit testing.

## 2. Planning and Design Decisions

- `Level` is calculated from XP rather than stored in the database: `TotalXp / 100 + 1`.
- Each tortoise receives five daily tasks: Feed, Bath, Clean, UVB, and Temperature.
- Each completed task awards 10 XP and 5 Coins.
- Task dates use the Auckland calendar date to prevent UTC date-boundary errors.
- User identity always comes from the JWT `NameIdentifier` claim. The frontend never submits `OwnerId`.
- Unique database indexes prevent duplicate daily tasks and duplicate achievements.
- Completing a task uses a transaction so task status, rewards, streaks, and achievements are saved together.
- Repeating a completed task returns `409 Conflict` and does not award rewards again.

## 3. Database Changes

The following fields were added to `User`:

- `TotalXp`
- `Coins`
- `CurrentStreak`
- `LongestStreak`
- `LastActiveDate`

New entities:

- `DailyCareTask`
- `UserAchievement`

Migration created:

```text
AddDashboardGamification
```

The migration creates the new tables, relationships, cascade-delete rules, and unique indexes.

## 4. API Endpoints

### Dashboard

```http
GET /api/dashboard
```

Returns one aggregated response containing the user's statistics, today's tasks, progress, and most recent achievement. Missing daily tasks are generated automatically.

### Complete Care Task

```http
PATCH /api/care-tasks/{taskId}/complete
```

Completes an owner-scoped task and returns earned rewards, updated totals, streak information, and any newly unlocked achievement.

## 5. Security and Validation

- Both endpoints require JWT Bearer authentication.
- Repository queries include both the resource ID and authenticated owner ID.
- A task belonging to another user is returned as not found.
- XP and Coins cannot be claimed twice for the same task.
- Data annotations constrain reward values, text lengths, and non-negative gamification totals.
- Password hashing and existing JWT authentication were preserved rather than replaced.

## 6. AI-Assisted Development Record

AI was used as a development assistant for planning, implementation, review, and testing. Generated suggestions were checked against the existing project structure before use.

Prompts used during development included:

```text
Inspect the existing ShellQuest backend and continue from the completed My Tortoises feature. Design the Dashboard backend without rebuilding authentication or existing CRUD.
```

```text
Create EF Core models for XP, Coins, streaks, daily tortoise-care tasks, and achievements. Keep OwnerId derived from JWT and use an Auckland-safe date strategy.
```

```text
Create an authenticated aggregate GET /api/dashboard endpoint that automatically generates missing daily tasks and returns Level, XP, Coins, progress, streak, and recent achievement.
```

```text
Implement a task-completion endpoint that awards XP and Coins once, updates the streak, unlocks achievements, and prevents duplicate rewards.
```

```text
Add xUnit tests using SQLite in-memory persistence for daily task generation, duplicate prevention, user isolation, rewards, streaks, and achievements.
```

AI output was not copied blindly. The generated migration was inspected, endpoints were manually tested through Scalar, and automated tests were executed locally.

## 7. Testing Evidence

Manual Scalar verification confirmed:

- Two tortoises generated ten tasks.
- Re-requesting the Dashboard did not duplicate tasks.
- Completing one task changed progress from 0/10 to 1/10.
- The first completion awarded 10 XP and 5 Coins.
- Current streak changed from 0 to 1.
- The `FIRST_TASK` achievement was unlocked.
- A repeated completion returned `409 Conflict` without additional rewards.

Confirmed automated test result:

```text
Total: 22
Passed: 22
Failed: 0
Skipped: 0
```

Tests cover authentication, tortoise CRUD, Dashboard aggregation, daily task generation, duplicate prevention, owner isolation, task completion, rewards, streak updates, and achievement creation.

## 8. Files Added or Updated

```text
Models/User.cs
Models/Tortoise.cs
Models/DailyCareTask.cs
Models/UserAchievement.cs
Data/WebAPIDBContext.cs
DTOs/Dashboard/*
DTOs/CareTasks/CompleteCareTaskResponse.cs
Repositories/IDashboardRepository.cs
Repositories/DashboardRepository.cs
Repositories/ICareTaskRepository.cs
Repositories/CareTaskRepository.cs
Repositories/CareTaskCompletionResult.cs
Controllers/DashboardController.cs
Controllers/CareTasksController.cs
Program.cs
Migrations/*_AddDashboardGamification.cs
backend.Tests/Repositories/DashboardGamificationRepositoryTests.cs
```

## 9. Next Step

Connect the React Dashboard to `GET /api/dashboard`, add task-completion controls using the shared authenticated API client, and implement loading, error, empty, and success UI states.
