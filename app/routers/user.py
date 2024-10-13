from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.user(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get('/{id}', response_model=schemas.UserOut) 
def get_user(id: int, db: Session = Depends(get_db)):
    userid = db.query(models.user).filter(models.user.id == id).first()
    if userid == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={'message': f'id {id} not found'})
    return userid

