let botonDeContinuar = document.getElementById("botonDeContinuar");

botonDeContinuar.addEventListener("click", continuar);

function continuar() {
    let primerNumero = parseInt(document.getElementById("campoPrimerNumero").value);
    let segundoNumero = parseInt(document.getElementById("campoSegundoNumero").value);
    
    let salidaDeNumeros = document.getElementById("salidaNumeros");
    salidaDeNumeros.textContent = "Primer número: " + primerNumero + "  Segundo número: " + segundoNumero;
}