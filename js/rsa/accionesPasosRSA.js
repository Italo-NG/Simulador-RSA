import { estado, guardarResultado } from "../estado.js";
import { $ } from "../dom.js";
import { pedirCifradoRSA } from "../api.js";
import { mostrarError, descifrar } from "../renderResultados.js";

export function activarSeleccionD(){
  document.querySelectorAll('#chipsD .chip-d').forEach(ch => {
    ch.onclick = async () => {
      const nuevoD = parseInt(ch.dataset.d, 10);
      if(nuevoD === estado.dElegido) return;
      document.querySelectorAll('#chipsD .chip-d').forEach(c => c.classList.remove('sel'));
      ch.classList.add('sel');
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

export function animarCifrado(){
  if(estado.msg.trim() === "") return;
  const cont = $("cifLive");
  const numeros = estado.numerosCifrados;
  let i = 0;
  (function paso(){
    if(i >= numeros.length){
      const b = $("btnDescifrar");
      if(!b) return;
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
