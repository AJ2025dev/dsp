from pydantic import BaseModel
from typing import Optional

# Campaign
class CampaignIn(BaseModel):
    name: str
    brand: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = "draft"
    notes: Optional[str] = None

class CampaignOut(CampaignIn):
    id: int
    class Config:
        from_attributes = True

# Creative
class CreativeGenerateIn(BaseModel):
    product: str
    audience: str
    model: str = "openai"

class CreativeSaveIn(BaseModel):
    content: str
    campaign_id: Optional[int] = None
    kind: str = "text"
    model: str = "openai"

class CreativeOut(BaseModel):
    id: int
    content: str
    campaign_id: Optional[int] = None
    kind: str
    model: str
    class Config:
        from_attributes = True
