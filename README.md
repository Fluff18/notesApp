# Notes App

A full-stack monorepo application for managing notes with authentication. Built with FastAPI (Python) backend and Next.js (React/TypeScript) frontend.

## Features

### Backend
- **REST API** with FastAPI
- **Authentication** using JWT tokens and bcrypt password hashing
- **Database** PostgreSQL with SQLAlchemy ORM
- **Migrations** with Alembic
- **CORS** configured for frontend communication
- **Note Ownership** enforcement at API level
- **Comprehensive Tests** with pytest

### Frontend
- **Modern UI** built with Next.js 14 and React 18
- **TypeScript** for type safety
- **Authentication** pages (signup/login)
- **Notes Dashboard** with full CRUD operations
- **JWT Management** in localStorage
- **Loading & Error States** for better UX
- **Comprehensive Tests** with Jest and React Testing Library

## Project Structure

```
notesApp/
├── backend/           # Python FastAPI backend
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── core/     # Config and security
│   │   ├── models/   # Database models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── tests/    # Pytest tests
│   ├── alembic/      # Database migrations
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── README.md
│
├── frontend/         # Next.js React frontend
│   ├── app/          # Pages and layouts
│   ├── lib/          # API client
│   ├── __tests__/    # Jest tests
│   ├── package.json
│   └── README.md
│
└── README.md         # This file
```

## Prerequisites

- **Backend:**
  - Python 3.10+
  - Docker & Docker Compose (for PostgreSQL)

- **Frontend:**
  - Node.js 18+
  - npm

## Quick Start

### 1. Start the Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env and update SECRET_KEY for production

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at http://localhost:8000

### 2. Start the Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be running at http://localhost:3000

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Notes (require authentication)
- `POST /notes` - Create a new note
- `GET /notes` - Get all notes for the authenticated user
- `PUT /notes/{id}` - Update a note (owner only)
- `DELETE /notes/{id}` - Delete a note (owner only)

## Running Tests

### Backend Tests
```bash
cd backend
source venv/bin/activate
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- Alembic - Database migration tool
- PostgreSQL - Relational database
- Pydantic - Data validation
- python-jose - JWT tokens
- passlib - Password hashing
- pytest - Testing framework

### Frontend
- Next.js 14 - React framework
- React 18 - UI library
- TypeScript - Type safety
- Jest - Testing framework
- React Testing Library - Component testing

## Security Features

- Passwords hashed with bcrypt
- JWT-based authentication
- CORS protection
- Note ownership enforcement
- SQL injection protection via SQLAlchemy
- Input validation with Pydantic

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Management
```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://notesapp:notesapp123@localhost:5432/notesapp
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Production Deployment

### Backend
1. Update SECRET_KEY in .env
2. Set up production PostgreSQL database
3. Update DATABASE_URL
4. Run migrations: `alembic upgrade head`
5. Use a production ASGI server (e.g., gunicorn with uvicorn workers)

### Frontend
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Or deploy to Vercel/Netlify

## Troubleshooting

### Backend Issues
- **Database connection error**: Ensure PostgreSQL is running (`docker-compose up -d`)
- **Migration errors**: Check database credentials in .env
- **Import errors**: Ensure virtual environment is activated

### Frontend Issues
- **API connection error**: Verify backend is running on port 8000
- **Build errors**: Clear `.next` directory and rebuild
- **Test failures**: Ensure all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is for educational purposes.

## Support

For issues and questions, please open an issue on GitHub.
