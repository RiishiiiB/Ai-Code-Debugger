
from app.schemas.user import UserCreate, UserResponse
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db
from app.models.user import User
from sqlalchemy.exc import IntegrityError
router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/",
    response_model=UserResponse,
    status_code=201,
    responses={409: {"description": "Email already exists"}},
)
def create_user(user: UserCreate, db=Depends(get_db)):
    new_user = User(email=user.email)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")
        return {"error": "Email already exists"}


    return new_user