from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash(password: str):  #encrypting/hasing a password
    return pwd_context.hash(password)


def verify(plain_password, hashed_password): #verifying a givien password
    return pwd_context.verify(plain_password, hashed_password)
