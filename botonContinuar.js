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

    if (!resultado.proceso_correcto) {
        salidaDeNumeros.textContent = resultado.mensaje + " " + resultado.validacion.mensaje;
        return;
    }

    salidaDeNumeros.innerHTML = `
        <strong>${resultado.mensaje}</strong><br><br>
        ${resultado.pasos[0]}<br>
        ${resultado.pasos[1]}<br>
        ${resultado.pasos[2]}<br>
        ${resultado.pasos[3]}<br><br>
        <strong>n:</strong> ${resultado.n}<br>
        <strong>phi(n):</strong> ${resultado.phi}
    `;
}