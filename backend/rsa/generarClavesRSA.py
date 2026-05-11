class GeneradorClavesRSA:
    def __init__(self, n: int, phi: int):
        self.n = n
        self.phi = phi

    def calcularMCD(self, primerNumero: int, segundoNumero: int) -> int:
        while segundoNumero != 0:
            residuo = primerNumero % segundoNumero
            primerNumero = segundoNumero
            segundoNumero = residuo

        return primerNumero

    def obtenerPosiblesD(self) -> list:
        posiblesD = []

        for numero in range(2, self.phi):
            if self.calcularMCD(numero, self.phi) == 1:
                posiblesD.append(numero)

        return posiblesD

    def seleccionarD(self, posiblesD: list) -> int:
        return posiblesD[0]

    def calcularE(self, d: int) -> int:
        e = 1

        while (e * d) % self.phi != 1:
            e += 1

        return e

    def generarClaves(self) -> dict:
        posiblesD = self.obtenerPosiblesD()
        d = self.seleccionarD(posiblesD)
        e = self.calcularE(d)

        return {
            "posiblesD": posiblesD,
            "d": d,
            "e": e,
            "clavePublica": {
                "e": e,
                "n": self.n
            },
            "clavePrivada": {
                "d": d,
                "n": self.n
            }
        }