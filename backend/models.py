from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    budget = Column(Numeric, nullable=True)
    status = Column(String, default="draft")
    notes = Column(Text, nullable=True)

class Creative(Base):
    __tablename__ = "creatives"
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    kind = Column(String, default="text")
    content = Column(Text, nullable=False)
    model = Column(String, default="openai")
    created_at = Column(DateTime, default=datetime.utcnow)
