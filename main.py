from numero import Numero

numero1 = 2
numero2 = 5

if Numero(numero1).validarPrimo() and Numero(numero2).validarPrimo():
    print(f"{numero1} y {numero2} son primos")
else:
    print(f"{numero1} y {numero2} no son primos")