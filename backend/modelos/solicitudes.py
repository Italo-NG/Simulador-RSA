from typing import Optional

from pydantic import BaseModel


class NumerosRequest(BaseModel):
    primerNumero: int
    segundoNumero: int


class MensajeRequest(BaseModel):
    primerNumero: int
    segundoNumero: int
    mensaje: str
    d: Optional[int] = None
