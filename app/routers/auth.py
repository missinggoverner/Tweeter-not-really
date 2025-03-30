from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from .. import database, schemas, models, utils, oauth2
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

router = APIRouter(tags=['authentication'])

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), 
        db: Session = Depends(database.get_db)): 
    user = db.query(models.user).filter(
    models.user.user_name == user_credentials.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="invalied Credentials")
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="invalied Credentials")
    access_token = oauth2.create_access_token(data={"user_name": user.user_name})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.user_name}




