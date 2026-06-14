export function esPrimo(n){
  if(!Number.isInteger(n) || n < 2) return false;
  if(n < 4) return true;
  if(n % 2 === 0) return false;
  for(let i=3; i*i<=n; i+=2){ if(n%i===0) return false; }
  return true;
}

export function camposCompletos(valorP, valorQ){
  return valorP.trim() !== "" && valorQ.trim() !== "";
}
export function primosDemasiadoPequenos(p, q){
  return esPrimo(p) && esPrimo(q) && p !== q && p * q <= 126;
}
