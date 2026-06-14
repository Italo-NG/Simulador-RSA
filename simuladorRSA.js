(function(){
  "use strict";
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

  window.OlaFisica = {
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
})();


(function(){
  "use strict";

  // ----------- utilidades del frontend (NO son la lógica RSA) -----------
  // esPrimo() es SOLO una ayuda visual en vivo mientras se escribe en las burbujas.
  // La validación real de primos y TODA la matemática RSA las hace el backend (Python).
  function esPrimo(n){
    if(!Number.isInteger(n) || n < 2) return false;
    if(n < 4) return true;
    if(n % 2 === 0) return false;
    for(let i=3; i*i<=n; i+=2){ if(n%i===0) return false; }
    return true;
  }
  function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // ----------- conexión con el backend (fuente real de la lógica RSA) -----------
  const API = "http://127.0.0.1:8000/api/cifrarMensajeRSA";

  // Pide al backend las claves y el cifrado del mensaje.
  // d es opcional: si el usuario elige otra clave d, se la enviamos para que el
  // backend recalcule e y vuelva a cifrar.
  async function pedirCifrado(p, q, mensaje, d){
    const resp = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primerNumero: p, segundoNumero: q, mensaje: mensaje, d: d ?? null })
    });
    if(!resp.ok) throw new Error("El backend respondió " + resp.status);
    return resp.json();
  }

  // ----------- referencias DOM -----------
  const $ = id => document.getElementById(id);
  const texto = $("texto"), numeroP = $("numeroP"), numeroQ = $("numeroQ");
  const enviar = $("enviar"), resultado = $("resultado"), tarjeta = $("tarjeta");

  // ----------- indicador de primo en vivo (solo ayuda visual del frontend) -----------
  function actualizarPrimo(input, estadoEl, burbuja){
    const v = input.value.trim();
    if(v === ""){ estadoEl.className = "estado-primo"; estadoEl.innerHTML=""; return; }
    const n = parseInt(v,10);
    if(esPrimo(n)){
      estadoEl.className = "estado-primo ver ok";
      estadoEl.innerHTML = '<span class="ficha">✓</span> ¡es primo!';
      burbuja.classList.remove("pop"); void burbuja.offsetWidth; burbuja.classList.add("pop");
    } else {
      estadoEl.className = "estado-primo ver mal";
      estadoEl.innerHTML = '<span class="ficha">✕</span> no es primo';
    }
  }
  numeroP.addEventListener("input", ()=>actualizarPrimo(numeroP,$("estadoP"),$("burbujaP")));
  numeroQ.addEventListener("input", ()=>actualizarPrimo(numeroQ,$("estadoQ"),$("burbujaQ")));

  // enter para empezar
  [texto,numeroP,numeroQ].forEach(el=>{
    el.addEventListener("keydown", e=>{ if(e.key==="Enter") empezar(); });
  });
  enviar.addEventListener("click", empezar);

  function sacudir(el){ el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude"); }

  // ----------- transición de ola de mar (motor de física) -----------
  function reproducirOla(cb){
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce || !window.OlaFisica){ cb(); return; }
    let llamado = false;
    const cubrir = () => { if(!llamado){ llamado = true; cb(); } };
    window.OlaFisica.play(cubrir);
    setTimeout(cubrir, 1800);            // seguridad: prepara el resultado aunque algo falle
    setTimeout(() => window.OlaFisica.stop(), 5600);  // seguridad: oculta el canvas
  }

  function abrirCarta(){
    resultado.classList.remove("abierto"); void resultado.offsetWidth;
    resultado.classList.add("abierto");
  }
  function mostrarError(titulo, detalle){
    tarjeta.className = "tarjeta error";
    tarjeta.innerHTML =
      '<div class="res-cabecera bad"><div class="icono">!</div>' +
      '<div><h2>' + esc(titulo) + '</h2><p>' + esc(detalle) + '</p></div></div>';
    abrirCarta();
  }

  // ----------- estado del recorrido guiado (se llena con datos del backend) -----------
  let S = null, pasos = [], idx = 0;

  // Sacude la burbuja del número que no es primo, según la validación del backend
  function sacudirSegunValidacion(datosRSA){
    const v = datosRSA && datosRSA.validacion;
    if(v && (!v.primerNumeroEsPrimo || !v.segundoNumeroEsPrimo)){
      if(!v.primerNumeroEsPrimo) sacudir($("burbujaP"));
      if(!v.segundoNumeroEsPrimo) sacudir($("burbujaQ"));
    } else {
      sacudir($("burbujaP")); sacudir($("burbujaQ"));
    }
  }

  // Arma el estado S a partir de la respuesta del backend
  function construirEstado(p, q, msg, datos){
    const r = datos.datosRSA;
    return {
      p: p, q: q, msg: msg,
      n: r.n, phi: r.phi,
      posiblesD: r.posiblesD,
      dElegido: r.d,
      e: r.e,
      clavePublica: r.clavePublica,   // { e, n }
      clavePrivada: r.clavePrivada,   // { d, n }
      numerosCifrados: datos.numerosCifrados,
      textoDescifrado: datos.textoDescifrado,
      advertencia: datos.advertencia
    };
  }

  // ----------- al pulsar enviar -----------
  async function empezar(){
    const p = parseInt(numeroP.value,10);
    const q = parseInt(numeroQ.value,10);
    const msg = texto.value;

    // El frontend solo valida campos vacíos. La validación de primos y toda
    // la matemática RSA vienen del backend.
    if(!numeroP.value.trim() || !numeroQ.value.trim()){
      sacudir($("burbujaP")); sacudir($("burbujaQ"));
      return mostrarError("Faltan números","Escribe los dos números primos en las burbujas para continuar.");
    }

    let datos;
    try {
      datos = await pedirCifrado(p, q, msg, null);
    } catch(err){
      return mostrarError("No se pudo conectar con el backend",
        "Ejecuta primero:  uvicorn backend.main:app --reload");
    }

    // El backend decide si los números son válidos (primos, distintos, etc.)
    if(!datos.procesoCorrecto){
      sacudirSegunValidacion(datos.datosRSA);
      return mostrarError("No se puede continuar con RSA", datos.mensaje);
    }

    S = construirEstado(p, q, msg, datos);
    const arrancar = () => {
      document.body.classList.add("modo-resultado");  // oculta título, chat y burbujas
      construirPasos();
      armarCarta();
      irA(0);
      window.scrollTo(0, 0);
    };
    reproducirOla(arrancar);
  }

  // ----------- definición de los pasos (los valores vienen del backend) -----------
  function construirPasos(){
    pasos = [
      { // 0 · validación
        eti: "Paso 1 · Comprobar primos",
        html: () =>
          '<div class="formulota"><b>' + S.p + '</b> &nbsp;y&nbsp; <b>' + S.q + '</b> &nbsp; <span class="res">✓ primos</span></div>' +
          '<div class="expli">El backend confirmó que los dos números son primos, así que podemos seguir con RSA. ¡Dale a <b>Siguiente</b>!</div>'
      },
      { // 1 · n
        eti: "Paso 2 · Calcular n",
        html: () =>
          '<div class="formulota">n = p × q = ' + S.p + ' × ' + S.q + ' = <span class="res">' + S.n + '</span></div>' +
          '<div class="expli">n es el <b>módulo</b>: forma parte tanto de la clave pública como de la privada.</div>'
      },
      { // 2 · phi
        eti: "Paso 3 · Calcular φ(n)",
        html: () =>
          '<div class="formulota">φ(n) = (p−1)(q−1) = (' + (S.p-1) + ')(' + (S.q-1) + ') = <span class="res">' + S.phi + '</span></div>' +
          '<div class="expli">φ(n) es la <b>función de Euler</b>. Con ella el backend encuentra las claves d y e.</div>'
      },
      { // 3 · elegir d  (INTERACTIVO · cada cambio lo recalcula el backend)
        eti: "Paso 4 · Elige tú la clave d",
        sigLabel: "Usar este d ▶",
        html: () =>
          '<div class="expli">Tú decides el valor de <b>d</b>. Sirve cualquiera que sea <b>coprimo con φ(n) = ' + S.phi + '</b> (es decir, mcd = 1). 👇 Toca uno:</div>' +
          '<div class="chips-d" id="chipsD">' +
            S.posiblesD.slice(0, 18).map(d => '<button class="chip-d' + (d===S.dElegido?' sel':'') + '" data-d="' + d + '">' + d + '</button>').join('') +
          '</div>' +
          '<div class="expli">Elegiste <b>d = <span id="dVal">' + S.dElegido + '</span></b>. Prueba con otro y el backend recalculará e y el cifrado.</div>',
        despues: () => {
          document.querySelectorAll('#chipsD .chip-d').forEach(ch => {
            ch.onclick = async () => {
              const nuevoD = parseInt(ch.dataset.d, 10);
              if(nuevoD === S.dElegido) return;
              document.querySelectorAll('#chipsD .chip-d').forEach(c => c.classList.remove('sel'));
              ch.classList.add('sel');
              // el backend recalcula e y vuelve a cifrar con el nuevo d
              try {
                const datos = await pedirCifrado(S.p, S.q, S.msg, nuevoD);
                if(datos.procesoCorrecto){
                  S.dElegido = datos.datosRSA.d;
                  S.e = datos.datosRSA.e;
                  S.clavePublica = datos.datosRSA.clavePublica;
                  S.clavePrivada = datos.datosRSA.clavePrivada;
                  S.numerosCifrados = datos.numerosCifrados;
                  S.textoDescifrado = datos.textoDescifrado;
                  S.advertencia = datos.advertencia;
                  $("dVal").textContent = S.dElegido;
                }
              } catch(err){
                mostrarError("No se pudo conectar con el backend",
                  "Ejecuta primero:  uvicorn backend.main:app --reload");
              }
            };
          });
        }
      },
      { // 4 · calcular e (lo calculó el backend)
        eti: "Paso 5 · Calcular e",
        html: () =>
          '<div class="expli">El backend busca <b>e</b> tal que <code>(e × d) mod φ(n) = 1</code>. Es el "inverso" de d.</div>' +
          '<div class="formulota" style="margin-top:14px">(<span class="res">' + S.e + '</span> × ' + S.dElegido + ') mod ' + S.phi + ' = 1</div>' +
          '<div class="expli">Con d = ' + S.dElegido + ' obtenemos <b>e = ' + S.e + '</b>. ¡Ya tenemos las dos piezas!</div>'
      },
      { // 5 · claves
        eti: "Paso 6 · Tus dos claves",
        sigLabel: "Cifrar mensaje ✨",
        sigCls: "btn-cifrar",
        html: () =>
          '<div class="claves">' +
            '<div class="clave publica"><div class="nombre">🔓 Clave pública (e, n)</div><div class="par">(' + S.clavePublica.e + ', ' + S.clavePublica.n + ')</div></div>' +
            '<div class="clave privada"><div class="nombre">🔑 Clave privada (d, n)</div><div class="par">(' + S.clavePrivada.d + ', ' + S.clavePrivada.n + ')</div></div>' +
          '</div>' +
          '<div class="expli">La <b>pública</b> cifra y puedes compartirla con todos. La <b>privada</b> descifra y se mantiene en secreto.</div>'
      },
      { // 6 · cifrar (animado con los números del backend) + descifrar
        eti: "Paso 7 · Cifrando el mensaje",
        html: () => {
          if(S.msg.trim() === ""){
            return '<div class="nota"><span>💡</span><span>No escribiste ningún mensaje arriba. Pulsa <b>↺ Nuevo mensaje</b>, escribe algo en el chat y vuelve a empezar para verlo cifrarse letra por letra.</span></div>';
          }
          let h =
            '<div class="expli">Cada letra de «<b>' + esc(S.msg) + '</b>» se convierte en un número con <code>c = m<sup>' + S.e + '</sup> mod ' + S.n + '</code>:</div>' +
            '<div class="cif-live" id="cifLive"></div>' +
            '<button class="btn-descifrar" id="btnDescifrar">🔓 Descifrar para comprobar</button>' +
            '<div id="cajaDesc"></div>';
          if(S.advertencia){
            h += '<div class="nota"><span>⚠️</span><span>' + esc(S.advertencia) + '</span></div>';
          }
          return h;
        },
        despues: () => {
          if(S.msg.trim() === "") return;
          const cont = $("cifLive");
          const numeros = S.numerosCifrados;   // ya cifrados por el backend
          let i = 0;
          (function paso(){
            if(i >= numeros.length){
              const b = $("btnDescifrar");
              b.style.display = "inline-flex";
              b.onclick = descifrar;
              return;
            }
            const sp = document.createElement("span");
            sp.className = "chip-cif entra-cif";
            sp.textContent = numeros[i];
            cont.appendChild(sp);
            i++;
            setTimeout(paso, 240);
          })();
        }
      }
    ];
  }

  // El texto descifrado ya viene del backend (clave privada en Python)
  function descifrar(){
    $("cajaDesc").innerHTML =
      '<div class="burbuja-ia" style="margin-top:16px">' +
        '<div class="mini">Mensaje recuperado con la clave privada (' + S.clavePrivada.d + ', ' + S.clavePrivada.n + ')</div>' +
        '<div class="texto-claro">' + esc(S.textoDescifrado) + '</div>' +
      '</div>';
    const b = $("btnDescifrar");
    if(b) b.style.display = "none";
  }

  // ----------- render de la carta y navegación -----------
  function armarCarta(){
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<div class="res-cabecera ok"><div class="icono">✓</div>' +
      '<div><h2>¡Vamos paso a paso!</h2><p>' + S.p + ' y ' + S.q + ' son primos · sigue el proceso RSA</p></div></div>' +
      '<div class="tope-paso"><span class="contador" id="progCont"></span>' +
      '<div class="barra-prog"><i id="progFill"></i></div></div>' +
      '<div id="pasoPanel"></div>' +
      '<div class="nav-pasos">' +
        '<button class="btn btn-atras" id="btnAtras">◀ Atrás</button>' +
        '<button class="btn btn-sig" id="btnSig">Siguiente ▶</button>' +
      '</div>';
    abrirCarta();
  }

  function irA(i){
    idx = i;
    const def = pasos[i];
    if(def.antes) def.antes();

    const panel = $("pasoPanel");
    panel.innerHTML = '<div class="paso-eti">' + def.eti + '</div>' + def.html();
    panel.classList.remove("paso-panel"); void panel.offsetWidth; panel.classList.add("paso-panel");

    $("progFill").style.width = ((i+1)/pasos.length*100) + "%";
    $("progCont").textContent = "Paso " + (i+1) + " de " + pasos.length;

    const atras = $("btnAtras"), sig = $("btnSig");
    atras.disabled = (i === 0);
    atras.onclick = () => { if(idx > 0) irA(idx-1); };

    if(i === pasos.length - 1){
      sig.className = "btn btn-sig";
      sig.innerHTML = "↺ Nuevo mensaje";
      sig.onclick = reiniciar;
    } else {
      sig.className = "btn " + (def.sigCls || "btn-sig");
      sig.innerHTML = def.sigLabel || "Siguiente ▶";
      sig.onclick = () => irA(i+1);
    }

    if(def.despues) def.despues();
  }

  function reiniciar(){
    resultado.classList.remove("abierto");
    document.body.classList.remove("modo-resultado");  // vuelven título, chat y burbujas
    window.scrollTo({ top:0, behavior:"smooth" });
    setTimeout(()=>texto.focus(), 400);
  }
})();
