# ShellQuest Avatar Studio — Planning, Design and AI-Assisted Development Evidence

**Project:** ShellQuest — Gamified Tortoise Care Platform  
**Feature:** Avatar Studio  
**Purpose:** Evidence for the MSA 2026 Phase 2 `/specs` folder  
**Last updated:** 22 July 2026

## 1. Feature Overview

Avatar Studio allows an authenticated user to select one of their tortoises, use its uploaded photo as the avatar base, equip owned cosmetic items, adjust each accessory, and save the composition. The saved avatar is also rendered on the **My Tortoises** page.

The feature supports ShellQuest's gamification theme by turning care rewards and shop purchases into visible personalisation. Coins earned through care tasks can be spent on avatar items, giving users a clear reward loop.

## 2. Goals and Acceptance Criteria

- Use the selected tortoise photo as the base image.
- Display only items available to the user through their inventory.
- Equip and remove avatar items.
- Allow movable accessories to be dragged, resized, and rotated.
- Save `x`, `y`, `scale`, `rotation`, and `zIndex` values through the backend.
- Render saved equipment consistently in Avatar Studio and My Tortoises.
- Treat background items differently from movable accessories.
- Keep the interface responsive and consistent with ShellQuest's claymorphism design.
- Require authentication and prevent users from editing another user's avatar.

## 3. Design Decisions

### 3.1 Shared normalised coordinate system

Accessory positions are stored as normalised values rather than screen pixels:

- `x` and `y`: relative position from `0` to `1`.
- `scale`: relative item size.
- `rotation`: angle in degrees.
- `zIndex`: stacking order.

This allows the same saved composition to be rendered on different screen sizes. Avatar Studio and the card preview use the same square stage, the same `8%` photo inset, and the same item width calculation (`scale * 40%`).

### 3.2 Explicit layer model

The visual stacking order is:

1. Background item (`z-index: 0`)
2. Tortoise photo (`z-index: 10`)
3. Hats, shells, and other accessories (`z-index: 20 + saved zIndex`)
4. UI labels and controls (`z-index: 100`)

`Peaceful Garden` originally covered the tortoise because every equipped item was rendered with the same movable-item component. It is now rendered as a full-canvas background with `object-fit: cover` and no pointer interaction.

The current implementation identifies this background by item name. A future improvement is to use a persistent item category such as `category === "Background"`, avoiding hard-coded product names.

### 3.3 Failure isolation

The My Tortoises page loads tortoises first and then loads saved avatars. If one avatar request fails, the card falls back to the normal tortoise photo rather than failing the entire page.

### 3.4 Accessibility and interaction

Movable items use a focusable element with an accessible label. Rotate and resize handles use buttons and descriptive `aria-label` values. Decorative preview assets use empty alternative text and `aria-hidden` where appropriate.

## 4. Technical Context and Configuration

### Frontend

- React 19 with TypeScript
- Vite
- Material UI and Emotion styled components
- React Router
- Vitest for frontend unit tests
- JWT stored in `sessionStorage` and sent with protected API requests

### Backend

- ASP.NET Core Web API on .NET 10
- Entity Framework Core with SQLite
- JWT authentication and owner-based authorisation
- Scalar API documentation
- Repository/service separation used elsewhere in ShellQuest

### Relevant data shape

An equipped item requires fields equivalent to:

```ts
type AvatarEquippedItem = {
  avatarEquippedItemId: number;
  name: string;
  assetUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};
```

The avatar response also provides the selected tortoise identity, `tortoisePhotoUrl`, and the equipped item collection. The server must derive the user identity from JWT claims rather than accepting an owner ID supplied by the client.

## 5. Implementation Summary

### Completed

- Tortoise selection and use of the stored tortoise photo.
- Loading of saved equipped items.
- Drag, resize, rotate, select, and layer positioning for accessories.
- Saving the avatar composition.
- Rendering saved avatar items on My Tortoises cards.
- Shared square preview stage to prevent coordinate drift between pages.
- Background → tortoise → accessory layer separation.
- Graceful fallback to the original photo if avatar preview loading fails.

### Key rendering rule

```tsx
const backgrounds = avatar.equippedItems.filter(
  (item) => item.name === "Peaceful Garden",
);

const accessories = avatar.equippedItems
  .filter((item) => item.name !== "Peaceful Garden")
  .sort((a, b) => a.zIndex - b.zIndex);
```

Backgrounds render first, followed by `avatar.tortoisePhotoUrl`, then movable accessories. Both Avatar Studio and My Tortoises must follow this same rule.

## 6. AI-Assisted Development Record

AI was used as a development assistant for planning, TypeScript/MUI implementation, debugging, integration design, and documentation. The developer supplied the current code, error messages, field names, and desired behaviour; reviewed suggested changes; ran the application; reported visual defects; and iterated on the result. AI output was not accepted blindly.

### Prompt 1 — Plan the feature

```text
I want to implement Avatar Studio for ShellQuest. The user selects a tortoise photo, equips hats, shells and backgrounds from inventory, can drag, resize and rotate items, and saves the result. Please design the React TypeScript frontend, ASP.NET Core backend, EF Core models, API endpoints and implementation order. Keep the claymorphism MUI style and JWT ownership rules.
```

**How it helped:** Produced the initial feature breakdown, persistent item transformation model, API responsibilities, and staged implementation plan.

