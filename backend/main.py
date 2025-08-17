from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import campaigns, creatives, reports, settings as settings_router

app = FastAPI(title="DSP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

# Create tables on boot
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(campaigns.router)
app.include_router(creatives.router)
app.include_router(reports.router)
app.include_router(settings_router.router)
