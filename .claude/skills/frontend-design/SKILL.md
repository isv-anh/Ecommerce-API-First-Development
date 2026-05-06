---
name: frontend-design
description: This skill provides frontend design capabilities, including generating design mockups, creating responsive layouts, and suggesting design improvements based on user feedback.
---

## 1. Overview

The frontend-design skill is designed to assist developers and designers in creating visually appealing and user-friendly interfaces. It can generate design mockups based on user requirements, create responsive layouts that adapt to different screen sizes, and suggest design improvements based on user feedback.

## 2. Structure frontend project

```text
packages/
├── e-commerce-front/ (frontend Next.js)
|   ├── .storybook (config for Storybook)
│   ├── public/ (static assets)
│   ├── src/
│   |   ├── app (next.js app directory)
│   |   ├── components/ (reusable UI components)
│   |   ├── features/ (feature-specific components and logic)
│   |   ├── hooks/ (custom React hooks)
│   |   ├── theme/ (theme and styling MUI configuration)
│   |   ├── utils/ (utility functions)
```

## 3. Rules

### Use the mui-mcp server to answer any MUI questions --

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question

### Theme and Styling

- 1. Use Material UI (MUI) for consistent styling and theming across the application.
- 2. Define a custom theme in the `theme/` directory to maintain a cohesive design language.

### Component Design

- 1. Create reusable UI components in the `components/` directory to promote consistency and reduce code duplication.
- 2. Follow MUI design principles and best practices when creating components.
- 3. Use Storybook for developing and showcasing UI components in isolation.

### Responsive Layouts

- 1. Ensure that all layouts are responsive and adapt to different screen sizes using MUI's Grid and Box components.
- 2. Test layouts on various devices to ensure a seamless user experience.
- 3. Use theme.breakpoints to create responsive design patterns.

### Color and Typography

- 1. Define a color palette in the custom theme to maintain visual consistency.
- 2. Use MUI's typography system to ensure consistent font usage across the application.
- 3. Ensure sufficient contrast between text and background colors for accessibility.

### Import and Usage

- 1. Prefer direct (path) imports instead of named imports to optimize bundle size.

```ts
// ✅ Recommended
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ❌ Avoid
import { Box, Button } from "@mui/material";
```

- 2. Use the `sx` prop or styled components for custom styling instead of inline styles to leverage the theme and maintain consistency.
- 3. Prefer using custom components from the project's design system instead of directly using MUI components.

### Data Fetching

- 1. Use hooks (TanStack Query) generated from `@e-commerce/api-client` for all data fetching.
- 2. Avoid direct API calls or using `fetch`/`axios` directly in components.

### Form and Validation

- 1. Use React Hook Form as the primary library for managing form state and submission.

- 2. Use Zod for schema-based validation to ensure type safety and consistency.

- 3. Always prefer reusing types and Zod schemas from `@e-commerce/api-client` to keep frontend and backend validation aligned.

- 4. Use the `customZodResolver` utility from `utils/customZodResolver.ts` to integrate Zod with React Hook Form.

- 5. Avoid writing inline validation logic inside components; validation should be defined through Zod schemas.

**Example:**

```ts
import { z } from "zod";
import { useForm } from "react-hook-form";
import { customZodResolver } from "@/utils/customZodResolver";

// Define schema (normally should come from @e-commerce/api-client)
export const postLoginBody = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer type from schema
type LoginRequest = z.infer<typeof postLoginBody>;

const { control, handleSubmit, setError } = useForm<LoginRequest>({
  defaultValues: {
    username: "",
    password: "",
  },
  mode: "onSubmit",
  resolver: customZodResolver(postLoginBody),
});
```

## Quick checklist for maintainers

- Token exists and is semantic.
- Storybook example added/updated.
- Contrast checked and documented.
- Linting rules and PR checklist updated if needed.

---

## 4. Related Documentation

- Material UI (MUI)
  - https://mui.com/material-ui/getting-started/overview/
  - https://mui.com/material-ui/customization/theming/

- Storybook
  - https://storybook.js.org/docs/react/get-started/introduction
  - https://storybook.js.org/docs/react/writing-stories/introduction
  - https://storybook.js.org/addons/@storybook/addon-a11y

- TanStack Query
  - https://tanstack.com/query/latest/docs/react/overview

- React Hook Form
  - https://react-hook-form.com/get-started

- Zod
  - https://zod.dev/

- Next.js (App Router)
  - https://nextjs.org/docs/app

- Internal Packages
  - `@e-commerce/api-client`: Generated API hooks and schemas
  - `utils/customZodResolver.ts`: Custom resolver for integrating Zod with React Hook Form

- Additional Skills
  - [Theme Guidelines](./theme/THEME.md): Guidelines for theme usage and token management.
