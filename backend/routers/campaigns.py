from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

@router.get("/", response_model=List[schemas.CampaignOut])
def list_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.id.desc()).all()

@router.post("/", response_model=schemas.CampaignOut)
def create_campaign(payload: schemas.CampaignIn, db: Session = Depends(get_db)):
    c = models.Campaign(**payload.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.get("/{cid}", response_model=schemas.CampaignOut)
def get_campaign(cid: int, db: Session = Depends(get_db)):
    c = db.get(models.Campaign, cid)
    if not c:
        raise HTTPException(404, "Campaign not found")
    return c
