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

    let textoResultado = resultado.mensaje + "\n\n";

    for (let i = 0; i < resultado.pasos.length; i++) {
        textoResultado += resultado.pasos[i] + "\n";
    }

    textoResultado += "\n";
    textoResultado += "n: " + resultado.n + "\n";
    textoResultado += "phi(n): " + resultado.phi + "\n";
    textoResultado += "d: " + resultado.d + "\n";
    textoResultado += "e: " + resultado.e + "\n";
    textoResultado += "Clave publica: (" + resultado.clavePublica.e + ", " + resultado.clavePublica.n + ")\n";
    textoResultado += "Clave privada: (" + resultado.clavePrivada.d + ", " + resultado.clavePrivada.n + ")";

    salidaDeNumeros.textContent = textoResultado;
}