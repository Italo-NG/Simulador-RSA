from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.validarNumeroPrimo.validarNumero import validarPYQ

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)

class NumerosRequest(BaseModel):    
    primerNumero: int
    segundoNumero: int

@app.post("/api/validarNumerosPrimo")
def validarNumerosPrimos(datos: NumerosRequest):
    return validarPYQ(datos.primerNumero, datos.segundoNumero)