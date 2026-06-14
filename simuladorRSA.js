(function(){
  "use strict";

  // ----------- utilidades matemáticas -----------
  function esPrimo(n){
    if(!Number.isInteger(n) || n < 2) return false;
    if(n < 4) return true;
    if(n % 2 === 0) return false;
    for(let i=3; i*i<=n; i+=2){ if(n%i===0) return false; }
    return true;
  }
  function mcd(a,b){ while(b!==0){ [a,b]=[b,a%b]; } return a; }
  function modpow(base, exp, mod){
    base = BigInt(base) % BigInt(mod);
    let r = 1n, e = BigInt(exp), m = BigInt(mod);
    if(base < 0n) base += m;
    while(e > 0n){
      if(e & 1n) r = (r*base) % m;
      e >>= 1n;
      base = (base*base) % m;
    }
    return r;
  }
  // inverso modular por euclides extendido => mismo e que el while del backend
  function inversoModular(d, phi){
    let [old_r, r] = [d, phi];
    let [old_s, s] = [1, 0];
    while(r !== 0){
      const q = Math.floor(old_r / r);
      [old_r, r] = [r, old_r - q*r];
      [old_s, s] = [s, old_s - q*s];
    }
    if(old_r !== 1) return null;
    return ((old_s % phi) + phi) % phi;
  }

  // ----------- referencias DOM -----------
  const $ = id => document.getElementById(id);
  const texto = $("texto"), numeroP = $("numeroP"), numeroQ = $("numeroQ");
  const enviar = $("enviar"), resultado = $("resultado"), tarjeta = $("tarjeta");

  // ----------- indicador de primo en vivo -----------
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

  // enter para enviar
  [texto,numeroP,numeroQ].forEach(el=>{
    el.addEventListener("keydown", e=>{ if(e.key==="Enter") cifrar(); });
  });
  enviar.addEventListener("click", cifrar);

  function sacudir(el){ el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude"); }

  function abrirTarjeta(html, esError){
    tarjeta.className = "tarjeta" + (esError ? " error" : "");
    tarjeta.innerHTML = html;
    resultado.classList.remove("abierto"); void resultado.offsetWidth;
    resultado.classList.add("abierto");
    // animación escalonada de pasos
    const items = tarjeta.querySelectorAll(".pasos li");
    items.forEach((li,i)=>{ li.style.animationDelay = (0.18 + i*0.05) + "s"; });
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // ----------- proceso RSA principal -----------
  function cifrar(){
    const p = parseInt(numeroP.value,10);
    const q = parseInt(numeroQ.value,10);
    const msg = texto.value;

    // validaciones
    if(!numeroP.value.trim() || !numeroQ.value.trim()){
      sacudir($("burbujaP")); sacudir($("burbujaQ"));
      return abrirTarjeta(tarjetaError("Faltan números","Escribe los dos números primos en las burbujas para continuar."), true);
    }
    const pOk = esPrimo(p), qOk = esPrimo(q);
    if(!pOk || !qOk){
      if(!pOk) sacudir($("burbujaP"));
      if(!qOk) sacudir($("burbujaQ"));
      const cuales = (!pOk&&!qOk) ? "Ninguno de los dos números es primo." :
                     (!pOk ? "El primer número (p) no es primo." : "El segundo número (q) no es primo.");
      return abrirTarjeta(tarjetaError("No se puede continuar con RSA",
        "Ambos números deben ser primos. " + cuales), true);
    }
    if(p === q){
      sacudir($("burbujaP")); sacudir($("burbujaQ"));
      return abrirTarjeta(tarjetaError("p y q deben ser distintos","En RSA los dos primos tienen que ser diferentes entre sí."), true);
    }

    // cálculos RSA (replican el backend)
    const n = p*q;
    const phi = (p-1)*(q-1);

    // posibles d coprimos con phi (mostramos solo los primeros)
    const posiblesD = [];
    for(let x=2; x<phi && posiblesD.length<12; x++){ if(mcd(x,phi)===1) posiblesD.push(x); }
    // d = primer coprimo (como posiblesD[0] del backend)
    let d = null;
    for(let x=2; x<phi; x++){ if(mcd(x,phi)===1){ d=x; break; } }

    if(d === null){
      return abrirTarjeta(tarjetaError("No hay clave posible","Con estos primos no existe un d válido. Prueba con otros."), true);
    }
    const e = inversoModular(d, phi);

    // cifrado del mensaje carácter por carácter: c = m^e mod n
    let cifradoHTML = "", numerosCifrados = [], descifrado = "";
    const codigos = Array.from(msg);
    const maxCod = codigos.reduce((m,ch)=>Math.max(m, ch.codePointAt(0)), 0);
    for(const ch of codigos){
      const m = ch.codePointAt(0);
      const c = modpow(m, e, n);
      numerosCifrados.push(c.toString());
      cifradoHTML += '<span>'+c.toString()+'</span>';
      // descifrado de verificación: m = c^d mod n
      const md = Number(modpow(c, d, n));
      descifrado += String.fromCodePoint(md);
    }

    // construir tarjeta de éxito
    const pasos = [
      `Se ingresaron <code>p = ${p}</code> y <code>q = ${q}</code>, ambos primos.`,
      `Se calcula <code>n = p × q = ${p} × ${q} = ${n}</code>.`,
      `Se calcula <code>φ(n) = (p−1)(q−1) = (${p-1})(${q-1}) = ${phi}</code>.`,
      `Se buscan valores coprimos con φ(n). Posibles d: <code>${posiblesD.join(", ")}${posiblesD.length>=12?"…":""}</code>.`,
      `Se selecciona <code>d = ${d}</code> (el primero coprimo con φ).`,
      `Se calcula <code>e</code> tal que <code>(e × d) mod φ = 1</code> → <code>e = ${e}</code>, porque <code>(${e} × ${d}) mod ${phi} = 1</code>.`,
      `Clave pública <code>(e, n) = (${e}, ${n})</code> y privada <code>(d, n) = (${d}, ${n})</code>.`
    ];

    let html = `
      <div class="res-cabecera ok">
        <div class="icono">✓</div>
        <div>
          <h2>¡Mensaje cifrado!</h2>
          <p>${p} y ${q} son primos · RSA aplicado correctamente</p>
        </div>
      </div>`;

    if(msg.trim() !== ""){
      html += `
      <div class="seccion-titulo">Resultado del cifrado</div>
      <div class="burbuja-ia">
        <div class="mini">RSA · texto cifrado con la clave pública (${e}, ${n})</div>
        <div class="cifrado">${cifradoHTML}</div>
        <div class="descifrado">descifrado con la clave privada → <b>${esc(descifrado)}</b></div>
      </div>`;
    } else {
      html += `<div class="nota"><span>💡</span><span>No escribiste un mensaje en el chat, así que solo generamos las <b>claves</b>. Escribe algo arriba y vuelve a darle cifrar.</span></div>`;
    }

    html += `
      <div class="seccion-titulo">Claves generadas</div>
      <div class="claves">
        <div class="clave publica"><div class="nombre">🔓 Clave pública (e, n)</div><div class="par">(${e}, ${n})</div></div>
        <div class="clave privada"><div class="nombre">🔑 Clave privada (d, n)</div><div class="par">(${d}, ${n})</div></div>
      </div>

      <div class="seccion-titulo">Valores</div>
      <div class="valores">
        <div class="valor"><div class="k">n</div><div class="n">${n}</div></div>
        <div class="valor"><div class="k">φ(n)</div><div class="n">${phi}</div></div>
        <div class="valor"><div class="k">d</div><div class="n">${d}</div></div>
        <div class="valor"><div class="k">e</div><div class="n">${e}</div></div>
      </div>

      <div class="seccion-titulo">Paso a paso</div>
      <ul class="pasos">
        ${pasos.map((t,i)=>`<li><span class="num">${i+1}</span><span>${t}</span></li>`).join("")}
      </ul>`;

    if(msg.trim() !== "" && maxCod >= n){
      html += `<div class="nota"><span>⚠️</span><span>Algunos caracteres valen más que <b>n = ${n}</b>, así que el descifrado puede no coincidir del todo. Usa primos más grandes (por ejemplo p y q de 3 cifras) para cifrar cualquier texto correctamente.</span></div>`;
    }

    abrirTarjeta(html, false);
  }

  function tarjetaError(titulo, detalle){
    return `
      <div class="res-cabecera bad">
        <div class="icono">!</div>
        <div>
          <h2>${esc(titulo)}</h2>
          <p>${esc(detalle)}</p>
        </div>
      </div>`;
  }
})();
