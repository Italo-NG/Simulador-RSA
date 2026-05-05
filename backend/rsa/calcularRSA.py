from backend.validarNumeroPrimo.validarNumero import validarPYQ
from backend.rsa.procesarRSA import ProcesoRSA


def calcularDatosBasicosRSA(primerNumero: int, segundoNumero: int) -> dict:
    validacion = validarPYQ(primerNumero, segundoNumero)

    if not validacion["ambosSonPrimos"]:
        return {
            "procesoCorrecto": False,
            "mensaje": "No se puede continuar con RSA porque ambos numeros deben ser primos",
            "validacion": validacion,
            "n": None,
            "phi": None,
            "pasos": []
        }

    procesoRSA = ProcesoRSA(primerNumero, segundoNumero)

    n = procesoRSA.calcularN()
    phi = procesoRSA.calcularPhi()

    pasos = [
        f"1. Se ingresaron p = {primerNumero} y q = {segundoNumero}",
        f"2. Como ambos numeros son primos, se puede continuar con el algoritmo RSA",
        f"3. Se calcula n = p x q = {primerNumero} x {segundoNumero} = {n}",
        f"4. Se calcula phi (n) = (p - 1)(q - 1) = ({primerNumero} - 1)({segundoNumero} - 1) = {phi}"
    ]

    return {
        "procesoCorrecto": True,
        "mensaje": "Calculado correctamente.",
        "validacion": validacion,
        "n": n,
        "phi": phi,
        "pasos": pasos
    }