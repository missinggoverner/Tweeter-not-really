from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base


class Post(Base): # posts-table
    __tablename__ = "posts"

    id = Column(Integer, 
                primary_key=True, 
                nullable=False)
    title = Column(String, 
                nullable=False)
    content = Column(String, 
                    nullable=False)
    published = Column(Boolean, 
                    server_default='TRUE', 
                    nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                    nullable=False, 
                    server_default=text('now()'))
    owner_id = Column(Integer, 
                    ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    

    owner = relationship(("user"))


class user(Base): # users-table
    __tablename__ = "users"
    id = Column(Integer, 
                primary_key=True, 
                nullable=False)
    user_name = Column(String,
                    nullable=False,
                    unique=True)
    email = Column(String, 
                nullable=False, 
                unique=True)
    password = Column(String, 
                    nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, 
                        server_default=text('now()'))

class Vote(Base): # votes-table: joined primary key 
    __tablename__ = "votes"
    user_id = Column(Integer, 
                    ForeignKey("users.id", ondelete="CASCADE"), 
                    primary_key=True)
    post_id = Column(Integer,
                    ForeignKey("posts.id", ondelete="CASCADE"), 
                    primary_key=True)