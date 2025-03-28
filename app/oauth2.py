from jose import JWTError, jwt # JWTError is used for catching errors related to JWT operations & jwt provides methods for encoding and decoding JWTs.
from datetime import datetime, timedelta
from . import schemas, database, models
from sqlalchemy.orm import Session
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer # OAuth2PasswordBearer is a security scheme that extracts the token from the request.
from .config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login') # specifying the URL to obtain a token 

SECRET_KEY = settings.secret_key # secret key
ALGORITHM = settings.algorithm # hashing algorithm
ACCESS_TOKEN_EXPRIRE_MINUTES = settings.access_token_expire_minutes # how long the token is valid for

def create_access_token(data: dict): # token creation
    to_encode = data.copy() # Creates a copy of the input data dictionary to avoid modifying the original.

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPRIRE_MINUTES) # Calculates the expiration time
    to_encode.update({"exp": expire}) # Adds an expiration claim (exp) to the token payload.

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # Encodes the payload into a JWT using the secret key and specified algorithm.
    return encoded_jwt


def verify_access_token(token: str, credentials_exception): # verify the validity of a JWT
    try: # loop
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # Decodes the token, verifying its signature and extracting the payload. If the token is invalid, it raises a JWTError.
        user_name = str(payload.get("user_name")) # Extracts the user_id from the decoded payload.

        if user_name is None: # Checks if the user_id is present. If not, raises the credentials exception.
            raise credentials_exception
        token_data = schemas.TokenData(user_name=user_name) # Creates a TokenData object containing the user_id.
    except JWTError:
        raise credentials_exception
    return token_data # retruns the id

def get_current_user(token: str = Depends(oauth2_scheme),
                        db: Session = Depends(database.get_db)): #  Defines a function to get the current authenticated user.
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"})
    token = verify_access_token(token, credentials_exception) 
    user = db.query(models.user).filter(models.user.user_name == token.user_name).first()
    
    
    return user