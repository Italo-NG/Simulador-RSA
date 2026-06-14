import { texto, numeroP, numeroQ, enviar, estadoP, estadoQ, burbujaP, burbujaQ, leerEntero } from "./dom.js";
import { esPrimo, camposCompletos, primosDemasiadoPequenos } from "./validaciones.js";
import { reproducirOla, sacudir, efectoPop } from "./animaciones.js";
import { pedirCifradoRSA } from "./api.js";
import { guardarResultado } from "./estado.js";
import { mostrarError, armarCarta } from "./renderResultados.js";
import { construirPasos, irA } from "./renderPasos.js";

function actualizarPrimo(input, estadoEl, burbuja){
  const v = input.value.trim();
  if(v === ""){ estadoEl.className = "estado-primo"; estadoEl.innerHTML = ""; return; }
  const n = parseInt(v, 10);
  if(esPrimo(n)){
    estadoEl.className = "estado-primo ver ok";
    estadoEl.innerHTML = '<span class="ficha"></span> ¡es primo!';
    efectoPop(burbuja);
  } else {
    estadoEl.className = "estado-primo ver mal";
    estadoEl.innerHTML = '<span class="ficha"></span> no es primo';
  }
}

function sacudirSegunValidacion(datosRSA){
  const v = datosRSA && datosRSA.validacion;
  if(v && (!v.primerNumeroEsPrimo || !v.segundoNumeroEsPrimo)){
    if(!v.primerNumeroEsPrimo) sacudir(burbujaP);
    if(!v.segundoNumeroEsPrimo) sacudir(burbujaQ);
  } else {
    sacudir(burbujaP); sacudir(burbujaQ);
  }
}

async function empezar(){
  const p = leerEntero(numeroP);
  const q = leerEntero(numeroQ);
  const msg = texto.value;

  if(!camposCompletos(numeroP.value, numeroQ.value)){
    sacudir(burbujaP); sacudir(burbujaQ);
    return mostrarError("Faltan números", "Escribe los dos números primos en las burbujas para continuar.");
  }
  if(texto.value.trim() === ""){
    return mostrarError("Falta mensaje", "Escribe un mensaje para cifrar.");
  }
  if(primosDemasiadoPequenos(p, q)){
    return mostrarError("Usa números primos más grandes",
      "Para cifrar texto, usa números primos más grandes. Te recomendamos 11 y 17 o mayores.");
  }

  let datos;
  try {
    datos = await pedirCifradoRSA(p, q, msg, null);
  } catch(err){
    return mostrarError("No se pudo conectar con el backend",
      "Ejecuta primero:  uvicorn backend.main:app --reload");
  }

  if(!datos.procesoCorrecto){
    sacudirSegunValidacion(datos.datosRSA);
    return mostrarError("No se puede continuar con RSA", datos.mensaje);
  }

  guardarResultado(p, q, msg, datos);
  const arrancar = () => {
    document.body.classList.add("modo-resultado");
    construirPasos();
    armarCarta();
    irA(0);
    window.scrollTo(0, 0);
  };
  reproducirOla(arrancar);
}

numeroP.addEventListener("input", () => actualizarPrimo(numeroP, estadoP, burbujaP));
numeroQ.addEventListener("input", () => actualizarPrimo(numeroQ, estadoQ, burbujaQ));

[texto, numeroP, numeroQ].forEach(el => {
  el.addEventListener("keydown", e => { if(e.key === "Enter") empezar(); });
});

enviar.addEventListener("click", empezar);
