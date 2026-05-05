class ProcesoRSA:
    def __init__(self, primerNumero: int, segundoNumero: int):
        self.primerNumero = primerNumero
        self.segundoNumero = segundoNumero

    def calcularN(self) -> int:
        return self.primerNumero * self.segundoNumero

    def calcularPhi(self) -> int:
        return (self.primerNumero - 1) * (self.segundoNumero - 1)