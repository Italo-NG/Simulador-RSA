import {
  htmlPasoMensajeCifrado,
  htmlPasoClavePrivada,
  htmlPasoDescifrando,
  htmlPasoComparacion
} from "./plantillasDescifradoRSA.js";
import { activarColocarCifrado, activarComprobacionClave, animarDescifrado } from "./accionesDescifradoRSA.js";

export function crearPasosDescifradoRSA(){
  return [
    {
      eti: "Descifrado · Paso 1 El mensaje cifrado",
      sigLabel: "Usar este mensaje cifrado",
      sigCls: "btn-cifrar",
      html: htmlPasoMensajeCifrado,
      despues: activarColocarCifrado
    },
    {
      eti: "Descifrado · Paso 2 Tu clave privada",
      sigLabel: "Comprobar y descifrar",
      sigCls: "btn-cifrar",
      html: htmlPasoClavePrivada,
      despues: activarComprobacionClave
    },
    {
      eti: "Descifrado · Paso 3 Letra por letra",
      html: htmlPasoDescifrando,
      despues: animarDescifrado
    },
    {
      eti: "Descifrado · Paso 4 ¡Mensaje recuperado!",
      html: htmlPasoComparacion
    }
  ];
}
