let botonDeContinuar = document.getElementById("botonDeContinuar");

botonDeContinuar.addEventListener("click", continuar);

async function continuar() {
    let primerNumero = parseInt(document.getElementById("campoPrimerNumero").value);
    let segundoNumero = parseInt(document.getElementById("campoSegundoNumero").value);
    
    let salidaDeNumeros = document.getElementById("salidaNumeros");
    
    let datos = { primerNumero: primerNumero, segundoNumero: segundoNumero };

    let respuesta = await fetch("http://127.0.0.1:8000/api/calcularDatosRSA", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    let resultado = await respuesta.json();

    if (!resultado.procesoCorrecto) {
        salidaDeNumeros.textContent = resultado.mensaje + "\n" + resultado.validacion.mensaje;
        return;
    }

    salidaDeNumeros.textContent = resultado.mensaje + "\n\n" + resultado.pasos[0] + "\n" + resultado.pasos[1] + "\n" + resultado.pasos[2] + "\n" + resultado.pasos[3] + "\n\n" + "n: " + resultado.n + "\n" + "phi(n): " + resultado.phi;
}