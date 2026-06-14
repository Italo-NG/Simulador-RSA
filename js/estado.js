export const estado = {
  p: null, q: null, msg: "",
  n: null, phi: null,
  posiblesD: [],
  dElegido: null,
  e: null,
  clavePublica: null,
  clavePrivada: null,
  numerosCifrados: [],
  textoDescifrado: "",
  advertencia: null
};

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
