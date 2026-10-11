# IT Helpdesk client

A React, TypeScript, Vite, and Tailwind workspace for employees and IT Support.

## Run locally

From the `IT_Desk_Project` folder, start the API in `ithelpdesk-server` first. It requires MongoDB and the values in its `.env.example` file.

```powershell
cd .\ithelpdesk-server
npm install
Copy-Item .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET (and support credentials if needed).
npm run seed:departments
npm run dev
```

In a second terminal:

```powershell
cd .\ithelpdesk-client
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The development server proxies `/api` to `http://localhost:5000`. For a deployed client with an API on another origin, set `VITE_API_URL` before building. See `.env.example`.

## Checks

```powershell
npm run build
npm run lint
```

## Roles

- Employees can register, submit requests, view and edit their own tickets, and post updates. Ticket priority is set on creation and then managed by IT Support.
- IT Support can view the full queue, advance ticket status, monitor overdue requests, and view analytics and departments.

Ticket status follows `Open → In Progress → Resolved`. SLA deadlines are calculated by the API from priority.
