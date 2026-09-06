from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    password_hash,
    create_access_token,
    get_current_user,
)
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    if current_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this user",
        )

    result = db.execute(
        select(User).where(User.id == user_id)
    )

    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.post(
    "/",
    response_model=UserResponse,
    status_code=201,
    responses={409: {"description": "Email already exists"}},
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    new_user = User(
        email=user.email,
        password_hash=password_hash.hash(user.password),
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Email already exists",
        )

    return new_user


@router.post("/login")
def login(
    user: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(User).where(User.email == user.username)
    )

    existing_user = result.scalar_one_or_none()

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not password_hash.verify(
        user.password,
        existing_user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(existing_user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }