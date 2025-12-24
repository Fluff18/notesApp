# Notes API - Backend

FastAPI REST API for managing notes with JWT authentication.

## Tech Stack

FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT (python-jose), Bcrypt, Pytest

## Prerequisites

- Python 3.9+
- PostgreSQL (installed and running)

> **Note:** Docker support is planned but not yet implemented. Use local PostgreSQL for now.

## Quick Setup

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies (includes pytest)
pip install -r requirements.txt

# 3. Setup PostgreSQL
# Using Homebrew (macOS):
brew install postgresql@14
brew services start postgresql@14
createdb -U $USER notesapp

# Or check if PostgreSQL is already running:
psql -U $USER -d notesapp -c "SELECT 1"

# 4. Configure environment (optional)
# The app uses default PostgreSQL connection:
# postgresql://localhost/notesapp
# To customize, create .env file with DATABASE_URL

# 5. Run migrations
alembic upgrade head

# 6. Start server
uvicorn app.main:app --reload
```

## Accessing the Backend

Once the server is running, you can access:

- **API Server:** http://localhost:8000
- **Interactive API Docs (Swagger):** http://localhost:8000/docs
- **Alternative API Docs (ReDoc):** http://localhost:8000/redoc

To test the API quickly, open http://localhost:8000/docs in your browser and use the interactive interface.

## API Endpoints

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

**Notes (authenticated):**
- `POST /notes` - Create note
- `GET /notes` - Get user's notes
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

## Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest app/tests/test_auth.py
pytest app/tests/test_notes.py

# Run with coverage report
pytest --cov=app --cov-report=html
```

### Test Coverage (19 tests)

**Authentication Tests** (7 tests):
- Root endpoint and health check
- User signup (success, duplicate email handling)
- User login (success, invalid credentials, non-existent user)

**Notes API Tests** (12 tests):
- Create note (authorized & unauthorized)
- Get notes (authorized & unauthorized)  
- Update note (full & partial updates, not found, unauthorized)
- Delete note (success, not found, unauthorized)
- Note ownership verification

**All 19 backend tests passing ✅**

## Project Structure

```
backend/
├── app/
│   ├── api/           # Route handlers
│   ├── core/          # Config and security
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   └── tests/         # Pytest tests
├── alembic/           # Database migrations
└── requirements.txt   # Python dependencies
```
