from typing import Optional

from pydantic import BaseModel


# Modelos de entrada: describen lo que el frontend envia en el cuerpo (body)
# de cada peticion. FastAPI los usa para validar y convertir esos datos.

class NumerosRequest(BaseModel):
    primerNumero: int
    segundoNumero: int


class MensajeRequest(BaseModel):
    primerNumero: int
    segundoNumero: int
    mensaje: str
    d: Optional[int] = None
