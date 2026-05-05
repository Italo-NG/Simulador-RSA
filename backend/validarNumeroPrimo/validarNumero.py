from backend.validarNumeroPrimo.procesarNumero import NumeroPrimo

def validarPYQ(primerNumero: int, segundoNumero: int) -> dict:
    primerNumeroEsPrimo = NumeroPrimo(primerNumero).validarPrimo()
    segundoNumeroEsPrimo = NumeroPrimo(segundoNumero).validarPrimo()

    if primerNumeroEsPrimo and segundoNumeroEsPrimo:
        mensaje = f"{primerNumero} y {segundoNumero} son numeros primos."
    else:
        mensaje = f"{primerNumero} y {segundoNumero} no cumplen la condicion de ser ambos primos."

    return {
        "primer_numero": primerNumero,
        "segundo_numero": segundoNumero,
        "primer_numero_es_primo": primerNumeroEsPrimo,
        "segundo_numero_es_primo": segundoNumeroEsPrimo,
        "ambos_son_primos": primerNumeroEsPrimo and segundoNumeroEsPrimo,
        "mensaje": mensaje
    }