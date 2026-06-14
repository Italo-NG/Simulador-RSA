from backend.validarNumeroPrimo.validarNumero import validarPYQ


def validarNumerosRSA(primerNumero: int, segundoNumero: int) -> dict:
    validacionPrimos = validarPYQ(primerNumero, segundoNumero)

    numerosPrimos = validacionPrimos["ambosSonPrimos"]
    numerosDistintos = primerNumero != segundoNumero
    rsaValido = numerosPrimos and numerosDistintos

    if not numerosPrimos:
        mensajeRSA = "No se puede continuar con RSA porque ambos numeros deben ser primos"
    elif not numerosDistintos:
        mensajeRSA = "En RSA los dos primos deben ser distintos entre si."
    else:
        mensajeRSA = "Los numeros son validos para RSA."

    return {
        **validacionPrimos,
        "numerosPrimos": numerosPrimos,
        "numerosDistintos": numerosDistintos,
        "rsaValido": rsaValido,
        "mensajeRSA": mensajeRSA
    }
