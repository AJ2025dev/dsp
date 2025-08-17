from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..services.ai_generator import generate_creative_text

router = APIRouter(prefix="/api/creatives", tags=["Creatives"])

@router.post("/generate")
def generate(payload: schemas.CreativeGenerateIn):
    text = generate_creative_text(payload.product, payload.audience, payload.model)
    return {"provider": payload.model, "text": text}

@router.post("/save", response_model=schemas.CreativeOut)
def save(payload: schemas.CreativeSaveIn, db: Session = Depends(get_db)):
    cr = models.Creative(
        content=payload.content,
        campaign_id=payload.campaign_id,
        kind=payload.kind,
        model=payload.model,
    )
    db.add(cr); db.commit(); db.refresh(cr)
    return cr
