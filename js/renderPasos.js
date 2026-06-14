// Render del paso a paso educativo y navegación entre pasos.
// Los valores (n, φ(n), claves, números cifrados…) vienen del backend; aquí
// solo se pintan. La única llamada al backend es para recalcular cuando el
// usuario elige otro valor de d.
import { estado, guardarResultado } from "./estado.js";
import { $, esc, texto, resultado } from "./dom.js";
import { pedirCifradoRSA } from "./api.js";
import { mostrarError, descifrar } from "./renderResultados.js";

// Estado interno de la navegación: la lista de pasos y el paso actual.
let pasos = [], idx = 0;

// Define los pasos del recorrido a partir de los datos guardados en `estado`.
export function construirPasos(){
  pasos = [
    { // 0 · validación
      eti: "Paso 1 · Comprobar primos",
      html: () =>
        '<div class="formulota"><b>' + estado.p + '</b> &nbsp;y&nbsp; <b>' + estado.q + '</b> &nbsp; <span class="res">✓ primos</span></div>' +
        '<div class="expli">El backend confirmó que los dos números son primos, así que podemos seguir con RSA. ¡Dale a <b>Siguiente</b>!</div>'
    },
    { // 1 · n
      eti: "Paso 2 · Calcular n",
      html: () =>
        '<div class="formulota">n = p × q = ' + estado.p + ' × ' + estado.q + ' = <span class="res">' + estado.n + '</span></div>' +
        '<div class="expli">n es el <b>módulo</b>: forma parte tanto de la clave pública como de la privada.</div>'
    },
    { // 2 · phi
      eti: "Paso 3 · Calcular φ(n)",
      html: () =>
        '<div class="formulota">φ(n) = (p−1)(q−1) = (' + (estado.p-1) + ')(' + (estado.q-1) + ') = <span class="res">' + estado.phi + '</span></div>' +
        '<div class="expli">φ(n) es la <b>función de Euler</b>. Con ella el backend encuentra las claves d y e.</div>'
    },
    { // 3 · elegir d  (INTERACTIVO · cada cambio lo recalcula el backend)
      eti: "Paso 4 · Elige tú la clave d",
      sigLabel: "Usar este d ▶",
      html: () =>
        '<div class="expli">Tú decides el valor de <b>d</b>. Sirve cualquiera que sea <b>coprimo con φ(n) = ' + estado.phi + '</b> (es decir, mcd = 1). 👇 Toca uno:</div>' +
        '<div class="chips-d" id="chipsD">' +
          estado.posiblesD.slice(0, 18).map(d => '<button class="chip-d' + (d===estado.dElegido?' sel':'') + '" data-d="' + d + '">' + d + '</button>').join('') +
        '</div>' +
        '<div class="expli">Elegiste <b>d = <span id="dVal">' + estado.dElegido + '</span></b>. Prueba con otro y el backend recalculará e y el cifrado.</div>',
      despues: () => {
        document.querySelectorAll('#chipsD .chip-d').forEach(ch => {
          ch.onclick = async () => {
            const nuevoD = parseInt(ch.dataset.d, 10);
            if(nuevoD === estado.dElegido) return;
            document.querySelectorAll('#chipsD .chip-d').forEach(c => c.classList.remove('sel'));
            ch.classList.add('sel');
            // el backend recalcula e y vuelve a cifrar con el nuevo d
            try {
              const datos = await pedirCifradoRSA(estado.p, estado.q, estado.msg, nuevoD);
              if(datos.procesoCorrecto){
                guardarResultado(estado.p, estado.q, estado.msg, datos);
                $("dVal").textContent = estado.dElegido;
              }
            } catch(err){
              mostrarError("No se pudo conectar con el backend",
                "Ejecuta primero:  uvicorn backend.main:app --reload");
            }
          };
        });
      }
    },
    { // 4 · calcular e (lo calculó el backend)
      eti: "Paso 5 · Calcular e",
      html: () =>
        '<div class="expli">El backend busca <b>e</b> tal que <code>(e × d) mod φ(n) = 1</code>. Es el "inverso" de d.</div>' +
        '<div class="formulota" style="margin-top:14px">(<span class="res">' + estado.e + '</span> × ' + estado.dElegido + ') mod ' + estado.phi + ' = 1</div>' +
        '<div class="expli">Con d = ' + estado.dElegido + ' obtenemos <b>e = ' + estado.e + '</b>. ¡Ya tenemos las dos piezas!</div>'
    },
    { // 5 · claves
      eti: "Paso 6 · Tus dos claves",
      sigLabel: "Cifrar mensaje ✨",
      sigCls: "btn-cifrar",
      html: () =>
        '<div class="claves">' +
          '<div class="clave publica"><div class="nombre">🔓 Clave pública (e, n)</div><div class="par">(' + estado.clavePublica.e + ', ' + estado.clavePublica.n + ')</div></div>' +
          '<div class="clave privada"><div class="nombre">🔑 Clave privada (d, n)</div><div class="par">(' + estado.clavePrivada.d + ', ' + estado.clavePrivada.n + ')</div></div>' +
        '</div>' +
        '<div class="expli">La <b>pública</b> cifra y puedes compartirla con todos. La <b>privada</b> descifra y se mantiene en secreto.</div>'
    },
    { // 6 · cifrar (animado con los números del backend) + descifrar
      eti: "Paso 7 · Cifrando el mensaje",
      html: () => {
        if(estado.msg.trim() === ""){
          return '<div class="nota"><span>💡</span><span>No escribiste ningún mensaje arriba. Pulsa <b>↺ Nuevo mensaje</b>, escribe algo en el chat y vuelve a empezar para verlo cifrarse letra por letra.</span></div>';
        }
        let h =
          '<div class="expli">Cada letra de «<b>' + esc(estado.msg) + '</b>» se convierte en un número con <code>c = m<sup>' + estado.e + '</sup> mod ' + estado.n + '</code>:</div>' +
          '<div class="cif-live" id="cifLive"></div>' +
          '<button class="btn-descifrar" id="btnDescifrar">🔓 Descifrar para comprobar</button>' +
          '<div id="cajaDesc"></div>';
        if(estado.advertencia){
          h += '<div class="nota"><span>⚠️</span><span>' + esc(estado.advertencia) + '</span></div>';
        }
        return h;
      },
      despues: () => {
        if(estado.msg.trim() === "") return;
        const cont = $("cifLive");
        const numeros = estado.numerosCifrados;   // ya cifrados por el backend
        let i = 0;
        (function paso(){
          if(i >= numeros.length){
            const b = $("btnDescifrar");
            b.style.display = "inline-flex";
            b.onclick = descifrar;
            return;
          }
          const sp = document.createElement("span");
          sp.className = "chip-cif entra-cif";
          sp.textContent = numeros[i];
          cont.appendChild(sp);
          i++;
          setTimeout(paso, 240);
        })();
      }
    }
  ];
}

