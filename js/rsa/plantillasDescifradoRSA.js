import { estado } from "../estado.js";
import { esc } from "../dom.js";

export function htmlPasoMensajeCifrado(){
  const numeroCifrado = estado.numerosCifrados.join('');
  const yaColocado = estado.numerosColocados.length ? estado.numerosColocados.join('') : '';
  return '<div class="expli">El mensaje viajó convertido en números. Para descifrarlo, primero colócalo: este es el mensaje cifrado que se generó. Escríbelo en el campo como un <b>solo número</b>, todos los dígitos juntos:</div>' +
    '<div class="cif-recibido">' + numeroCifrado + '</div>' +
    '<div class="caja-clave">' +
      '<div class="nombre">Coloca el mensaje cifrado</div>' +
      '<textarea id="entradaCifrado" class="entrada-cifrado" rows="2" inputmode="numeric" placeholder="Escríbelo junto, sin espacios ni comas…" autocomplete="off">' + esc(yaColocado) + '</textarea>' +
      '<div class="clave-feedback" id="cifradoFeedback"></div>' +
    '</div>' +
    '<div class="expli">Escríbelo <b>exactamente</b> como aparece arriba. Si te equivocas en algún dígito, te diremos en qué posición está el error.</div>';
}

export function htmlPasoClavePrivada(){
  return '<div class="expli">Ya colocaste el mensaje cifrado. Para volver al texto original se usa la <b>clave privada</b> con <code>m = c<sup>d</sup> mod ' + estado.n + '</code>. La pública cifra; solo la <b>privada</b> descifra.</div>' +
    '<div class="claves" style="margin-top:16px">' +
      '<div class="clave publica"><div class="nombre">Clave pública (e, n)</div><div class="par">(' + estado.clavePublica.e + ', ' + estado.clavePublica.n + ')</div></div>' +
    '</div>' +
    '<div class="caja-clave">' +
      '<div class="nombre">Escribe la clave privada (d, n)</div>' +
      '<div class="par-clave">(' +
        '<input type="number" id="entradaD" class="entrada-d" placeholder="d" min="2" inputmode="numeric" autocomplete="off">' +
        ', <span class="fija">' + estado.n + '</span> )' +
      '</div>' +
      '<div class="clave-feedback" id="claveFeedback"></div>' +
    '</div>' +
    '<div class="expli">Pista: es la <b>d</b> que elegiste en el paso 4 del cifrado, la pareja secreta de e. Escríbela y pulsa <b>Comprobar y descifrar</b>.</div>';
}

export function htmlPasoDescifrando(){
  return '<div class="expli">Hacemos el camino inverso. Cada número que colocaste se eleva a la clave privada <b>d = ' + estado.clavePrivada.d + '</b> y se toma módulo <b>n = ' + estado.clavePrivada.n + '</b>; eso es <code>m = c<sup>d</sup> mod n</code>. El resultado es el <b>código</b> del carácter, que volvemos a convertir en su letra:</div>' +
    '<div class="desc-ops" id="descLive"></div>' +
    '<div id="cajaRecuperado"></div>';
}

export function htmlPasoComparacion(){
  const original = estado.msg;
  const recuperado = estado.textoRecuperado;
  const coinciden = original === recuperado;
  let h =
    '<div class="comparacion">' +
      '<div class="fila-comp"><div class="rotulo">Mensaje original</div><div class="valor">' + esc(original) + '</div></div>' +
      '<div class="fila-comp recuperado"><div class="rotulo">Texto recuperado</div><div class="valor">' + esc(recuperado) + '</div></div>' +
    '</div>';
  if(coinciden){
    h += '<div class="sello-ok">¡Coinciden! Recuperaste el mensaje original.</div>';
  } else {
    h += '<div class="nota"><span></span><span>El texto recuperado no coincide con el original. Revisa que hayas colocado bien el mensaje cifrado.</span></div>';
  }
  h += '<div class="expli">Cifraste con la clave <b>pública</b> (' + estado.clavePublica.e + ', ' + estado.clavePublica.n + ') y solo la clave <b>privada</b> (' + estado.clavePrivada.d + ', ' + estado.clavePrivada.n + ') pudo recuperar el texto. Esa es la idea central de RSA.</div>';
  return h;
}
