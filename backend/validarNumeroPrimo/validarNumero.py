from backend.validarNumeroPrimo.procesarNumero import NumeroPrimo

def validarPYQ(primerNumero: int, segundoNumero: int) -> dict:
    primerNumeroEsPrimo = NumeroPrimo(primerNumero).validarPrimo()
    segundoNumeroEsPrimo = NumeroPrimo(segundoNumero).validarPrimo()

    ambosSonPrimos = primerNumeroEsPrimo and segundoNumeroEsPrimo

    if ambosSonPrimos:
        mensaje = f"{primerNumero} y {segundoNumero} son numeros primos."
    else:
        mensaje = f"{primerNumero} y {segundoNumero} no cumplen la condicion de ser ambos primos."

    return {
        "primerNumero": primerNumero,
        "segundoNumero": segundoNumero,
        "primerNumeroEsPrimo": primerNumeroEsPrimo,
        "segundoNumeroEsPrimo": segundoNumeroEsPrimo,
        "ambosSonPrimos": ambosSonPrimos,
        "mensaje": mensaje
    }