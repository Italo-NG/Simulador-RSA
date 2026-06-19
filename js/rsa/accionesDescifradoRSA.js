import { estado } from "../estado.js";
import { $, esc } from "../dom.js";
import { sacudir } from "../animaciones.js";
import { pedirDescifradoRSA } from "../api.js";

export function activarColocarCifrado(){
  const input = $("entradaCifrado");
  const fb = $("cifradoFeedback");
  const btn = $("btnSig");
  if(!input) return;

  const mostrar = (clase, texto) => {
    fb.className = "clave-feedback ver " + clase;
    fb.textContent = texto;
  };

  const usar = () => {
    const limpio = input.value.replace(/[\s,]/g, "");
    if(limpio === ""){
      mostrar("mal", "Coloca el mensaje cifrado: el número que aparece arriba.");
      sacudir(input);
      return;
    }
    if(!/^\d+$/.test(limpio)){
      mostrar("mal", "Usa solo números, sin letras ni otros símbolos.");
      sacudir(input);
      return;
    }
    const esperado = estado.numerosCifrados.join("");
    const minimo = Math.min(limpio.length, esperado.length);
    let pos = 0;
    while(pos < minimo && limpio[pos] === esperado[pos]) pos++;
    if(pos < minimo){
      mostrar("mal", "Hay un dígito equivocado en la posición " + (pos + 1) + " de " + esperado.length + ". Revísalo.");
      sacudir(input);
      return;
    }
    if(limpio.length !== esperado.length){
      mostrar("mal", "El mensaje cifrado tiene " + esperado.length + " dígitos y escribiste " + limpio.length + ". Revísalo.");
      sacudir(input);
      return;
    }
    estado.numerosColocados = estado.numerosCifrados.slice();
    mostrar("ok", "¡Mensaje cifrado correcto! Ahora necesitas la clave privada.");
    window.dispatchEvent(new Event("rsa:descifrar-avanzar"));
  };

  if(btn) btn.onclick = usar;
  input.addEventListener("keydown", e => {
    if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); usar(); }
  });
  input.focus();
}

export function activarComprobacionClave(){
  const input = $("entradaD");
  const fb = $("claveFeedback");
  const btn = $("btnSig");
  if(!input) return;

  const mostrar = (clase, texto) => {
    fb.className = "clave-feedback ver " + clase;
    fb.textContent = texto;
  };

  const comprobar = async () => {
    const val = parseInt(input.value, 10);
    if(!Number.isInteger(val)){
      mostrar("mal", "Escribe el valor de d para continuar.");
      sacudir(input);
      return;
    }
    if(val !== estado.clavePrivada.d){
      mostrar("mal", "Esa no es la clave privada. Es la d que elegiste, la pareja secreta de e.");
      sacudir(input);
      return;
    }
    mostrar("ok", "¡Correcta! Esa es la clave privada. Descifrando…");
    if(btn) btn.disabled = true;
    try {
      const datos = await pedirDescifradoRSA(estado.numerosColocados, val, estado.n);
      if(!datos.procesoCorrecto){
        mostrar("mal", datos.mensaje);
        if(btn) btn.disabled = false;
        return;
      }
      estado.textoRecuperado = datos.textoDescifrado;
      estado.codigosRecuperados = datos.codigos;
      window.dispatchEvent(new Event("rsa:descifrar-avanzar"));
    } catch(err){
      mostrar("mal", "No se pudo conectar con el servidor. Inténtalo de nuevo.");
      if(btn) btn.disabled = false;
    }
  };

  if(btn) btn.onclick = comprobar;
  input.addEventListener("keydown", e => { if(e.key === "Enter") comprobar(); });
  input.focus();
}

export function animarDescifrado(){
  const cont = $("descLive");
  if(!cont) return;
  const numeros = estado.numerosColocados;
  const codigos = estado.codigosRecuperados;
  const letras = Array.from(estado.textoRecuperado);
  const d = estado.clavePrivada.d;
  const n = estado.clavePrivada.n;
  let i = 0;
  (function paso(){
    if(i >= numeros.length){
      revelarTexto();
      return;
    }
    const fila = document.createElement("div");
    fila.className = "op-fila entra-cif";
    fila.innerHTML =
      '<span class="op-calc">' + numeros[i] + '<sup>' + d + '</sup> mod ' + n + ' = <b class="op-m">' + codigos[i] + '</b></span>' +
      '<span class="op-flecha">→</span>' +
      '<span class="op-letra">' + esc(letras[i]) + '</span>';
    cont.appendChild(fila);
    i++;
    setTimeout(paso, 240);
  })();
}

function revelarTexto(){
  const caja = $("cajaRecuperado");
  if(!caja) return;
  caja.innerHTML =
    '<div class="burbuja-ia" style="margin-top:16px">' +
      '<div class="mini">Texto recuperado con la clave privada (' + estado.clavePrivada.d + ', ' + estado.clavePrivada.n + ')</div>' +
      '<div class="texto-claro">' + esc(estado.textoRecuperado) + '</div>' +
    '</div>';
}
