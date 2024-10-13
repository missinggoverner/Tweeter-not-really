from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# class Config:
#         orm_mode = True ----- used when the database is sending data to our app and converting it into a Pydantic model in your app

class PostBase(BaseModel): # When user sends you information about a post you expect exactly this type of format
    title: str
    content: str
    published: bool = True #optinal

class CreatePost(PostBase): # (Inheritance) It's like saying, "I want to use the PostBase class as is" for creating a new post.
    pass


class UserOut(BaseModel): # This is what will be returned when you retrieve a user’s information
    id: int
    email: EmailStr
    created_at: datetime
    class Config:
        from_attributes = True

class Post(PostBase): 
    id: int
    created_at: datetime
    owner_id: int
    owner: UserOut 
    class Config:
        from_attributes = True# This allows the model to work with SQLAlchemy objects. It lets you convert data from the database into Pydantic models more easily.


class PostOut(BaseModel):
    Post: Post
    votes: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel): # This defines the data structure for creating a new user
    email: EmailStr
    user_name: str
    password: str
    

class userlogin(UserCreate): # This is the structure for logging a user in they need to provide the following
    pass

class Token(BaseModel): # This defines what a token looks like when it’s sent back to the user after they log in
    access_token: str # (the header(Algorithm), the payload, and the signature(the header + playload + secret key).)
    token_type:str # bearer 

class TokenData(BaseModel): # after decoding the token u compare the id from the Token with the TokenData id 
    id: Optional[str] = None

class Vote(BaseModel):
    post_id: int
    dir: int = Field(..., ge=0, le=1)

