from fastapi import APIRouter

from backend.modelos.solicitudes import NumerosRequest, MensajeRequest
from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.calcularRSA import calcularDatosBasicosRSA
from backend.rsa.cifrarMensajeRSA import cifrarMensajeRSA

# Router que agrupa los endpoints de la API RSA.
# Se registra en main.py con app.include_router(...).
router = APIRouter()


@router.post("/api/validarNumerosPrimo")
def validarNumerosPrimos(datos: NumerosRequest):
    return validarPYQ(datos.primerNumero, datos.segundoNumero)


@router.post("/api/calcularDatosRSA")
def calcularDatosRSA(datos: NumerosRequest):
    return calcularDatosBasicosRSA(datos.primerNumero, datos.segundoNumero)


@router.post("/api/cifrarMensajeRSA")
def cifrarMensaje(datos: MensajeRequest):
    return cifrarMensajeRSA(datos.primerNumero, datos.segundoNumero, datos.mensaje, datos.d)
