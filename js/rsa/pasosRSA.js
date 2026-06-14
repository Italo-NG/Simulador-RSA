import {
  htmlPasoPrimos,
  htmlPasoN,
  htmlPasoPhi,
  htmlPasoElegirD,
  htmlPasoE,
  htmlPasoClaves,
  htmlPasoCifrado
} from "./plantillasPasosRSA.js";
import { activarSeleccionD, animarCifrado } from "./accionesPasosRSA.js";

export function crearPasosRSA(){
  return [
    {
      eti: "Paso 1 Comprobar primos",
      html: htmlPasoPrimos
    },
    {
      eti: "Paso 2 Calcular n",
      html: htmlPasoN
    },
    {
      eti: "Paso 3 Calcular φ(n)",
      html: htmlPasoPhi
    },
    {
      eti: "Paso 4 Elige tú la clave d",
      sigLabel: "Usar este d",
      html: htmlPasoElegirD,
      despues: activarSeleccionD
    },
    {
      eti: "Paso 5 Calcular e",
      html: htmlPasoE
    },
    {
      eti: "Paso 6 Tus dos claves",
      sigLabel: "Cifrar mensaje",
      sigCls: "btn-cifrar",
      html: htmlPasoClaves
    },
    {
      eti: "Paso 7 Cifrando el mensaje",
      html: htmlPasoCifrado,
      despues: animarCifrado
    }
  ];
}
