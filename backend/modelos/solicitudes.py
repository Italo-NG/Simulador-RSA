from typing import List, Optional

from pydantic import BaseModel


class NumerosRequest(BaseModel):
    primerNumero: int
    segundoNumero: int


class MensajeRequest(BaseModel):
    primerNumero: int
    segundoNumero: int
    mensaje: str
    d: Optional[int] = None


class DescifradoRequest(BaseModel):
    numerosCifrados: List[int]
    d: int
    n: int
