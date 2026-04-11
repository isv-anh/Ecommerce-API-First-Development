# E-commerce Monorepo Development Guide

## 🧠 Overview

This project is a **multi-vendor e-commerce platform** built using a **monorepo architecture** managed by `pnpm`.

The system is designed with clear separation of concerns:

- Frontend
- Backend
- API Design
- API Client & Validation
- Database schema management

---

## 📁 Monorepo Structure

```
packages/
├── e-commerce-front # Frontend application (Next.js)
├── e-commerce-api # Backend service (NestJS)
├── openapi-typespec # API design using TypeSpec (generate OpenAPI)
├── api-client # Frontend API client (Orval: TanStack Query + Zod)
├── api-validation # Backend validation (Orval: Zod + Types)
├── e-commerce-db # Database changelog (Liquibase)
```

---

## 🧩 Tech Stack

### Frontend (`e-commerce-front`)

- Framework: Next.js
- UI: Material UI
- Form handling: React Hook Form
- Data fetching: TanStack Query (generated via Orval)
- Validation: Zod (generated)
- Testing: Vitest

---

### Backend (`e-commerce-api`)

- Framework: NestJS
- ORM: Prisma
- Validation: Zod (generated from OpenAPI)
- Testing: Jest

---

### API Design (`openapi-typespec`)

- Uses **TypeSpec** to define API contracts
- Generates:
  - `openapi.json`
- Acts as the **single source of truth** for API

---

### API Code Generation

#### Frontend (`api-client`)

- Generated using **Orval**
- Includes:
  - TanStack Query hooks
  - TypeScript types
  - Zod schemas

#### Backend (`api-validation`)

- Generated using **Orval**
- Includes:
  - Zod validation schemas
  - TypeScript types

---

### Database (`e-commerce-db`)

- Tool: Liquibase
- Purpose:
  - Manage schema changes
  - Version control database structure

---

## 🧑‍💻 Coding Conventions

### 🏷 Naming Rules

- Use **meaningful and descriptive names**
- ❌ Avoid:
  - `test1`, `data2`, `value3`
- ✅ Prefer:
  - `userList`, `productDetail`, `calculateTotalPrice`

---

### 🔤 Variable Naming

- Variables must be **nouns**
  ```ts
  const productList = [];
  const userProfile = {};
  ```
- Functions must be verbs or verb phrases
  ```ts
  function getProductById() {}
  function calculateTotalPrice() {}
  function validateUserInput() {}
  ```

### 🧱 Naming Conventions

| Type     | Convention | Example           |
| -------- | ---------- | ----------------- |
| Variable | camelCase  | `productList`     |
| Function | camelCase  | `getProductById`  |
| Constant | UPPER_CASE | `MAX_RETRY_COUNT` |

### 📚 JSDoc Requirement

- Every function must include JSDoc

  ```ts
  /**
   * Calculate total price of items in cart
   * @param items - list of cart items
   * @returns total price
   */
  function calculateTotalPrice(items: CartItem[]): number {
    // implementation
  }
  ```

## 🧪 Testing Strategy

### Frontend

- Tool: Vitest
- Focus:
  - UI logic
  - Hooks
  - Component behavior

### Backend

- Tool: Jest
- Focus:
  - Service logic
  - Integration with Prisma

## Development Workflow

1. Define API in openapi-typespec
2. Generate OpenAPI spec
3. Generate: frontend client (api-client), backend validation (api-validation)
4. Implement backend (NestJS)
5. Implement frontend (Next.js)
6. Write tests

## ⚠️ Important Rules

- Always follow naming conventions strictly
- Always include JSDoc for functions
- Prefer small, reusable functions
- Do not generate unnecessary abstraction
- Keep code consistent with existing architecture
- Use generated types and schemas whenever possible
- Do not duplicate validation logic (reuse Zod schemas)
