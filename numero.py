class Numero:
    def _init_(self, numero: int):
        self.numero = numero
    
    def validarPrimo(self) -> bool:
        for i in range(2, self.numero):
            if self.numero % i == 0:
                return False
        return True