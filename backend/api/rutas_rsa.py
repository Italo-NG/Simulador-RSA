from fastapi import APIRouter

from backend.modelos.solicitudes import NumerosRequest, MensajeRequest, DescifradoRequest
from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.calcularRSA import calcularDatosBasicosRSA
from backend.rsa.cifrarMensajeRSA import cifrarMensajeRSA
from backend.rsa.descifrarMensajeRSA import descifrarMensajeRSA

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


@router.post("/api/descifrarMensajeRSA")
def descifrarMensaje(datos: DescifradoRequest):
    return descifrarMensajeRSA(datos.numerosCifrados, datos.d, datos.n)
