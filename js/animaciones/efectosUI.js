export function sacudir(el){
  el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude");
}

export function efectoPop(el){
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
}
