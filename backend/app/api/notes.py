from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.models.database import get_db
from app.models.models import User, Note
from app.schemas.schemas import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter(prefix="/notes", tags=["notes"])
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = Note(**note.model_dump(), user_id=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("", response_model=List[NoteResponse])
def get_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(Note).filter(Note.user_id == current_user.id).all()
    return notes


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    
    if db_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Enforce note ownership
    if db_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this note"
        )
    
    # Update note fields
    update_data = note.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_note, field, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    
    if db_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Enforce note ownership
    if db_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this note"
        )
    
    db.delete(db_note)
    db.commit()
    return None
