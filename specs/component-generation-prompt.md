# ShellQuest React Component Generation Prompt

## Role

You are a senior React, TypeScript, and Material UI (MUI) developer with strong UI/UX expertise in Claymorphism.

I am developing **ShellQuest**, a gamified tortoise-care community application. Create a reusable, responsive, accessible, and type-safe React component for this project.

## 1. Technology Requirements

- React
- TypeScript
- Material UI (MUI)
- MUI Icons
- React Router only when navigation is required
- Functional components and React Hooks
- Do not use `any`
- Define clear TypeScript interfaces for props, data, and events
- Do not use Tailwind CSS, Bootstrap, or another CSS framework
- Do not add dependencies that the component does not require

## 2. Separate Component Logic and Styling

Separate the component into the following files:

```text
components/
└── [ComponentName]/
    ├── [ComponentName].tsx
    └── [ComponentName].styles.ts
```

### `[ComponentName].tsx`

This file should contain only:

- JSX structure
- TypeScript interfaces
- Component props
- State management
- Event handlers
- Data mapping
- Navigation
- Business logic

Avoid large `sx={{ }}` objects in the component file. Small dynamic styles are allowed only when they depend directly on runtime data, such as progress width or status colour.

### `[ComponentName].styles.ts`

This file should contain:

- MUI `styled()` components
- Layout
- Colours
- Typography
- Spacing
- Border radii
- Shadows
- Hover, focus, and active states
- Responsive breakpoints
- Claymorphism effects

Do not place business logic in the styles file.

## 3. ShellQuest Visual Style

Use a tortoise-inspired Claymorphism design. The interface should feel warm, soft, natural, friendly, playful, and tactile.

### Colour Palette

| Purpose | Colour |
| --- | --- |
| Page background | `#E8E2CE` |
| Card background | `#F3EEDC` |
| Moss primary | `#58745A` |
| Dark forest green | `#354A38` |
| Light leaf green | `#A9C29B` |
| Tortoise-shell brown | `#A97847` |
| Coins, XP, and highlights | `#D7B85C` |
| Primary text | `#30392F` |
| Secondary text | `#687165` |

### Visual Rules

- Use large rounded corners, normally between `20px` and `32px`
- Use capsule-shaped or highly rounded buttons
- Use soft outer shadows to create elevation
- Use light and dark inner shadows to create clay-like thickness
- Avoid sharp edges and harsh borders
- Avoid glassmorphism and strong glossy highlights
- Do not apply heavy shadows to every element
- Keep data-heavy and text-heavy areas relatively flat and readable
- Reuse the global MUI theme where possible instead of redefining shared values

Recommended shadows:

```ts
export const clayShadow = `
  10px 12px 24px rgba(78, 69, 48, 0.18),
  -6px -6px 16px rgba(255, 255, 255, 0.55),
  inset 3px 3px 5px rgba(255, 255, 255, 0.45),
  inset -4px -4px 8px rgba(69, 75, 55, 0.12)
`;

export const clayPressedShadow = `
  inset 5px 5px 10px rgba(53, 74, 56, 0.22),
  inset -4px -4px 9px rgba(255, 255, 255, 0.4)
`;
```

## 4. Interaction Requirements

Interactions should imitate soft physical clay:

- On hover, raise interactive elements by approximately `2px` to `4px`
- Slightly expand or soften the shadow on hover
- On press, move the element down or slightly reduce its scale
- Reduce outer shadows and strengthen inner shadows while pressed
- Keep animations between `150ms` and `250ms`
- Provide visible hover, keyboard-focus, active, and disabled states
- Keep animation subtle enough that it does not reduce usability

## 5. Responsive Requirements

Support MUI breakpoints for:

- Mobile: `xs`
- Tablet: `sm` or `md`
- Desktop: `lg` and above

Requirements:

- Do not introduce horizontal scrolling on mobile
- Convert multi-column card layouts to a single column on small screens
- Keep controls large enough to tap comfortably
- Use MUI `Grid`, `Stack`, `Box`, and responsive breakpoints when appropriate
- Avoid unnecessary fixed widths
- Preserve image aspect ratios

## 6. Accessibility Requirements

- Add `aria-label` to icon-only buttons
- Give every form field a visible label
- Add meaningful `alt` text to images
- Do not communicate status using colour alone
- Maintain sufficient text contrast
- Make important actions keyboard-accessible
- Use semantic elements such as `nav`, `main`, `section`, and `article`
- Associate validation messages with the relevant inputs

## 7. ShellQuest Product Context

ShellQuest includes:

- Dashboard
- My Tortoises CRUD
- Daily Care Tasks
- XP, Coins, Streaks, and Achievements
- Avatar Studio
- Shop and Inventory
- Forum
- Private Chat

The component should remain consistent with tortoise care, nature, and light gamification.

## 8. Component Request

Replace the placeholders below before using this prompt.

### Component name

`[ComponentName]`

### Purpose

`[Explain what this component does.]`

### Data displayed

`[List the fields and data shown by the component.]`

### User actions

`[List actions such as view, create, edit, delete, submit, buy, or complete.]`

### Required props

`[List the props, or ask the developer to design an appropriate props interface.]`

### States to support

`[Specify loading, empty, error, disabled, completed, confirmation, or validation states.]`

### Additional requirements

`[Add any component-specific behaviour or constraints.]`

## 9. Required Output Format

Return the result in this order:

1. Recommended file structure
2. Complete `[ComponentName].styles.ts`
3. Complete `[ComponentName].tsx`
4. Parent-component usage example
5. Required installation commands, or explicitly state that no new dependency is required
6. A short explanation of responsive and accessibility behaviour

The generated code must:

- Be ready to copy and run
- Include complete imports
- Avoid pseudocode and omitted sections
- Use clear, consistent names
- Avoid duplicating styles already provided by the global MUI theme
- Split overly complex components into smaller subcomponents
- Keep component APIs reusable rather than coupling them to hard-coded sample data

## Example Request: Tortoise Card

```md
### Component name

`TortoiseCard`

### Purpose

Display one of the user's tortoises and provide detail, edit, and delete actions.

### Data displayed

- ID
- Name
- Species
- Age
- Weight
- Photo URL
- Latest care date

### User actions

- View details
- Edit
- Delete

### Required props

- `tortoise`
- `onView`
- `onEdit`
- `onDelete`

### States to support

- Display a tortoise placeholder when no photo is available
- Show a confirmation dialog before deletion
- Prevent action buttons from overflowing on mobile

### Additional requirements

- Show the tortoise name as the main heading
- Use a compact status chip for the latest care date
```
