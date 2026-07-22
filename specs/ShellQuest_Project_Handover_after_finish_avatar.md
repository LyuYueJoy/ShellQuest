# ShellQuest Project Handover

**Last updated:** 22 July 2026  
**Audience:** A new AI conversation with no previous context  
**Project:** ShellQuest — a gamified tortoise-care web application for the 2026 MSA Phase 2 Software Assessment

## 1. What We Are Building

ShellQuest is a full-stack web application that combines tortoise care, gamification, avatar customisation, shopping, and social features.

Main planned pages:

1. Dashboard — level, XP, coins, today's tasks, progress, streak, and recent achievement.
2. My Tortoises — owner-scoped CRUD, photo, name, species, age, weight, and notes.
3. Care Tasks — daily care activities that award XP, coins, and streak progress.
4. Avatar Studio — customise a tortoise using owned shop items and save the layout.
5. Shop — browse and buy items with coins; purchased items enter inventory.
6. Forum — posts, replies, and likes.
7. Private Chat — planned SignalR real-time feature.

The UI uses a soft claymorphism style with rounded, tactile MUI components.

## 2. Technology and Architecture

### Frontend

- React 19 with TypeScript
- Vite
- Material UI and Emotion styled components
- React Router
- Vitest for tests
- JWT and user data stored in `sessionStorage`

### Backend

- ASP.NET Core Web API targeting .NET 10
- Entity Framework Core with SQLite
- JWT authentication
- BCrypt password hashing
- Repository pattern
- xUnit and Moq tests
- Scalar for API testing

### Important security rule

The backend obtains the current user ID from JWT claims. The frontend must not send or decide `OwnerId` for protected resources.

## 3. Work Completed

### Authentication and navigation

- Registration and login endpoints are implemented.
- Passwords are hashed with BCrypt.
- Login returns a JWT and user information.
- The navbar changes from Login/Register to Logout after authentication.
- Protected page behaviour and guest handling were designed.

### My Tortoises

- Backend owner-scoped CRUD endpoints are implemented.
- Tortoise photo upload is implemented.
- Frontend list, add, view/edit, and delete flows are implemented.
- Loading, empty, error, retry, and delete confirmation states exist.
- Ten frontend list-page tests previously passed.
- Backend tests previously passed.

### Dashboard

- Dashboard frontend and backend development documentation exists.
- The intended data includes level, XP, coins, today's tasks, progress, streak, and recent achievement.
- Before claiming this feature is finished, inspect the current repository and rerun its tests/build; the latest conversation focused on Avatar Studio rather than Dashboard verification.

### Shop and Avatar Studio

The Avatar feature now uses a persisted backend model rather than a frontend-only mock.

Implemented behaviour includes:

- Select one of the user's tortoises.
- Load its original photo and saved avatar configuration.
- Load purchased inventory items.
- Equip and remove items.
- Drag, resize, and rotate movable accessories.
- Preserve `x`, `y`, `scale`, `rotation`, and `zIndex`.
- Save changes through the backend.
- Display saved accessories on the My Tortoises cards.
- Fall back to the ordinary tortoise photo if loading one avatar fails.

Separate supporting evidence already exists in:

```text
Avatar_Studio_AI_Development_Evidence.md
```

## 4. Latest Progress and Exact Current State

The most recent work fixed two visual problems.

### A. Coordinate mismatch

Avatar Studio uses a square canvas, but My Tortoises cards use a rectangular photo frame. Applying the saved percentage coordinates directly to the rectangle caused accessories to move.

The solution is to place the photo and accessories inside a centred square `AvatarPreviewStage` within the rectangular card. Both screens must use the same internal photo inset (`8%`) and the same coordinate formula:

```tsx
left: `${item.x * 100}%`
top: `${item.y * 100}%`
width: `${item.scale * 40}%`
transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
```

### B. Peaceful Garden covered the tortoise

`Peaceful Garden` is a background, but it was rendered as a normal draggable accessory. It therefore appeared above the tortoise.

Avatar Studio has now been changed successfully to render layers in this order:

1. `Peaceful Garden` background — `zIndex: 0`
2. Tortoise photo — `zIndex: 10`
3. Hats, shells, and other accessories — `zIndex: 20 + item.zIndex`

The actual tortoise photo field in Avatar Studio is:

```tsx
avatar.tortoisePhotoUrl
```

and it uses the existing `getPhotoUrl()` helper. Do not invent a separate `photoUrl` variable unless the file is intentionally refactored.

### C. My Tortoises background preview

The equivalent My Tortoises change was explained and code was supplied. Required styles are:

- `AvatarPreviewStage` — centred square stage with `overflow: hidden`
- `AvatarBackground` — full-stage background at `zIndex: 0`
- `TortoiseImage` — `8%` inset at `zIndex: 10`
- `AvatarAsset` — accessories at `zIndex: 20 + item.zIndex`
- `PhotoLabel` — `zIndex: 100`

The card must filter `Peaceful Garden` out of the normal accessory list and render it first as `AvatarBackground`.

**Important verification status:** Avatar Studio was reported as working. The My Tortoises code change was provided, but the conversation ended before a successful local build and visual comparison were reported. Treat that verification as the immediate outstanding task.

## 5. Immediate Next Steps

### Step 1 — verify the latest My Tortoises changes

1. Inspect `MyTortoisesPage.tsx` and `MyTortoisesPage.styles.ts`.
2. Confirm `AvatarBackground` is imported and rendered.
3. Confirm `Peaceful Garden` is excluded from normal accessories.
4. Run:

```powershell
npm run build
```

5. Open Avatar Studio and My Tortoises side by side.
6. Confirm background, tortoise, hat/shell position, scale, and rotation match.
7. Test a tortoise with no photo, no avatar, and no background.

