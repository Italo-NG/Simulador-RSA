from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.rutas_rsa import router as routerRSA

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)

# Toda la API RSA vive en backend/api/rutas_rsa.py
app.include_router(routerRSA)
