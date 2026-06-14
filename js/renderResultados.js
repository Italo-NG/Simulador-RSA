// Render de la tarjeta de resultado: errores, cabecera del recorrido y el
// mensaje descifrado. Aquí NO se hace fetch ni se calcula RSA: solo se pinta
// en la página lo que el backend ya devolvió.
import { estado } from "./estado.js";
import { tarjeta, resultado, $, esc } from "./dom.js";

// Abre/anima la carta de resultado (privado del módulo).
function abrirCarta(){
  resultado.classList.remove("abierto"); void resultado.offsetWidth;
  resultado.classList.add("abierto");
}

// Muestra una tarjeta de error con título y detalle.
export function mostrarError(titulo, detalle){
  tarjeta.className = "tarjeta error";
  tarjeta.innerHTML =
    '<div class="res-cabecera bad"><div class="icono">!</div>' +
    '<div><h2>' + esc(titulo) + '</h2><p>' + esc(detalle) + '</p></div></div>';
  abrirCarta();
}

// Arma la carta del recorrido guiado (cabecera + barra de progreso + navegación).
// El contenido de cada paso lo rellena renderPasos.js.
export function armarCarta(){
  tarjeta.className = "tarjeta";
  tarjeta.innerHTML =
    '<div class="res-cabecera ok"><div class="icono">✓</div>' +
    '<div><h2>¡Vamos paso a paso!</h2><p>' + estado.p + ' y ' + estado.q + ' son primos · sigue el proceso RSA</p></div></div>' +
    '<div class="tope-paso"><span class="contador" id="progCont"></span>' +
    '<div class="barra-prog"><i id="progFill"></i></div></div>' +
    '<div id="pasoPanel"></div>' +
    '<div class="nav-pasos">' +
      '<button class="btn btn-atras" id="btnAtras">◀ Atrás</button>' +
      '<button class="btn btn-sig" id="btnSig">Siguiente ▶</button>' +
    '</div>';
  abrirCarta();
}

// El texto descifrado ya viene del backend (clave privada en Python).
export function descifrar(){
  $("cajaDesc").innerHTML =
    '<div class="burbuja-ia" style="margin-top:16px">' +
      '<div class="mini">Mensaje recuperado con la clave privada (' + estado.clavePrivada.d + ', ' + estado.clavePrivada.n + ')</div>' +
      '<div class="texto-claro">' + esc(estado.textoDescifrado) + '</div>' +
    '</div>';
  const b = $("btnDescifrar");
  if(b) b.style.display = "none";
}