### Prompt 2 — Connect the saved avatar to My Tortoises

```text
Update MyTortoisesPage so every tortoise card displays the avatar equipment saved in Avatar Studio. Keep the existing loading, empty, retry and delete behaviour. If one avatar request fails, show the original tortoise photo instead of failing the page. Reuse x, y, scale, rotation and zIndex.
```

**How it helped:** Led to background avatar loading per tortoise and failure isolation for individual cards.

### Prompt 3 — Diagnose preview position drift

```text
The equipment position on My Tortoises is offset from Avatar Studio. Avatar Studio uses a square canvas, but the tortoise card photo frame is rectangular. How should I make both previews use the same coordinates?
```

**How it helped:** Identified the mismatched aspect ratio and introduced a centred square `AvatarPreviewStage` with matching photo inset and scaling rules.

### Prompt 4 — Fix a background covering the tortoise

```text
Peaceful Garden is a Background item, but it covers the tortoise. How can I make it a real background while keeping hats and shells movable above the tortoise?
```

**How it helped:** Established the explicit background, tortoise, accessory, and UI layer ordering.

### Prompt 5 — Adapt the fix to the real code

```text
My current AvatarCanvas maps every equipped item to EquippedItem and uses avatar.tortoisePhotoUrl with getPhotoUrl(). Give me the complete AvatarCanvas using my actual field names and keep the existing drag, resize and rotate handlers.
```

**How it helped:** Prevented the introduction of a nonexistent `photoUrl` variable and preserved the existing pointer interaction handlers.

### Prompt 6 — Apply the same background rule to the card preview

```text
Avatar Studio is fixed. How should MyTortoisesPage.styles.ts and the complete PhotoFrame be changed so Peaceful Garden is behind the tortoise and all saved accessories remain aligned with Avatar Studio?
```

**How it helped:** Reused the same square coordinate system and layer contract in the list-page preview.

## 7. Human Review and Corrections

The developer validated AI suggestions against the running application and corrected several assumptions:

- The first suggestion referenced `photoUrl`, but the real response field was `avatar.tortoisePhotoUrl`; the code was revised to use the existing `getPhotoUrl()` helper.
- A simple `zIndex` change was insufficient because the background was still treated as a movable accessory; rendering was split by item type/name.
- The preview initially showed position drift because the editor used a square canvas while the list card used a rectangular coordinate space; both now share a square inner stage.
- The My Tortoises page retained its existing loading, empty state, retry, deletion, and fallback behaviour instead of being rewritten around Avatar Studio.

These iterations demonstrate critical evaluation of generated code and adaptation to the actual project rather than direct copy-and-paste use.

## 8. Testing and Verification

### Manual checks completed during development

- Select a tortoise with an uploaded photo.
- Equip an accessory and confirm it appears above the tortoise.
- Drag, resize, and rotate an accessory.
- Save, reload, and confirm transformations persist.
- Equip Peaceful Garden and confirm it fills the canvas behind the tortoise.
- Open My Tortoises and compare item position, scale, and rotation with Avatar Studio.
- Confirm a failed avatar request still shows the original tortoise card.
- Run the frontend production build after TypeScript/style changes.

### Unit/integration tests to retain or add

- Loading and error states for Avatar Studio.
- Loading a saved avatar response.
- Saving updated transform values.
- Background items render below the photo and are not movable.
- Accessories render above the photo in `zIndex` order.
- My Tortoises falls back when one avatar request fails.
- Backend rejects unauthenticated requests.
- Backend prevents access to another user's avatar.
- Backend validates transform ranges and rejects invalid item ownership.

Only tests actually present and passing in the repository should be claimed as completed in the final README or presentation.

## 9. Problems Encountered and Lessons Learned

- **Do not use pixels for persistent positions.** Pixel coordinates break on responsive layouts.
- **Do not render editor and preview with different aspect ratios.** A shared coordinate space is required.
- **Do not treat backgrounds as ordinary draggable accessories.** They require a dedicated rendering path.
- **Do not guess API property names.** Confirm the real response model before adding frontend variables.
- **Do not let one optional avatar request fail the main tortoise list.** Use per-card fallback behaviour.
- **Do not rely permanently on `item.name === "Peaceful Garden"`.** Introduce a category/type field when the model is next revised.
- **Do not trust client-supplied ownership data.** Resolve the current user from JWT claims and verify inventory ownership on the server.

## 10. Recommended Next Steps

1. Add an `itemType` or `category` field (`Background`, `Hat`, `Shell`, `Accessory`) to the shop/avatar data model.
2. Replace the hard-coded Peaceful Garden name check with the category field.
3. Extract a shared avatar renderer so Avatar Studio and My Tortoises cannot diverge.
4. Add automated frontend tests for layer order and save behaviour.
5. Add backend tests for authorisation, inventory ownership, and transform validation.
6. Document the Avatar Studio demo flow in the README and six-minute assessment video.

## 11. Suggested Repository Placement

Save this file as:

```text
/specs/avatar-studio-ai-development.md
```

Related evidence can be separated later if required:

```text
/specs/avatar-studio-plan.md
/specs/avatar-studio-prompts.md
/specs/agent-instructions.md
/specs/project-context.md
```

This document intentionally combines those categories into one concise submission-ready record while preserving the actual prompts and development decisions.

## 12. Suggested Git Commit

```text
docs: add Avatar Studio AI development evidence
```

