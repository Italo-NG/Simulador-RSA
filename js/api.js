import { API_CIFRAR_RSA } from "./config.js";

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
    throw new Error("No se pudo conectar con el backend");
  }
  if(!resp.ok) throw new Error("El backend respondió " + resp.status);
  return resp.json();
}
