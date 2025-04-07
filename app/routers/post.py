from fastapi import Response, status, HTTPException, Depends, APIRouter
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

# @router.get("/", response_model=List[schemas.Post])
@router.get("/", response_model=List[schemas.PostOut]) 
def Get_posts(db: Session = Depends(get_db),
                limit: int = 10, skip: int = 0, search: Optional[str] = ""): # Query Parameters
    # posts = db.query(models.Post).filter(models.Post.title.contains(search)).limit(limit).offset(skip).all()
    results = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).order_by(models.Post.created_at.desc()).filter(
            models.Post.title.contains(search)).limit(limit).offset(skip).all()
    return results


@router.get("/mine", response_model=List[schemas.PostOut]) 
def Get_my_posts(db: Session = Depends(get_db),
                current_user: int = Depends(oauth2.get_current_user)): 
    posts = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(
        models.Post.id).order_by(models.Post.created_at.desc()).filter(models.Post.user_name == current_user.user_name).all()
    
    return posts

@router.get("/{id}", response_model=schemas.PostOut)
def Get_post(id: int, db: Session = Depends(get_db)): #to get individual post
    post = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).filter(models.Post.id == id).first()

    if post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={'message': f'id {id} not found'})
    return  post

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post: schemas.CreatePost, db: Session = Depends(get_db),
                    current_user: str = Depends(oauth2.get_current_user)):
    print(current_user)
    new_post = models.Post(user_name=current_user.user_name,**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.put("/{id}", response_model=schemas.Post)
def update_post(id: int, updated_post: schemas.CreatePost, db: Session = Depends(get_db), 
                current_user: int = Depends(oauth2.get_current_user)):

    post_query = db.query(models.Post).filter(models.Post.id == id)

    post = post_query.first()

    if post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"post with id: {id} does not exist")

    if post.user_name != current_user.user_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    post_query.update(updated_post.dict(), synchronize_session=False)

    db.commit()

    return post_query.first()
    


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int, 
                db: Session = Depends(get_db), 
                current_user: int = Depends(oauth2.get_current_user)):

    post_query = db.query(models.Post).filter(models.Post.id == id)

    post = post_query.first()

    if post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"post with id: {id} does not exist")

    if post.user_name != current_user.user_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    post_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)