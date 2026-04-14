# Theme Rules — Color & Typography

This document defines rules and best practices for using color and typography tokens from the shared MUI theme. Follow these rules to keep UI consistent, accessible, and easy to maintain.

## Summary (Direct)

- Always use theme tokens (theme.palette, theme.typography). Do not hardcode hex colors, font sizes, or font weights in components.
- Use the custom typography variants declared in the theme: `title`, `subtitle`, `header`, `regularXxs`, `regularXs`, `regularS`, `regularM`, `regularL`, `boldXs`, `boldS`, `boldM`, `boldL`.
- Use semantic color tokens (e.g., `primary`, `background.default`, `surface.card`, `success`, `error`, `neutral[...]`) rather than arbitrary color names.
- Ensure contrast: minimum 4.5:1 for normal text, 3:1 for large text.
- For hover/active states, use alpha compositing with theme palette values (e.g., `alpha(theme.palette.primary.main, 0.12)`).

---

## Why these rules

- Consistency: single source of truth for brand colors and typography.
- Accessibility: enforced contrast and focus styles improve usability.
- Maintainability: change the token in one place to update the whole app.
- Designer handoff: tokens serve as canonical tokens for Figma and development.

---

## Tokens (recommended file layout)

Place tokens under `theme/` (example files shown below). These tokens should reflect the theme augmentation used throughout the codebase.

Example: theme/colors.ts (illustrative)

```ts
export const colors = {
  primary: {
    main: "#9B5DE0",
    light: "#C77DFF",
    dark: "#7A3CC8",
    contrastText: "#FFFFFF",
  },
  success: { main: "#22C55E", contrastText: "#FFFFFF" },
  warning: { main: "#F59E0B", contrastText: "#000000" },
  error: { main: "#EF4444", contrastText: "#FFFFFF" },
  info: { main: "#3B82F6", contrastText: "#FFFFFF" },
  text: { primary: "#151426", secondary: "#6B6B78", white: "#FFFFFF" },
};
```

Example: theme/typography.ts (illustrative)

```ts
export const typography = {
  title: { fontSize: "24px", fontWeight: 600, lineHeight: 1.25 },
  header: { fontSize: "20px", fontWeight: 500, lineHeight: 1.3 },
  subtitle: { fontSize: "16px", fontWeight: 400, lineHeight: 1.4 },
  regularXxs: { fontSize: "10px", fontWeight: 400 },
  regularXs: { fontSize: "12px", fontWeight: 400 },
  regularS: { fontSize: "14px", fontWeight: 400 },
  regularM: { fontSize: "16px", fontWeight: 400 },
  regularL: { fontSize: "18px", fontWeight: 400 },
  boldXs: { fontSize: "12px", fontWeight: 700 },
  boldS: { fontSize: "14px", fontWeight: 700 },
  boldM: { fontSize: "16px", fontWeight: 700 },
  boldL: { fontSize: "18px", fontWeight: 700 },
};
```

---

## Usage examples

Do:

```tsx
import { Typography, Button } from "@mui/material";

// typography variant (preferred)
<Typography variant="title">Page Title</Typography>

// use palette token via sx or theme callback
<Button sx={{ backgroundColor: theme => theme.palette.primary.main, color: theme => theme.palette.text.white }}>
  Primary action
</Button>

// hover state using alpha()
<Button
  variant="text"
  sx={{
    "&:hover": (theme) => ({ backgroundColor: alpha(theme.palette.primary.main, 0.12) }),
  }}
>
  Hover me
</Button>
```

Don't:

```tsx
// hardcoded color or font-size — avoid this
<div style={{ color: "#9B5DE0", fontSize: "18px" }}>Wrong</div>
```

Prefer `sx`, `styled`, or component `classes` and theme usage over inline style attributes.

---

## Variant mapping and semantics

- The theme maps custom variants to semantic HTML elements (e.g., `title -> h1`, `subtitle -> h2`, `regularS -> p`). Use `variant` prop on MUI `Typography`.
- Do not use raw HTML heading tags with inline styles to mimic theme — use the MUI Typography variant mapping so accessibility semantics are preserved.

---

## Accessibility rules

- Contrast:
  - Body / normal text: contrast ratio >= 4.5:1.
  - Large text (>= 18pt bold or >= 24pt regular): contrast ratio >= 3:1.
- Focus:
  - Interactive elements (buttons, links, inputs) must expose a visible focus state (recommend using `:focus-visible`).
- Color-only:
  - Do not convey information using color alone. Provide textual, iconographic, or ARIA alternatives.

---

## Adding or extending tokens (process)

1. Pick a semantic name (e.g., `surface.card`, not `cardGrey1`).
2. Add token to `theme/colors.ts` (include `contrastText` where applicable).
3. Add a Storybook swatch story showing the new token.
4. Validate its contrast ratio against the intended background(s).
5. Add a short usage example to the theme docs.

---

## Enforcement & developer workflow

Linting

- Add / enable a lint rule to detect hex literals in JSX/TSX or inline styles. Example approaches:
  - Use an ESLint plugin or a custom rule to detect `#[0-9A-Fa-f]{3,6}` string literals in style props.
  - Restrict usage in code reviews by searching for hex patterns before merge.

PR checklist (add to PR template)

- [ ] No hardcoded colors in components — used theme tokens.
- [ ] No hardcoded font sizes or weights — used theme typography variants.
- [ ] Accessibility: color contrast verified for any new color usage.
- [ ] Storybook updated for any new or changed tokens.

---

## Responsive typography

- Use MUI `responsiveFontSizes()` if you want automatic scaling, or define variant breakpoints within theme (e.g., larger font size at `md` and up).
- When adding responsive tokens, show examples in Storybook for multiple breakpoints.

---
