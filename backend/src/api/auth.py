from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import timedelta
from src.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_session
)
from src.models.user import User

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

@router.post("/auth/register")
def register_user(user_data: UserRegister, session: Session = Depends(get_session)):
    # Simple registration with dedicated Pydantic schema
    existing_user = session.exec(select(User).where(User.username == user_data.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Auto login after register
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
