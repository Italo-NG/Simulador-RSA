class NumeroPrimo:
    def __init__(self, numero: int):
        self.numero = numero
    
    def validarPrimo(self) -> bool:
        if self.numero < 2:
            return False
        if self.numero == 2:
            return True
        elif self.numero > 2:
            for i in range(2, self.numero):
                if self.numero % i == 0:
                    return False
            return True