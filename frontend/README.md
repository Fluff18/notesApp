# Notes App - Frontend

Next.js React application for managing notes with authentication.

## Tech Stack

Next.js 14, React 18, TypeScript, Jest, React Testing Library

## Prerequisites

- Node.js 18+
- Backend API running at http://localhost:8000

## Quick Setup

```bash
# Install dependencies (includes Jest, Playwright, and all test dependencies)
npm install

# Start development server
npm run dev
```

App runs at http://localhost:3000

## Running Tests

**Test dependencies are included in `npm install` above.**

```bash
# Unit tests (15 tests)
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (5 tests)
npm run test:e2e

# E2E with UI mode (interactive debugging)
npm run test:e2e:ui

# E2E in headed mode (see browser actions)
npm run test:e2e:headed

# View detailed HTML test report
npm run test:report
```

## Test Coverage

### Unit Tests (15 tests) - Jest + React Testing Library
- **Login Component** (4 tests): Rendering, authentication, error handling, loading states
- **Signup Component** (4 tests): Form validation, registration flow, error handling  
- **Notes Dashboard** (7 tests): CRUD operations, authentication, error handling

### E2E Tests (5 tests) - Playwright
- Complete user journey (signup → login → notes)
- Login validation and error handling
- Protected route authentication
- Full CRUD workflow (create → read → update → delete)
- Multiple notes management

**All 20 tests passing ✅**

## Project Structure

```
frontend/
├── app/
│   ├── login/         # Login page
│   ├── signup/        # Signup page
│   ├── notes/         # Notes dashboard
│   └── globals.css    # Styles
├── lib/
│   └── api.ts         # API client
├── __tests__/         # Jest unit tests
└── e2e/               # Playwright E2E tests
```
