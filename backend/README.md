# AgriSat Backend (Phase 1)

## Quick local run (dev)
1. Install Python 3.13 and create venv:

python -m venv .venv source .venv/bin/activate   # Windows: .venv\Scripts\activate pip install -r backend/requirements.txt

2. Copy .env.example to .env and fill values (DATABASE_URL, OPENWEATHER_API_KEY). If you don't have SentinelHub keys, leave them empty (mock NDVI used).

3. Export env vars or use direnv / python-dotenv. To run:

uvicorn backend.main:app --reload --port 8000

## Free deployment options
- *Database*: Create a free project on [Supabase](https://supabase.com), enable PostGIS. Use the database connection string in DATABASE_URL.
- *Backend*: Deploy to Render (free tier) or Railway (free tier) — connect repo and set environment variables. Use Docker if needed.
- *Frontend*: Build React app and deploy to Vercel (free).

## SentinelHub (real NDVI)
1. Sign up: https://www.sentinel-hub.com/
2. Create a configuration and get *Client ID / Client Secret*.
3. Fill them in .env as SENTINELHUB_CLIENT_ID and SENTINELHUB_CLIENT_SECRET.
4. The backend compute_ndvi_mean will then use SentinelHub to compute NDVI mean.

## Notes
- Endpoints:
- POST /auth/signup with JSON { "email": "...", "password": "..." }
- POST /auth/login => returns JWT bearer token
- GET /farms (Bearer token)
- POST /farms to create farm
- POST /ndvi/analyze?farm_id=... (Bearer) => computes NDVI, stores analysis
- GET /weather?lat=..&lon=.. => weather forecast


---

How to test locally (step by step)

1. Create a Python 3.13 venv and install requirements (see README).


2. Create a Supabase free DB (or run local Postgres). Copy connection string to DATABASE_URL.


3. (Optional) create SentinelHub account and set credentials.


4. Start the app:

uvicorn backend.main:app --reload --port 8000


5. Use Postman or curl to call endpoints:

Register: POST /auth/signup with JSON: {"email":"you@example.com","password":"test"}

Login: POST /auth/login -> get token

Create farm: POST /farms with Authorization header Bearer <token> and body:

{"name":"Test Farm", "center": {"lat":20.3,"lon":85.8}, "size_km":1.0}

Analyze NDVI: POST /ndvi/analyze?farm_id=1 with same Authorization header

Weather: GET /weather?lat=20.2961&lon=85.8245