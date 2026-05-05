let botonDeContinuar = document.getElementById("botonDeContinuar");

botonDeContinuar.addEventListener("click", continuar);

async function continuar() {
    let primerNumero = parseInt(document.getElementById("campoPrimerNumero").value);
    let segundoNumero = parseInt(document.getElementById("campoSegundoNumero").value);
    
    let salidaDeNumeros = document.getElementById("salidaNumeros");
    
    let datos = { primerNumero: primerNumero, segundoNumero: segundoNumero };

    let respuesta = await fetch("http://127.0.0.1:8000/api/validarNumerosPrimo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    let resultado = await respuesta.json();

    salidaDeNumeros.textContent = resultado.mensaje;
}