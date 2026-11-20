# WorkspaceHub

WorkspaceHub is a workspace for organizations to manage projects, assign tasks, and coordinate bookings. Each organization has its own data and role-based permissions.

[Open the live WorkspaceHub app](https://ai-se-project-workspacehub-bk4p-git-workspacehub-part-2-narrow5.vercel.app/).

## Features

- Track projects, task counts, assignments, priorities, and due dates.
- Open collapsible task discussions with comment counts and on-demand loading. Authors can edit and delete their own comments, and organization owners and admins can manage all comments in their organization.
- Schedule bookings with overlap checks and configure features per organization.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS
- Node.js + Express + TypeScript
- MongoDB Atlas in the deployed app, with Mongoose on the server
- JWT authentication
- Context API for client state
- Vercel for the Vite frontend and Express API

## Project Structure

```text
workspacehub/
  client/
  server/
```

## Setup

1. Install dependencies from the repository root.

   ```bash
   npm install
   ```

2. Copy the environment examples and fill them in using the table below.

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Start MongoDB locally or point `MONGODB_URI` at an existing instance.

4. Seed demo data. This replaces existing WorkspaceHub data in the configured database, so use a local demo database.

   ```bash
   npm run seed
   ```

5. Run the server and client in separate terminals, then open http://localhost:5173.

   ```bash
   npm run dev:server
   npm run dev:client
   ```

## Environment variables

| File          | Variable        | Purpose and local value                                                                 |
| ------------- | --------------- | --------------------------------------------------------------------------------------- |
| `server/.env` | `PORT`          | Express port, typically `5001` locally.                                                 |
| `server/.env` | `MONGODB_URI`   | Database connection URI, such as `mongodb://127.0.0.1:27017/workspacehub`.              |
| `server/.env` | `JWT_SECRET`    | Signs login tokens. Use a locally generated secret and store deployed values in Vercel. |
| `server/.env` | `CLIENT_ORIGIN` | Allowed frontend origin, typically `http://localhost:5173`.                             |
| `client/.env` | `VITE_API_URL`  | API origin without the `/api` suffix, typically `http://localhost:5001`.                |

## Demo Users

The seed script creates one organization with these users:

- `owner@workspacehub.dev` / `Password123!`
- `admin@workspacehub.dev` / `Password123!`
- `member@workspacehub.dev` / `Password123!`

## Scripts

- `npm run dev:server`
- `npm run dev:client`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run test --workspace client`
- `npm run seed`

## Notes

- All protected API responses follow the same JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

- The booking overlap rule is isolated in the booking service.
- Feature-flag checks are isolated in a reusable middleware/service path.
- Permission logic is centralized in auth and permission helpers.
