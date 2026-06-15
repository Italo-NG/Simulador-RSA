export const $ = id => document.getElementById(id);

export const texto     = $("texto");
export const numeroP   = $("numeroP");
export const numeroQ   = $("numeroQ");
export const enviar    = $("enviar");
export const cargandoRSA = $("cargandoRSA");
export const resultado = $("resultado");
export const tarjeta   = $("tarjeta");
export const burbujaP  = $("burbujaP");
export const burbujaQ  = $("burbujaQ");
export const estadoP   = $("estadoP");
export const estadoQ   = $("estadoQ");

export function leerEntero(input){
  return parseInt(input.value, 10);
}

export function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
