#!/usr/bin/env bash
set -e
# Use virtualenv only if you want; Codespaces often has Python ready
python3 -m pip install --upgrade pip
# Install deps (don't overwrite your existing requirements.txt if present)
python3 -m pip install fastapi "uvicorn[standard]" SQLAlchemy openai requests
# Run API
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
