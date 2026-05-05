from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from numero import Numero

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)

class NumerosRequest(BaseModel):
    primerNumero: int
    segundoNumero: int

@app.post("/api/validar-primos")
def validar_primos(datos: NumerosRequest):
    primerNumero = datos.primerNumero
    segundoNumero = datos.segundoNumero

    primerNumeroEsPrimo = Numero(primerNumero).validarPrimo()
    segundoNumeroEsPrimo = Numero(segundoNumero).validarPrimo()

    if primerNumeroEsPrimo and segundoNumeroEsPrimo:
        mensaje = f"{primerNumero} y {segundoNumero} son números primos."
    else:
        mensaje = f"{primerNumero} y {segundoNumero} no cumplen la condición de ser ambos primos."

    return {
        "primer_numero": primerNumero,
        "segundo_numero": segundoNumero,
        "primer_numero_es_primo": primerNumeroEsPrimo,
        "segundo_numero_es_primo": segundoNumeroEsPrimo,
        "ambos_son_primos": primerNumeroEsPrimo and segundoNumeroEsPrimo,
        "mensaje": mensaje
    }