### Step 2 — replace the hard-coded background check

The temporary implementation checks:

```tsx
item.name === "Peaceful Garden"
```

The better design is to return an item category/type in the avatar API and check:

```tsx
item.category === "Background"
```

This supports future backgrounds without changing frontend code.

### Step 3 — add Avatar tests

Add focused tests for:

- Loading an existing saved avatar.
- Equipping and removing an owned item.
- Saving transforms.
- Background rendered below the tortoise.
- My Tortoises cards rendering saved items.
- One failed avatar request not breaking the whole list.
- Ownership/authorization on avatar endpoints.

### Step 4 — continue remaining product work

After Avatar verification, prioritise incomplete assessment-critical work:

1. Recheck Dashboard end-to-end.
2. Complete Care Tasks and gamification integration.
3. Verify Shop purchase/inventory/coin rules.
4. Implement or finish Forum.
5. Add SignalR Private Chat if still required as an advanced feature.
6. Complete tests, deployment, README, and `/specs` evidence.

## 6. Lessons and Pitfalls to Remember

### Do not mix coordinate systems

Saved percentage coordinates only reproduce correctly when the editor and preview use the same aspect ratio and image inset. Use a square stage everywhere the avatar is rendered.

### Backgrounds are not normal equipment

Backgrounds must fill the stage, remain non-interactive, and render below the tortoise. Do not give them drag/resize handles.

### Do not guess response field names

An earlier suggestion used a nonexistent `photoUrl`. The real Avatar Studio response uses `avatar.tortoisePhotoUrl`. Always inspect TypeScript types and service responses before proposing code.

### Render order and `zIndex` both matter

Use a stable layer contract:

```text
Background 0 → Tortoise 10 → Accessories 20+ → UI labels/handles 100+
```

### One failed avatar request should not break the tortoise list

Load tortoises first, then load avatar previews in parallel. Handle failures per tortoise and fall back to the ordinary photo.

### Preserve backend ownership rules

Never trust a user ID supplied by the client. Resolve ownership from JWT claims and ensure every tortoise/avatar operation is scoped to that user.

### MUI styled-component typing can be strict

Styled wrappers around `Box`, `Card`, or `ListItemButton` may not preserve polymorphic `component` props. Avoid forcing unsupported props; use semantic wrappers or the original MUI component directly.

### TypeScript requires type-only imports where configured

Use `import type` for types such as `ChangeEvent` and `FormEvent` when strict compiler settings require it.

### Do not claim unverified tests

Record a feature as implemented only after rerunning the relevant build/tests in the current repository. Separate previous passing evidence from new, unverified edits.

## 7. AI-Assisted Development Evidence

The `/specs` folder must demonstrate the development process, not merely contain final code. Preserve:

- Planning and design decisions.
- Actual prompts used during development.
- Agent instructions and project context/configuration.
- AI suggestions that were accepted, rejected, or corrected.
- Test commands and outcomes.
- Known limitations and next steps.

Examples of actual development prompts from this feature include:

```text
Implement Avatar Studio so the user can select a tortoise, equip purchased shop items, drag, resize, rotate, save the avatar, and restore the saved layout.
```

```text
Show the saved Avatar Studio equipment on each My Tortoises card without breaking the existing loading, empty, retry, and delete behaviour.
```

```text
The equipment position is offset on My Tortoises. Make the preview use the same coordinate system as Avatar Studio.
```

```text
Peaceful Garden is a Background item, but it covers the tortoise. Render it as a fixed background below the tortoise and keep other equipment above it.
```

```text
Give me the complete AvatarCanvas using the existing avatar.tortoisePhotoUrl field and the current drag, resize, and rotate handlers.
```

Human review corrected two important AI assumptions:

1. The photo field was not `photoUrl`; it was `avatar.tortoisePhotoUrl`.
2. Applying avatar coordinates directly to a rectangular card could not reproduce the square editor layout.

These corrections are useful assessment evidence because they show that AI output was reviewed rather than copied blindly.

## 8. Recommended Context for the Next Conversation

Provide the next AI assistant with these files before asking it to edit code:

```text
frontend/src/pages/AvatarStudioPage/AvatarStudioPage.tsx
frontend/src/pages/AvatarStudioPage/AvatarStudioPage.styles.ts
frontend/src/pages/MyTortoisesPage/MyTortoisesPage.tsx
frontend/src/pages/MyTortoisesPage/MyTortoisesPage.styles.ts
frontend/src/services/avatarService.ts
frontend/src/services/tortoiseService.ts
Relevant avatar DTOs, controller, repository, models, and migrations
Avatar_Studio_AI_Development_Evidence.md
```

Ask it to inspect the real files and types before producing replacement code.

## 9. Suggested First Prompt for the New Conversation

```text
We are continuing the ShellQuest project. Read the attached handover and inspect the actual files before changing anything. The immediate task is to verify and finish the My Tortoises avatar preview so it matches Avatar Studio exactly. Peaceful Garden must be a fixed background below the tortoise, other equipment must remain above it, and both pages must use the same square coordinate system and 8% photo inset. Preserve all existing list loading, error, retry, empty, and delete behaviour. Then run the frontend build and relevant tests, report the exact results, and update the /specs AI-development evidence with the prompt, decisions, corrections, and verification.
```

## 10. Definition of Done for the Immediate Task

- The frontend build passes.
- Avatar Studio still supports select, equip/remove, drag, resize, rotate, and save.
- Peaceful Garden stays behind the tortoise on both pages.
- Other accessories stay above the tortoise.
- Saved transforms appear in the same location on both pages.
- Empty/no-photo/no-avatar states still work.
- A failed avatar preview request does not fail the whole My Tortoises page.
- Relevant tests pass.
- The `/specs` evidence records the prompt, design choice, human corrections, and test output.
