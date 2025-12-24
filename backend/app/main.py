from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, notes

app = FastAPI(title="Notes API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Notes API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
