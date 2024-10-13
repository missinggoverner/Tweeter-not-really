from fastapi import FastAPI  
from .routers import post, user, auth, votes
from .database import engine
from .import models
from fastapi.middleware.cors import CORSMiddleware
#  models.Base.metadata.create_all(bind=engine) tells sqlalchemy to import all the tables in the begining

app = FastAPI() # creating the main controller of your website "Let’s make a new FastAPI app"

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# what is a router? --> is like a path that tells the app what to do when someone goes to a certain address (or URL) of the app.
# A route is like a menu item. When a customer asks for a specific dish (a specific route), the restaurant (your app) knows what to do.

app.include_router(post.router) #Let’s add the router for posts || When someone visits a certain URL (/posts), the route tells the app which function to run.
app.include_router(user.router) #Let’s add the router for user || A route could lead to a function that shows a page for adding a new post (/posts/new).
app.include_router(auth.router) #Let’s add the router for auth || A route is a mapping between a URL (/login) and a function in your code that handles what happens when someone visits that URL.
app.include_router(votes.router)