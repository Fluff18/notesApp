# Notes App - Frontend

A Next.js React application for managing notes with authentication.

## Features

- **Authentication**: Signup and login pages with JWT token management
- **Notes CRUD**: Create, read, update, and delete notes
- **JWT Storage**: Tokens stored in localStorage and attached to API requests
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices
- **Testing**: Comprehensive Jest + React Testing Library tests

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Jest
- React Testing Library

## Prerequisites

- Node.js 18+ and npm

## Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # The .env.local file is already created with default values
   # Update NEXT_PUBLIC_API_URL if your backend runs on a different port
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:3000

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

## Project Structure

```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx      # Login page
│   ├── signup/
│   │   └── page.tsx      # Signup page
│   ├── notes/
│   │   └── page.tsx      # Notes dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (redirects)
│   └── globals.css       # Global styles
├── lib/
│   └── api.ts            # API client and helpers
├── __tests__/
│   ├── login.test.tsx    # Login page tests
│   ├── signup.test.tsx   # Signup page tests
│   └── notes.test.tsx    # Notes page tests
├── package.json
├── tsconfig.json
├── jest.config.js
└── next.config.js
```

## Pages

### Home (`/`)
- Redirects to `/notes` if authenticated, otherwise to `/login`

### Signup (`/signup`)
- User registration form
- Email and password validation
- Redirects to login on success
- Displays error messages on failure

### Login (`/login`)
- User authentication form
- Stores JWT token in localStorage
- Redirects to notes page on success
- Displays error messages on failure

### Notes (`/notes`)
- Displays all user's notes
- Create new notes with title and content
- Edit existing notes via modal
- Delete notes with confirmation
- Logout functionality
- Protected route (redirects to login if not authenticated)

## API Integration

The frontend communicates with the backend API through the `lib/api.ts` module:

### Authentication
- `signup(email, password)` - Register new user
- `login(email, password)` - Authenticate user
- `setToken(token)` - Store JWT in localStorage
- `clearToken()` - Remove JWT from localStorage
- `isAuthenticated()` - Check if user is logged in

### Notes
- `getNotes()` - Fetch all user notes
- `createNote(title, content)` - Create a new note
- `updateNote(id, title, content)` - Update existing note
- `deleteNote(id)` - Delete a note

All authenticated requests automatically include the JWT token in the Authorization header.

## State Management

The app uses React hooks for state management:
- `useState` - Component state
- `useEffect` - Side effects (API calls, redirects)
- `useRouter` - Next.js navigation

## Error Handling

- Network errors are caught and displayed to users
- 401 errors automatically log out the user and redirect to login
- Form validation prevents empty submissions
- Loading states prevent double submissions

## Styling

The app uses CSS modules with a custom design system:
- Responsive grid layout for notes
- Form styling with focus states
- Modal overlays for editing
- Loading and error states
- Mobile-friendly design

## Testing Strategy

Tests cover:
- Component rendering
- User interactions (form submissions, button clicks)
- API calls and responses
- Error handling
- Loading states
- Navigation and redirects

## Development

### Adding a New Page

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Export a default React component
4. The route will be automatically available

### Adding API Endpoints

1. Add the function to `lib/api.ts`
2. Use the `getAuthHeaders()` helper for authenticated requests
3. Handle errors with `handleResponse()`

### Adding Tests

1. Create a test file in `__tests__/`
2. Mock API calls with `jest.mock('@/lib/api')`
3. Mock Next.js router with `jest.mock('next/navigation')`
4. Use Testing Library utilities for user interactions

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

None at this time.

## Future Enhancements

- Note search and filtering
- Rich text editor
- Note categories/tags
- Note sharing
- Dark mode
- Markdown support
