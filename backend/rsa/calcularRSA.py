from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.procesarRSA import ProcesoRSA
from backend.rsa.generarClavesRSA import GeneradorClavesRSA

def calcularDatosBasicosRSA(primerNumero: int, segundoNumero: int, dElegido: int = None) -> dict:
    validacion = validarPYQ(primerNumero, segundoNumero)

    if not validacion["ambosSonPrimos"]:
        return {
            "procesoCorrecto": False,
            "mensaje": "No se puede continuar con RSA porque ambos numeros deben ser primos",
            "validacion": validacion,
            "n": None,
            "phi": None,
            "posiblesD": [],
            "d": None,
            "e": None,
            "clavePublica": None,
            "clavePrivada": None,
            "pasos": []
        }

    procesoRSA = ProcesoRSA(primerNumero, segundoNumero)

    n = procesoRSA.calcularN()
    phi = procesoRSA.calcularPhi()

    generadorClaves = GeneradorClavesRSA(n, phi)
    datosClaves = generadorClaves.generarClaves()

    posiblesD = datosClaves["posiblesD"]

    # Por defecto se usa el primer d. Si el usuario eligio un d valido
    # (coprimo con phi), se usa ese y se recalcula e para esa eleccion.
    if dElegido is not None and dElegido in posiblesD:
        d = dElegido
        e = generadorClaves.calcularE(d)
        clavePublica = {"e": e, "n": n}
        clavePrivada = {"d": d, "n": n}
    else:
        d = datosClaves["d"]
        e = datosClaves["e"]
        clavePublica = datosClaves["clavePublica"]
        clavePrivada = datosClaves["clavePrivada"]

    pasos = [
        f"1. Se ingresaron p = {primerNumero} y q = {segundoNumero}",
        f"2. Como ambos numeros son primos, se puede continuar con el algoritmo RSA",
        f"3. Se calcula n = p x q = {primerNumero} x {segundoNumero} = {n}",
        f"4. Se calcula phi (n) = (p - 1)(q - 1) = ({primerNumero} - 1)({segundoNumero} - 1) = {phi}",
        f"5. Se buscan posibles valores de d que sean coprimos con phi (n) = {phi}",
        f"6. Posibles valores de d encontrados: {posiblesD}",
        f"7. Se selecciona d = {d}",
        f"8. Se calcula e buscando que (e x d) mod phi (n) = 1",
        f"9. Se obtiene e = {e}, porque ({e} x {d}) mod {phi} = 1",
        f"10. Clave publica: (e, n) = ({e}, {n})",
        f"11. Clave privada: (d, n) = ({d}, {n})"
    ]

    return {
        "procesoCorrecto": True,
        "mensaje": "Calculado correctamente.",
        "validacion": validacion,
        "n": n,
        "phi": phi,
        "posiblesD": posiblesD,
        "d": d,
        "e": e,
        "clavePublica": clavePublica,
        "clavePrivada": clavePrivada,
        "pasos": pasos
    }