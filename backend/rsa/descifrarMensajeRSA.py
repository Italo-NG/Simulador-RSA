def _aCaracter(codigo: int) -> str:
    try:
        return chr(codigo)
    except (ValueError, OverflowError):
        return "?"


def descifrarMensajeRSA(numerosCifrados: list, d: int, n: int) -> dict:
    if n is None or n <= 1 or d is None or d <= 0:
        return {
            "procesoCorrecto": False,
            "mensaje": "Faltan datos validos para descifrar.",
            "codigos": [],
            "textoDescifrado": ""
        }

    if not numerosCifrados:
        return {
            "procesoCorrecto": False,
            "mensaje": "Coloca el mensaje cifrado para poder descifrarlo.",
            "codigos": [],
            "textoDescifrado": ""
        }

    if any(numero < 0 for numero in numerosCifrados):
        return {
            "procesoCorrecto": False,
            "mensaje": "El mensaje cifrado solo puede tener numeros positivos.",
            "codigos": [],
            "textoDescifrado": ""
        }

    codigos = [pow(numero, d, n) for numero in numerosCifrados]
    textoDescifrado = "".join(_aCaracter(codigo) for codigo in codigos)

    return {
        "procesoCorrecto": True,
        "mensaje": "Mensaje descifrado correctamente.",
        "codigos": codigos,
        "textoDescifrado": textoDescifrado
    }
