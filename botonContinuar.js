let botonDeContinuar = document.getElementById("botonDeContinuar");

botonDeContinuar.addEventListener("click", continuar);

function continuar() {
    console.log(id("campoPrimerNumero").value);
    console.log(id("campoSegundoNumero").value);
}