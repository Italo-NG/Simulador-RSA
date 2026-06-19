const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://simulador-rsa.onrender.com";

export const API_CIFRAR_RSA = `${API_BASE_URL}/api/cifrarMensajeRSA`;
export const API_DESCIFRAR_RSA = `${API_BASE_URL}/api/descifrarMensajeRSA`;
