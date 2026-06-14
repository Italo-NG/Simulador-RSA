// Configuración general del frontend.
// Aquí va la URL del backend, que es la fuente real de TODA la lógica RSA.
const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://simulador-rsa.onrender.com";

export const API_CIFRAR_RSA = `${API_BASE_URL}/api/cifrarMensajeRSA`;
