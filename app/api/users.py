
from app.schemas.user import UserCreate, UserResponse
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from sqlalchemy.orm import Session
router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        select(User).where(User.id == user_id)
    )

    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post(
    "/",
    response_model=UserResponse,
    status_code=201,
    responses={409: {"description": "Email already exists"}},
)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(email=user.email)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")
        


    return new_user