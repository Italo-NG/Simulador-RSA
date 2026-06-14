from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.calcularRSA import calcularDatosBasicosRSA
from backend.rsa.cifrarMensajeRSA import cifrarMensajeRSA

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)

class NumerosRequest(BaseModel):    
    primerNumero: int
    segundoNumero: int

@app.post("/api/validarNumerosPrimo")
def validarNumerosPrimos(datos: NumerosRequest):
    return validarPYQ(datos.primerNumero, datos.segundoNumero)

@app.post("/api/calcularDatosRSA")
def calcularDatosRSA(datos: NumerosRequest):
    return calcularDatosBasicosRSA(datos.primerNumero, datos.segundoNumero)

class MensajeRequest(BaseModel):
    primerNumero: int
    segundoNumero: int
    mensaje: str
    d: Optional[int] = None

@app.post("/api/cifrarMensajeRSA")
def cifrarMensaje(datos: MensajeRequest):
    return cifrarMensajeRSA(datos.primerNumero, datos.segundoNumero, datos.mensaje, datos.d)