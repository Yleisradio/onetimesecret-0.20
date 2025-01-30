# Types Organization

This directory contains TypeScript types and interfaces for the application.

## Structure

- `ui/` - UI-specific types that span multiple components
- `declarations/` - TypeScript declaration files
- `index.ts` - Type re-exports

## Conventions

### UI Types Organization

UI types are organized by feature/domain rather than by component:

```
ui/
  secret-links.ts  # Types for secret links feature
  notifications.ts # Types for notification system
  layouts.ts      # Types for layout components
```

### Type vs Interface

- Use `interface` for object shapes (default choice)
- Use `type` for unions, intersections, mapped types
- Group related types in single files
- Split files when they exceed 200-300 lines or serve different purposes

## Directory Relationships

- `src/schemas/` - Zod schemas and validation
- `src/types/` - TypeScript types and interfaces
- `src/types/ui/` - UI-specific types spanning components

### `src/schemas/`
- Zod schemas for runtime validation
- Types inferred from these schemas
- Contains:
  - Domain models
  - API request/response schemas
  - Error handling schemas
  - Validation rules

### `src/types/`
- Global TypeScript types
- Application-wide declarations
- Contains:
  - Declaration files (.d.ts)
  - Global interfaces
  - Environment types
  - Window augmentations

### `src/types/ui/`
- UI-specific types spanning components
- No runtime validation needed
- Represents:
  - Component props/emits
  - Shared component state
  - UI feature interfaces
  - Layout/display types

## Type Source of Truth

- API/Model types: Inferred from Zod schemas in `src/schemas/`
- Global types: Declared in `src/types/`
- UI types: Declared in `src/types/ui/`


### Example

```typescript
// src/types/ui/secret-links.ts
export interface SecretLink {
  id: string;
  clientInfo: {
    hasPassphrase: boolean;
    ttl: number;
    createdAt: Date;
  };
}
```

## Guidelines

- Keep types close to where they're used
- Use meaningful, feature-based file names
- Re-export commonly used types through index files
- Avoid duplicating types across directories

### When to Use
- Default to `interface` for object shapes unless specific Zod, `type` or `class` features are needed.
- When runtime validation is needed: Use Zod schemas
- When types are shared across components: Use UI types
- Avoid classes in favor of interfaces and types

Note: interfaces are open to extension while types are closed, making interfaces more flexible for future changes.
