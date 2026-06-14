import { texto, resultado, $ } from "./dom.js";
import { crearPasosRSA } from "./rsa/pasosRSA.js";

let pasos = [], idx = 0;

export function construirPasos(){
  pasos = crearPasosRSA();
}

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
    sig.innerHTML = "Nuevo mensaje";
    sig.onclick = reiniciar;
  } else {
    sig.className = "btn " + (def.sigCls || "btn-sig");
    sig.innerHTML = def.sigLabel || "Siguiente";
    sig.onclick = () => irA(i+1);
  }

  if(def.despues) def.despues();
}

function reiniciar(){
  resultado.classList.remove("abierto");
  document.body.classList.remove("modo-resultado");
  window.scrollTo({ top:0, behavior:"smooth" });
  setTimeout(()=>texto.focus(), 400);
}
