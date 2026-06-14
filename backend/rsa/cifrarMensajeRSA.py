from backend.rsa.calcularRSA import calcularDatosBasicosRSA


def cifrarMensajeRSA(primerNumero: int, segundoNumero: int, mensaje: str, dElegido: int = None) -> dict:
    # Reutiliza el calculo de claves y la validacion RSA comun.
    datos = calcularDatosBasicosRSA(primerNumero, segundoNumero, dElegido)

    # Si los numeros no son validos, no son primos o no hay un d valido,
    # el calculo no continua.
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

    n = datos["n"]
    e = datos["e"]
    d = datos["d"]

    # Cifrar: cada caracter -> c = (codigo del caracter ^ e) mod n
    numerosCifrados = [pow(ord(caracter), e, n) for caracter in mensaje]

    # Descifrar: cada numero -> caracter = (numero ^ d) mod n
    textoDescifrado = "".join(chr(pow(numero, d, n)) for numero in numerosCifrados)

    # Aviso si algun caracter vale mas que n (se pierde al descifrar)
    advertencia = None
    if any(ord(caracter) >= n for caracter in mensaje):
        advertencia = (
            f"Algunos caracteres valen mas que n = {n}, asi que al descifrar pueden "
            f"no coincidir. Usa primos mas grandes para textos con acentos o emojis."
        )

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
