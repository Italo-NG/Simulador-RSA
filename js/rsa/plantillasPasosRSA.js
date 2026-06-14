import { estado } from "../estado.js";
import { esc } from "../dom.js";

export function htmlPasoPrimos(){
  return '<div class="formulota"><b>' + estado.p + '</b> &nbsp;y&nbsp; <b>' + estado.q + '</b> &nbsp; <span class="res">primos</span></div>' +
    '<div class="expli">El backend confirmó que los dos números son primos, así que podemos seguir con RSA. ¡Dale a <b>Siguiente</b>!</div>';
}

export function htmlPasoN(){
  return '<div class="formulota">n = p × q = ' + estado.p + ' × ' + estado.q + ' = <span class="res">' + estado.n + '</span></div>' +
    '<div class="expli">n es el <b>módulo</b>: forma parte tanto de la clave pública como de la privada.</div>';
}

export function htmlPasoPhi(){
  return '<div class="formulota">φ(n) = (p−1)(q−1) = (' + (estado.p-1) + ')(' + (estado.q-1) + ') = <span class="res">' + estado.phi + '</span></div>' +
    '<div class="expli">φ(n) es la <b>función de Euler</b>. Con ella el backend encuentra las claves d y e.</div>';
}

export function htmlPasoElegirD(){
  return '<div class="expli">Tú decides el valor de <b>d</b>. Sirve cualquiera que sea <b>coprimo con φ(n) = ' + estado.phi + '</b> (es decir, mcd = 1). Toca uno:</div>' +
    '<div class="chips-d" id="chipsD">' +
      estado.posiblesD.slice(0, 18).map(d => '<button class="chip-d' + (d===estado.dElegido?' sel':'') + '" data-d="' + d + '">' + d + '</button>').join('') +
    '</div>' +
    '<div class="expli">Elegiste <b>d = <span id="dVal">' + estado.dElegido + '</span></b>. Prueba con otro y el backend recalculará e y el cifrado.</div>';
}

export function htmlPasoE(){
  return '<div class="expli">El backend busca <b>e</b> tal que <code>(e × d) mod φ(n) = 1</code>. Es el "inverso" de d.</div>' +
    '<div class="formulota" style="margin-top:14px">(<span class="res">' + estado.e + '</span> × ' + estado.dElegido + ') mod ' + estado.phi + ' = 1</div>' +
    '<div class="expli">Con d = ' + estado.dElegido + ' obtenemos <b>e = ' + estado.e + '</b>. ¡Ya tenemos las dos piezas!</div>';
}

export function htmlPasoClaves(){
  return '<div class="claves">' +
      '<div class="clave publica"><div class="nombre">Clave pública (e, n)</div><div class="par">(' + estado.clavePublica.e + ', ' + estado.clavePublica.n + ')</div></div>' +
      '<div class="clave privada"><div class="nombre">Clave privada (d, n)</div><div class="par">(' + estado.clavePrivada.d + ', ' + estado.clavePrivada.n + ')</div></div>' +
    '</div>' +
    '<div class="expli">La <b>pública</b> cifra y puedes compartirla con todos. La <b>privada</b> descifra y se mantiene en secreto.</div>';
}

export function htmlPasoCifrado(){
  if(estado.msg.trim() === ""){
    return '<div class="nota"><span></span><span>No escribiste ningún mensaje arriba. Pulsa <b>Nuevo mensaje</b>, escribe algo en el chat y vuelve a empezar para verlo cifrarse letra por letra.</span></div>';
  }
  let h =
    '<div class="expli">Cada letra de «<b>' + esc(estado.msg) + '</b>» se convierte en un número con <code>c = m<sup>' + estado.e + '</sup> mod ' + estado.n + '</code>:</div>' +
    '<div class="cif-live" id="cifLive"></div>' +
    '<button class="btn-descifrar" id="btnDescifrar">Descifrar para comprobar</button>' +
    '<div id="cajaDesc"></div>';
  if(estado.advertencia){
    h += '<div class="nota"><span></span><span>' + esc(estado.advertencia) + '</span></div>';
  }
  return h;
}
