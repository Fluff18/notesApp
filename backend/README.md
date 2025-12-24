# Notes API - Backend

A FastAPI-based REST API for managing notes with JWT authentication.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Management**: Signup and login endpoints
- **Notes CRUD**: Create, read, update, and delete notes
- **Note Ownership**: Each user can only access their own notes
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database migrations
- **Validation**: Pydantic models for request/response validation
- **CORS**: Configured for frontend at http://localhost:3000
- **Testing**: Comprehensive pytest test suite

## Tech Stack

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT (python-jose)
- Bcrypt (passlib)
- Pydantic
- Pytest

## Prerequisites

- Python 3.10+
- Docker & Docker Compose (for PostgreSQL)

## Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and update the SECRET_KEY
   ```

5. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Notes
- `POST /notes` - Create a new note (requires auth)
- `GET /notes` - Get all notes for the authenticated user
- `PUT /notes/{id}` - Update a note (requires auth and ownership)
- `DELETE /notes/{id}` - Delete a note (requires auth and ownership)

### Health
- `GET /` - Welcome message
- `GET /health` - Health check

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest app/tests/test_auth.py
pytest app/tests/test_notes.py
```

## Database Management

### Create a new migration
```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback migration
```bash
alembic downgrade -1
```

## Project Structure

```
backend/
├── app/
│   ├── api/           # API route handlers
│   │   ├── auth.py    # Authentication endpoints
│   │   └── notes.py   # Notes CRUD endpoints
│   ├── core/          # Core functionality
│   │   ├── config.py  # Configuration
│   │   └── security.py # Security utilities (JWT, hashing)
│   ├── models/        # Database models
│   │   ├── database.py # Database connection
│   │   └── models.py   # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   │   └── schemas.py  # Request/response models
│   ├── tests/         # Test suite
│   │   ├── conftest.py # Test fixtures
│   │   ├── test_auth.py # Auth tests
│   │   └── test_notes.py # Notes tests
│   └── main.py        # FastAPI application
├── alembic/           # Database migrations
├── docker-compose.yml # PostgreSQL container
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Note ownership is enforced at the API level
- CORS is configured to only allow requests from the frontend origin
- Change the SECRET_KEY in production

## Development

To stop the PostgreSQL container:
```bash
docker-compose down
```

To view PostgreSQL logs:
```bash
docker-compose logs -f db
```

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
alembic upgrade head
```
