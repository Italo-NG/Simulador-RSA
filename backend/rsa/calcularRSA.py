from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.procesarRSA import ProcesoRSA


def calcularDatosBasicosRSA(primerNumero: int, segundoNumero: int) -> dict:
    validacion = validarPYQ(primerNumero, segundoNumero)

    if not validacion["ambos_son_primos"]:
        return {
            "proceso_correcto": False,
            "mensaje": "No se puede continuar con RSA porque ambos números deben ser primos.",
            "validacion": validacion,
            "n": None,
            "phi": None,
            "pasos": []
        }

    procesoRSA = ProcesoRSA(primerNumero, segundoNumero)

    n = procesoRSA.calcularN()
    phi = procesoRSA.calcularPhi()

    pasos = [
        f"1. Se ingresaron p = {primerNumero} y q = {segundoNumero}.",
        f"2. Como ambos números son primos, se puede continuar con el algoritmo RSA.",
        f"3. Se calcula n = p x q = {primerNumero} x {segundoNumero} = {n}.",
        f"4. Se calcula phi (n) = (p - 1)(q - 1) = ({primerNumero} - 1)({segundoNumero} - 1) = {phi}."
    ]

    return {
        "proceso_correcto": True,
        "mensaje": "Datos básicos de RSA calculados correctamente.",
        "validacion": validacion,
        "n": n,
        "phi": phi,
        "pasos": pasos
    }