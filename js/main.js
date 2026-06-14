// Orquestador del simulador RSA.
// Conecta los eventos de la página y coordina validaciones, backend y render.
// No hace matemática RSA: eso es 100% del backend.
import { texto, numeroP, numeroQ, enviar, estadoP, estadoQ, burbujaP, burbujaQ, leerEntero } from "./dom.js";
import { esPrimo, camposCompletos } from "./validaciones.js";
import { reproducirOla, sacudir, efectoPop } from "./animaciones.js";
import { pedirCifradoRSA } from "./api.js";
import { guardarResultado } from "./estado.js";
import { mostrarError, armarCarta } from "./renderResultados.js";
import { construirPasos, irA } from "./renderPasos.js";

// ---------- pista de primo en vivo (solo ayuda visual del frontend) ----------
// Mientras se escribe en una burbuja mostramos ✓/✕. La validación real la hace
// el backend al pulsar enviar.
function actualizarPrimo(input, estadoEl, burbuja){
  const v = input.value.trim();
  if(v === ""){ estadoEl.className = "estado-primo"; estadoEl.innerHTML = ""; return; }
  const n = parseInt(v, 10);
  if(esPrimo(n)){
    estadoEl.className = "estado-primo ver ok";
    estadoEl.innerHTML = '<span class="ficha">✓</span> ¡es primo!';
    efectoPop(burbuja);
  } else {
    estadoEl.className = "estado-primo ver mal";
    estadoEl.innerHTML = '<span class="ficha">✕</span> no es primo';
  }
}

// Sacude la(s) burbuja(s) del número que el backend marcó como no primo.
function sacudirSegunValidacion(datosRSA){
  const v = datosRSA && datosRSA.validacion;
  if(v && (!v.primerNumeroEsPrimo || !v.segundoNumeroEsPrimo)){
    if(!v.primerNumeroEsPrimo) sacudir(burbujaP);
    if(!v.segundoNumeroEsPrimo) sacudir(burbujaQ);
  } else {
    sacudir(burbujaP); sacudir(burbujaQ);
  }
}

// ---------- al pulsar enviar ----------
async function empezar(){
  const p = leerEntero(numeroP);
  const q = leerEntero(numeroQ);
  const msg = texto.value;

  // El frontend solo valida campos vacíos. La validación de primos y toda
  // la matemática RSA vienen del backend.
  if(!camposCompletos(numeroP.value, numeroQ.value)){
    sacudir(burbujaP); sacudir(burbujaQ);
    return mostrarError("Faltan números", "Escribe los dos números primos en las burbujas para continuar.");
  }

  let datos;
  try {
    datos = await pedirCifradoRSA(p, q, msg, null);
  } catch(err){
    return mostrarError("No se pudo conectar con el backend",
      "Ejecuta primero:  uvicorn backend.main:app --reload");
  }

  // El backend decide si los números son válidos (primos, distintos, etc.)
  if(!datos.procesoCorrecto){
    sacudirSegunValidacion(datos.datosRSA);
    return mostrarError("No se puede continuar con RSA", datos.mensaje);
  }

  guardarResultado(p, q, msg, datos);
  const arrancar = () => {
    document.body.classList.add("modo-resultado");  // oculta título, chat y burbujas
    construirPasos();
    armarCarta();
    irA(0);
    window.scrollTo(0, 0);
  };
  reproducirOla(arrancar);
}

// ---------- conexión de eventos ----------
numeroP.addEventListener("input", () => actualizarPrimo(numeroP, estadoP, burbujaP));
numeroQ.addEventListener("input", () => actualizarPrimo(numeroQ, estadoQ, burbujaQ));

// Enter en cualquiera de los campos empieza el cifrado.
[texto, numeroP, numeroQ].forEach(el => {
  el.addEventListener("keydown", e => { if(e.key === "Enter") empezar(); });
});

enviar.addEventListener("click", empezar);
