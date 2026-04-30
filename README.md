# TrueBalance

TrueBalance is a personal finance dashboard built with Next.js, MongoDB, and Tailwind CSS. It helps track transactions, manage monthly budgets, and visualize spending patterns in one place.

## Features

- Dashboard with total expenses, monthly spend, top category, and transaction counts
- Budget management with add, edit, and delete flows
- Transaction management with full CRUD support
- Visual breakdowns for monthly spending, category spend, and budget vs actual analysis
- Recent transaction view for quick review
- Loading and error states for database-backed data fetching

## Tech Stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- MongoDB for persistence
- Tailwind CSS for styling
- Recharts and Lottie animations for data and visual polish

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database

### Environment Variables

Create a local environment file and set your MongoDB connection string:

```bash
MONGODB_URI=your_mongodb_connection_string
```

An example file is included as [`.env.example`](.env.example).

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production build
- `npm run lint` - run lint checks

## Project Structure

- [src/app](src/app) - app routes, pages, and API routes
- [src/components](src/components) - reusable UI and dashboard components
- [src/lib](src/lib) - MongoDB connection and data models
- [src/types](src/types) - shared TypeScript types

## Notes

- Git ignores local secrets, build output, and dependency folders through [`.gitignore`](.gitignore).
- If the app cannot connect to MongoDB, check that `MONGODB_URI` is present in your local `.env.local` file.
