This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Overview

A Next.js project that provides a dashboard for managing todos with authentication using Clerk, database operations through Prisma, and API requests handled via Axios.

Features

User Authentication with Clerk

CRUD Operations for Todos

Debounced Search for better performance

Pagination for managing large datasets

Subscription Handling to check user subscription status

Svix Webhooks Integration for real-time updates

Technologies Used

Next.js (React Framework)

TypeScript (for type safety)

Prisma (Database ORM)

Clerk (Authentication)

Svix (Webhooks for real-time events)

Axios (for API requests)

React Hooks (useState, useEffect, useCallback)

usehooks-ts (Debounce effect for search)

API Endpoints

Todos

GET /api/todos?page={number}&search={query} → Fetch paginated todos

POST /api/todos → Add a new todo

PUT /api/todos/{id} → Update a todo

DELETE /api/todos/{id} → Delete a todo

Subscription

GET /api/subscription → Fetch user subscription status

Webhooks (Svix)

Handles real-time events via webhooks

How It Works

Users authenticate via Clerk.

Todos are fetched and stored using Axios.

Search functionality with debounce optimizes performance.

Pagination manages large lists.

Users can add, update, and delete todos.

Subscription status is checked before certain actions.

Webhooks (Svix) handle real-time updates when changes occur.

Contributing

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
