import { OlaFisica } from "./animaciones/olaFisica.js";

export { sacudir, efectoPop } from "./animaciones/efectosUI.js";

export function reproducirOla(cb){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){ cb(); return; }
  let llamado = false;
  const cubrir = () => { if(!llamado){ llamado = true; cb(); } };
  OlaFisica.play(cubrir);
  setTimeout(cubrir, 1800);
  setTimeout(() => OlaFisica.stop(), 5600);
}
