# Copilot instructions for WorkspaceHub

WorkspaceHub tracks projects and tasks across organizations in an npm workspaces monorepo (`client/` and `server/`). The API uses Express, Mongoose (MongoDB), TypeScript, and JWT authentication via `requireAuth`. The frontend uses React, Vite, React Router, Tailwind CSS, Axios, and TypeScript.

## Project structure

- Derive Mongoose document types in `server/src/models/` with `InferSchemaType<typeof schema> & { _id: Types.ObjectId }`. Register models with their document type, as in `model<TaskDocument>("Task", taskSchema)`.
- Controllers extract request data and call services. Services handle business logic, database access, and permission enforcement. Follow `taskRoutes.ts`, `taskController.ts`, and `taskService.ts` for a complete example. See `server/src/app.ts` for route mounting and middleware.
- Put shared `canManage*` authorization rules in `server/src/services/permissionService.ts` and call them from services.
- Define frontend model and reusable payload types in `client/src/types/models.ts`. Derive update payloads as `Partial<CreatePayload>` from the writable create fields. Keep API calls in resource-specific files under `client/src/services/` and use `unwrapResponse`.
- Pages load data and own page state. Components receive data through props. See `client/src/pages/TasksPage.tsx` for data loading, Tailwind styles, and permission-gated UI.

## API conventions

- Protect resource routes with `requireAuth` before registering their handlers. Follow the task router's `router.use(asyncHandler(requireAuth))` pattern.
- Wrap every async controller in `asyncHandler` at route registration. It forwards rejected promises to Express's centralized error handler via `next`.
- Return successful controller responses through `sendSuccess(res, data)`. Pass an explicit status when needed, such as `201` for creation.

## Conventions

- Scope tenant-owned documents and queries by `organizationId`. The organization itself is identified by its `_id`.
- Keep frontend permission checks in `client/src/utils/permissions.ts` aligned with backend rules for UX. Enforce authorization independently on the backend.
- Derive values from data the frontend already has before adding database fields or endpoints.

## Frontend work

- Edit backend code or change existing type shapes only when explicitly requested.
- Distinguish initial loading, initial load failure, empty success, and success with results. If a later create, update, or delete fails, show the action error while keeping the loaded page usable.

## Mock and test data

- Match the frontend model exactly. Include required fields, use `_id` for record identifiers, and leave out backend-only fields such as `passwordHash`.
- Use allowed values for constrained fields, reference the correct record type for relationships, and serialize dates as strings in the format the frontend expects.

## Build and validation

- Run `npm run dev:server` and `npm run dev:client` in separate terminals.
- Run `npm run typecheck` or `npm run build` from the root to check both workspaces. Use `npm run typecheck --workspace client` or `npm run typecheck --workspace server` to check one.
- Run `npm run seed` against the demo database to replace its data. Demo accounts are `owner@workspacehub.dev`, `admin@workspacehub.dev`, and `member@workspacehub.dev`. See `server/src/scripts/seed.ts` for login details.
