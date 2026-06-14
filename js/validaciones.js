// Validaciones básicas del frontend.
//
// IMPORTANTE: esto es SOLO una ayuda visual. La validación real de primos y
// TODA la matemática RSA las realiza el backend (Python). Si algo aquí no
// coincidiera con el backend, manda el backend.

// esPrimo() solo sirve para la pista en vivo (✓/✕) mientras se escribe en las burbujas.
export function esPrimo(n){
  if(!Number.isInteger(n) || n < 2) return false;
  if(n < 4) return true;
  if(n % 2 === 0) return false;
  for(let i=3; i*i<=n; i+=2){ if(n%i===0) return false; }
  return true;
}

// ¿Están escritos los dos números? (validación de campos vacíos)
export function camposCompletos(valorP, valorQ){
  return valorP.trim() !== "" && valorQ.trim() !== "";
}
