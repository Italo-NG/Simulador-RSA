from backend.rsa.calcularRSA import calcularDatosBasicosRSA


def cifrarMensajeRSA(primerNumero: int, segundoNumero: int, mensaje: str, dElegido: int = None) -> dict:
    datos = calcularDatosBasicosRSA(primerNumero, segundoNumero, dElegido)

    if not datos["procesoCorrecto"]:
        return {
            "procesoCorrecto": False,
            "mensaje": datos["mensaje"],
            "datosRSA": datos,
            "textoOriginal": mensaje,
            "numerosCifrados": [],
            "textoDescifrado": "",
            "advertencia": None
        }

    if mensaje.strip() == "":
        return {
            "procesoCorrecto": False,
            "mensaje": "Escribe un mensaje para cifrar.",
            "datosRSA": datos,
            "textoOriginal": mensaje,
            "numerosCifrados": [],
            "textoDescifrado": "",
            "advertencia": None
        }

    n = datos["n"]
    e = datos["e"]
    d = datos["d"]

    if mensaje and max(ord(caracter) for caracter in mensaje) >= n:
        return {
            "procesoCorrecto": False,
            "mensaje": "Estos numeros son muy pequenos para cifrar este texto. Usa numeros primos mas grandes, por ejemplo 11 y 17.",
            "datosRSA": datos,
            "textoOriginal": mensaje,
            "numerosCifrados": [],
            "textoDescifrado": "",
            "advertencia": None
        }

    numerosCifrados = [pow(ord(caracter), e, n) for caracter in mensaje]

    textoDescifrado = "".join(chr(pow(numero, d, n)) for numero in numerosCifrados)

    advertencia = None

    datosRSA = {
        "n": n,
        "phi": datos["phi"],
        "posiblesD": datos["posiblesD"],
        "d": d,
        "e": e,
        "clavePublica": datos["clavePublica"],
        "clavePrivada": datos["clavePrivada"],
        "pasos": datos["pasos"]
    }

    return {
        "procesoCorrecto": True,
        "mensaje": "Mensaje cifrado correctamente.",
        "datosRSA": datosRSA,
        "textoOriginal": mensaje,
        "numerosCifrados": numerosCifrados,
        "textoDescifrado": textoDescifrado,
        "advertencia": advertencia
    }
