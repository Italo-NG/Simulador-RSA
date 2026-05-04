class Numero:
    def _init_(self, numero: int):
        self.numero = numero
    
    def validarPrimo(self) -> bool:
        if self.numero == 1 or self.numero == 0:
            return False
        if self.numero == 2:
            return True
        elif self.numero > 2:
            for i in range(2, self.numero):
                if self.numero % i == 0:
                    return False
                elif self.numero % i != 0 and i == self.numero - 1:
                    return True