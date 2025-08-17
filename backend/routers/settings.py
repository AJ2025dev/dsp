from fastapi import APIRouter, Body
import os

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/margins")
def get_margins():
    return {
        "agency_margin_pct": os.getenv("DEFAULT_AGENCY_MARGIN_PCT", "15"),
        "admin_buffer_pct": os.getenv("DEFAULT_ADMIN_BUFFER_PCT", "5"),
    }

@router.put("/margins")
def set_margins(agency_margin_pct: str = Body(...), admin_buffer_pct: str = Body(...)):
    return {"agency_margin_pct": agency_margin_pct, "admin_buffer_pct": admin_buffer_pct}
