from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, 
                db: Session = Depends(get_db)):
    
    existing_user = db.query(models.user).filter(models.user.user_name == user.user_name).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Username already exists")
    
    if user.password != user.conform_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password and confirm password do not match")

    
    hashed_password = utils.hash(user.password)  # Hash the password here

    # Manually create the new_user_data dictionary, now including the hashed password
    new_user_data = {
        "email": user.email,
        "user_name": user.user_name,
        "password": hashed_password  # Add the hashed password to the data
    }

    # Create new user
    new_user = models.user(**new_user_data)  # Pass the correct user data
    db.add(new_user)  # Add the new user to the database session
    db.commit()  # Commit the transaction to persist changes
    db.refresh(new_user)  # Refresh to get the latest state of the new user
    
    return new_user  # Return the newly created user


@router.get('/{id}', response_model=schemas.UserOut) 
def get_user(id: int, db: Session = Depends(get_db)):
    userid = db.query(models.user).filter(models.user.id == id).first()
    if userid == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={'message': f'id {id} not found'})
    return userid

