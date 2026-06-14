// Conexión con el backend (la fuente real de la lógica RSA).
// Este archivo solo se encarga del fetch; no calcula nada de RSA.
import { API_CIFRAR_RSA } from "./config.js";

// Pide al backend las claves y el cifrado del mensaje.
// d es opcional: si el usuario elige otra clave d, se la enviamos para que el
// backend recalcule e y vuelva a cifrar.
export async function pedirCifradoRSA(primerNumero, segundoNumero, mensaje, d){
  let resp;
  try {
    resp = await fetch(API_CIFRAR_RSA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        primerNumero: primerNumero,
        segundoNumero: segundoNumero,
        mensaje: mensaje,
        d: d ?? null
      })
    });
  } catch(err){
    // Error de red: lo más probable es que el backend esté apagado.
    throw new Error("No se pudo conectar con el backend");
  }
  if(!resp.ok) throw new Error("El backend respondió " + resp.status);
  return resp.json();
}
