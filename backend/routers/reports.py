from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from .. import models

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    total = db.query(func.count(models.Campaign.id)).scalar() or 0
    by_status = dict(db.query(models.Campaign.status, func.count(models.Campaign.id)).group_by(models.Campaign.status).all())
    return {"campaigns": total, "by_status": by_status}
