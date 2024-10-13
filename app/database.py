from sqlalchemy import create_engine # This line is saying, "We are going to use a function to connect to our database."
from sqlalchemy.ext.declarative import declarative_base # "We’re going to create a base class to help us define the structure of our database tables  (what columns it has, what types of data, etc.).."
from sqlalchemy.orm import sessionmaker
from .config import settings

# SQLAlchemy is a tool that helps you talk to a database in Python.
# create_engine is like the key that opens the door to your database.
# The sessionmaker is something that manages conversations with the database. 
# --Imagine you’re sending requests to a store, asking for information or giving new information. 
# --The sessionmaker helps with that back-and-forth communication.

SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'
engine = create_engine(SQLALCHEMY_DATABASE_URL) # This line uses the URL from above to make a connection to the database.
# engin is powering connection between the app and the database

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#autocommit=False: This means changes won’t be saved automatically until we say "save" (commit). This gives you control over when things get saved.
#autoflush=False: This stops changes from being sent to the database automatically. This can help you avoid sending unfinished data.
#bind=engine: This tells the session which database engine (created above) to use. It's like telling it, "Use the engine we made to connect to the database."

Base = declarative_base() # This creates a base class that will be used to define your database tables. Think of it as the foundation for your blueprints.

def get_db(): #  gives you access to the database
    db = SessionLocal() # This creates a session (like starting a conversation) with the database using SessionLocal.
    try:
        yield db # "Here’s the connection to the database, use it to do what you need."
    finally:
        db.close() # hanging up the phone after the conversation is done

