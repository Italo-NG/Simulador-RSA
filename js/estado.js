// Estado simple de la aplicación: los datos del último cálculo del backend.
// Es un único objeto que se va rellenando. Aquí NO hay lógica visual ni
// llamadas al backend; solo guardamos lo que el backend ya calculó.

export const estado = {
  p: null, q: null, msg: "",
  n: null, phi: null,
  posiblesD: [],
  dElegido: null,
  e: null,
  clavePublica: null,   // { e, n }
  clavePrivada: null,   // { d, n }
  numerosCifrados: [],
  textoDescifrado: "",
  advertencia: null
};

// Copia al objeto `estado` la respuesta del backend.
// Se usa tanto en el primer cifrado como cuando el usuario elige otro d.
export function guardarResultado(p, q, msg, datos){
  const r = datos.datosRSA;
  estado.p = p;
  estado.q = q;
  estado.msg = msg;
  estado.n = r.n;
  estado.phi = r.phi;
  estado.posiblesD = r.posiblesD;
  estado.dElegido = r.d;
  estado.e = r.e;
  estado.clavePublica = r.clavePublica;
  estado.clavePrivada = r.clavePrivada;
  estado.numerosCifrados = datos.numerosCifrados;
  estado.textoDescifrado = datos.textoDescifrado;
  estado.advertencia = datos.advertencia;
}
