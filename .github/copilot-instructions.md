# Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to the Personnel Finance App codebase.

## Architecture Overview

The application is a single-page application (SPA) built with React and Vite. It uses Material-UI for UI components and Appwrite as the backend for authentication, database, and real-time features.

- **Frontend**: The frontend is located in the `src` directory.

  - `main.jsx`: The entry point of the application.
  - `App.jsx`: Defines the application's routes using `react-router-dom`.
  - `pages`: Contains the main pages of the application, each corresponding to a major feature (e.g., `Dashboard`, `Accounts`, `Transactions`).
  - `components`: Contains reusable UI components.
  - `contexts`: Contains React contexts for managing global state, such as authentication (`AuthContext.jsx`).
  - `lib`: Contains the Appwrite client configuration (`appwrite.js`) and application constants (`constants.js`).
  - `theme.js`: Defines the Material-UI theme for the application.

- **Backend**: The application uses Appwrite for its backend services. The Appwrite configuration is located in `src/lib/appwrite.js` and uses environment variables for the endpoint and project ID.

## Key Concepts and Conventions

### Routing

- The application uses `react-router-dom` for routing.
- Routes are defined in `src/App.jsx`.
- Private routes are protected using the `PrivateRoute` component, which checks for an authenticated user via the `useAuth` hook from `src/contexts/AuthContext.jsx`.

### Authentication

- Authentication is handled by Appwrite.
- The `AuthContext` in `src/contexts/AuthContext.jsx` manages the user's authentication state.
- The `useAuth` hook provides access to the current user and login/logout functions.

### Data Management

- All data is stored in and retrieved from Appwrite.
- The Appwrite client is initialized in `src/lib/appwrite.js` and exported for use throughout the application.
- CRUD operations for each feature (e.g., Categories, Accounts) are typically located within their respective page components in the `src/pages` directory.

### UI and Styling

- The application uses Material-UI for its UI components.
- The global theme is defined in `src/theme.js`.
- Components should be styled using the Material-UI styling solution (e.g., `sx` prop, `styled` API).
- All Create, Edit and View page must having back button
- All Delete actions must have a confirmation step

## Development Workflow

### Running the Application

1.  Install dependencies: `npm install`
2.  Create a `.env` file from `.env.example` and add your Appwrite project credentials.
3.  Start the development server: `npm run dev`

### Creating a New Feature

When adding a new feature (e.g., "Budgets"), follow the existing structure:

1.  Create a new directory under `src/pages` (e.g., `src/pages/Budgets`).
2.  Create the main listing page component (e.g., `src/pages/Budgets/index.jsx`).
3.  Create components for Create, Edit, and other related actions within the feature's directory (e.g., `src/pages/Budgets/Create.jsx`, `src/pages/Budgets/Edit.jsx`).
4.  Add the new routes to `src/App.jsx`, ensuring they are protected by `PrivateRoute` if they require authentication.
5.  Use the Appwrite `databases` object from `src/lib/appwrite.js` to interact with the database.

## Example: Adding a "Create Category" feature

- The "Create Category" page is located at `src/pages/Categories/Create.jsx`.
- It uses Material-UI components like `TextField` and `Button`.
- On form submission, it calls the Appwrite `databases.createDocument` method to create a new category.
- The Appwrite collection ID and database ID are likely stored in `src/lib/constants.js`.

## Tech Stack

- **Material-UI**: `^7.3.2`
- **React**: `^19.0.0`
- **Vite**: `latest`
