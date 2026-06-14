// Selección de elementos del DOM y pequeñas ayudas para leer inputs.
// Aquí NO hay lógica RSA ni llamadas al backend: solo acceso a la página.

// Atajo para buscar un elemento por id (útil también para los elementos
// que se crean dinámicamente dentro de la tarjeta de resultado).
export const $ = id => document.getElementById(id);

// Elementos fijos de la página (existen desde que carga el HTML).
export const texto     = $("texto");
export const numeroP   = $("numeroP");
export const numeroQ   = $("numeroQ");
export const enviar    = $("enviar");
export const resultado = $("resultado");
export const tarjeta   = $("tarjeta");
export const burbujaP  = $("burbujaP");
export const burbujaQ  = $("burbujaQ");
export const estadoP   = $("estadoP");
export const estadoQ   = $("estadoQ");

// Lee el valor de un input como número entero.
export function leerEntero(input){
  return parseInt(input.value, 10);
}

// Escapa texto para insertarlo de forma segura dentro de innerHTML.
export function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