// Muestra el paso i: pinta su contenido, actualiza la barra de progreso y
// configura los botones Atrás/Siguiente.
export function irA(i){
  idx = i;
  const def = pasos[i];
  if(def.antes) def.antes();

  const panel = $("pasoPanel");
  panel.innerHTML = '<div class="paso-eti">' + def.eti + '</div>' + def.html();
  panel.classList.remove("paso-panel"); void panel.offsetWidth; panel.classList.add("paso-panel");

  $("progFill").style.width = ((i+1)/pasos.length*100) + "%";
  $("progCont").textContent = "Paso " + (i+1) + " de " + pasos.length;

  const atras = $("btnAtras"), sig = $("btnSig");
  atras.disabled = (i === 0);
  atras.onclick = () => { if(idx > 0) irA(idx-1); };

  if(i === pasos.length - 1){
    sig.className = "btn btn-sig";
    sig.innerHTML = "↺ Nuevo mensaje";
    sig.onclick = reiniciar;
  } else {
    sig.className = "btn " + (def.sigCls || "btn-sig");
    sig.innerHTML = def.sigLabel || "Siguiente ▶";
    sig.onclick = () => irA(i+1);
  }

  if(def.despues) def.despues();
}

// Cierra el recorrido y vuelve a la pantalla inicial (título, chat y burbujas).
// Solo se usa dentro de este módulo (lo llama irA en el último paso).
function reiniciar(){
  resultado.classList.remove("abierto");
  document.body.classList.remove("modo-resultado");
  window.scrollTo({ top:0, behavior:"smooth" });
  setTimeout(()=>texto.focus(), 400);
}
