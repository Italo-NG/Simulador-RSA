// Animaciones visuales del simulador.
// Incluye el motor de física de la "ola de mar" (canvas) que cubre la pantalla
// en la transición, y dos efectos pequeños (sacudir y pop) para las burbujas.
// Aquí NO hay lógica RSA ni llamadas al backend: todo es presentación.

// ----------------- motor de física de la ola (privado del módulo) -----------------
let cv, ctx, W=0, H=0, dpr=1, raf=0, last=0, running=false;
let cols=[], N=0, foam=[];
let front=0, vfront=0, bodyX=0, vbody=0, phase="idle", covered=false, onCover=null, tphase=0, t=0;
let usingTimer=false, started=false;
const AGUA="#2f9bf0", ESPUMA="#f4fbff", ESPUMA2="#bfe4ff";

function resize(){
  dpr = Math.min(window.devicePixelRatio||1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
  cv.style.width = W+"px"; cv.style.height = H+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const nn = Math.max(48, Math.round(H/13));
  if(nn !== N){ N = nn; cols = []; for(let i=0;i<N;i++) cols.push({h:0,v:0}); }
}

// ondulación ambiental: suma de senos viajando por el borde (agua siempre viva)
function ambient(i){
  const y = i/N;
  return Math.sin(y*7.5 + t*1.7)*15 + Math.sin(y*3.1 - t*1.15)*22 + Math.sin(y*13.0 + t*2.4)*7;
}
function edgeX(i){ return bodyX + front + cols[i].h + ambient(i); }
function leftX(i){
  if(phase === "exit") return bodyX + Math.sin(i/N*9 + t*2.2)*12;
  return -8; // antes de drenar, el borde izquierdo cubre fuera de pantalla
}

// ecuación de ondas 1D: cada columna empuja a sus vecinas y vuelve al reposo
function stepCols(){
  const tension=0.22, spring=0.006, damp=0.977;
  for(let i=0;i<N;i++){
    const l = cols[i-1] ? cols[i-1].h : cols[i].h;
    const r = cols[i+1] ? cols[i+1].h : cols[i].h;
    cols[i].v += (l + r - 2*cols[i].h)*tension - cols[i].h*spring;
    cols[i].v *= damp;
  }
  for(let i=0;i<N;i++) cols[i].h += cols[i].v;
}

// golpe contra la pared: inyecta energía a la superficie + salpica espuma
function splash(strength){
  for(let i=0;i<N;i++) cols[i].v += strength*(0.55 + 0.45*Math.sin(i*0.6));
  for(let k=0;k<6;k++){
    const c = (Math.random()*N)|0, s = strength*(1.4 + Math.random()*1.4);
    for(let d=-3; d<=3; d++){ if(cols[c+d]) cols[c+d].v += s*(1 - Math.abs(d)/4); }
  }
  for(let i=0;i<N;i+=2){
    const y = (i/(N-1))*H, ex = edgeX(i);
    for(let k=0;k<3;k++){
      foam.push({ x:ex+Math.random()*16, y:y+(Math.random()-0.5)*22,
        vx:140+Math.random()*260, vy:-200-Math.random()*280,
        r:2+Math.random()*5, life:1, max:0.6+Math.random()*0.7 });
    }
  }
}

function spawnAmbientFoam(){
  if(phase==="idle" || phase==="done") return;
  for(let n=0;n<2;n++){
    const i = (Math.random()*N)|0;
    foam.push({ x:edgeX(i), y:(i/(N-1))*H, vx:8+Math.random()*36, vy:(Math.random()-0.5)*70,
      r:1.5+Math.random()*3.5, life:1, max:0.4+Math.random()*0.5 });
  }
}

function stepFoam(dt){
  const g = 950;
  for(const p of foam){ p.vy += g*dt; p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt/p.max; }
  foam = foam.filter(p => p.life>0 && p.y < H+50);
  if(foam.length > 520) foam.splice(0, foam.length-520);
}

function draw(){
  ctx.clearRect(0,0,W,H);
  // cuerpo de agua
  ctx.beginPath();
  ctx.moveTo(leftX(0), -2);
  ctx.lineTo(edgeX(0), -2);
  for(let i=0;i<N;i++) ctx.lineTo(edgeX(i), (i/(N-1))*H);
  ctx.lineTo(edgeX(N-1), H+2);
  for(let i=N-1;i>=0;i--) ctx.lineTo(leftX(i), (i/(N-1))*H);
  ctx.closePath();
  ctx.fillStyle = AGUA; ctx.fill();
  // cresta de espuma siguiendo el borde
  ctx.beginPath();
  ctx.moveTo(edgeX(0), 0);
  for(let i=1;i<N;i++) ctx.lineTo(edgeX(i), (i/(N-1))*H);
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.lineWidth = 11; ctx.strokeStyle = ESPUMA2; ctx.stroke();
  ctx.lineWidth = 5;  ctx.strokeStyle = ESPUMA;  ctx.stroke();
  // burbujas de espuma
  ctx.fillStyle = ESPUMA;
  for(const p of foam){
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function tick(ts){
  if(!running) return;
  if(!last) last = ts;
  let dt = (ts-last)/1000; last = ts; if(dt > 0.033) dt = 0.033;
  step(dt);
  nextFrame();
}

// un paso de simulación + dibujo (dt en segundos)
function step(dt){
  t += dt; tphase += dt;

  if(phase === "in"){                       // entra con inercia, acelerando
    vfront += 2.3*W*dt; front += vfront*dt;
    if(!covered && front >= W){ covered = true; onCover && onCover(); }
    if(front >= W*1.06){ phase="slosh"; tphase=0; vfront = -Math.abs(vfront)*0.42; splash(9.5); }
  } else if(phase === "slosh"){             // chapotea: resorte amortiguado contra la pared
    vfront += (W*1.0 - front)*95*dt;
    vfront *= Math.exp(-2.7*dt);
    front += vfront*dt;
    if(!covered && front >= W){ covered = true; onCover && onCover(); }
    if(tphase > 1.5){ phase="exit"; tphase=0; vbody = 0.22*W; }
  } else if(phase === "exit"){              // drena hacia la derecha
    vbody += 2.6*W*dt; bodyX += vbody*dt;
    if(bodyX >= W*1.25){ phase="done"; stop(); return; }
  }

  stepCols(); spawnAmbientFoam(); stepFoam(dt); draw();
}

// programa el siguiente cuadro: rAF cuando la pestaña está visible;
// si rAF está pausado/estrangulado, cae a un temporizador para no congelarse
function nextFrame(){
  if(!running) return;
  raf = usingTimer ? setTimeout(()=>tick(performance.now()), 16)
                   : requestAnimationFrame(tick);
}

function start(){
  running = true; last = 0; started = false; usingTimer = false;
  raf = requestAnimationFrame((ts)=>{ started = true; tick(ts); });
  // watchdog: si rAF no dispara pronto, usa temporizador de respaldo
  setTimeout(() => {
    if(running && !started){ usingTimer = true; tick(performance.now()); }
  }, 120);
}
function stop(){
  running = false;
  if(raf){ cancelAnimationFrame(raf); clearTimeout(raf); }
  raf = 0;
  if(cv) cv.style.display = "none";
  foam.length = 0;
}

// Objeto interno que arranca/detiene la ola.
const OlaFisica = {
  play(coverCb){
    cv = document.getElementById("olaCanvas");
    if(!cv){ coverCb && coverCb(); return; }
    ctx = cv.getContext("2d");
    resize();
    for(let i=0;i<N;i++){ cols[i].h = 0; cols[i].v = 0; }
    foam.length = 0;
    front = -0.18*W; vfront = 0.12*W; bodyX = 0; vbody = 0;
    phase = "in"; covered = false; tphase = 0; t = 0; onCover = coverCb;
    cv.style.display = "block";
    start();
  },
  stop
};
window.addEventListener("resize", () => { if(running) resize(); });

// ----------------- API pública de animaciones -----------------

// Reproduce la transición de la ola y llama a cb() cuando la pantalla queda
// cubierta. Respeta "prefers-reduced-motion": si el usuario lo pide, salta la
// animación y ejecuta cb() directamente.
export function reproducirOla(cb){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){ cb(); return; }
  let llamado = false;
  const cubrir = () => { if(!llamado){ llamado = true; cb(); } };
  OlaFisica.play(cubrir);
  setTimeout(cubrir, 1800);              // seguridad: prepara el resultado aunque algo falle
  setTimeout(() => OlaFisica.stop(), 5600);  // seguridad: oculta el canvas
}

// Sacude un elemento (p. ej. una burbuja con número inválido).
export function sacudir(el){
  el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude");
}

// Efecto "pop" al confirmar que un número es primo.
export function efectoPop(el){
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
}
