var app = document.getElementById('app'), stage = document.getElementById('stage'), tm, idle, ac, mute = false, Q = null, DONE = {}, TL = 20000, ORD = ['correo', 'tel', 'web', 'nucleo'];
function fit() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = 'scale(' + s + ')'; stage.style.left = (innerWidth - 1920 * s) / 2 + 'px'; stage.style.top = (innerHeight - 1080 * s) / 2 + 'px' }
addEventListener('resize', fit); fit();
function bump() { clearTimeout(idle); idle = setTimeout(function () { go('home') }, 120000) }
addEventListener('pointerdown', bump);
addEventListener('keydown', function (e) { bump(); var k = e.key.toLowerCase(); if (k === 'h' || k === 'escape') go('home'); else if (k >= '1' && k <= '4') go(ORD[+k - 1]); else if (k === 'm') mute = !mute });
function beep(f, d) { if (mute) return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = .07; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d) } catch (e) { } }
function burst(c) { for (var i = 0; i < 22; i++) { var p = document.createElement('div'); p.className = 'px'; p.style.cssText = 'left:960px;top:540px;background:' + c + ';--x:' + (Math.random() * 1400 - 700) + 'px;--y:' + (Math.random() * 900 - 450) + 'px'; stage.appendChild(p); setTimeout(function (n) { n.remove() }.bind(null, p), 1100) } }
var MAIL = [
    { k: 'mail', f: 'notificaciones@tubanco-seguro.co', s: 'Tu cuenta será bloqueada hoy', b: 'Hola <m>Juan Pérez</m>, detectamos un ingreso extraño. Verifica tus datos en las próximas <m>2 horas</m> o perderás el acceso.', r: 0, w: 'Usa tu nombre y mete afán: la urgencia es el gancho. Un banco real no te amenaza con bloquearte en horas.' },
    { k: 'mail', f: 'avisos@tubanco.com.co', s: 'Resumen de tu cuenta de octubre', b: 'Tu extracto ya está disponible en la app. <m>No te pediremos claves ni códigos por correo.</m> Si no reconoces un movimiento, llama a la línea que está al respaldo de tu tarjeta.', r: 1, w: 'No pide nada, no mete afán y te manda a canales que ya conoces. Lo real también puede verse aburrido.' },
    { k: 'mail', f: 'gerencia@empresa-corp.co', s: 'Urgente, necesito un favor', b: 'Estoy en reunión y no puedo llamar. Necesito que <m>compres 5 tarjetas de regalo</m> y me envíes los códigos ahora. <m>Soy tu jefe</m>, luego te reembolso.', r: 0, w: 'Se hace pasar por tu jefe y pide algo fuera de lo normal. Hoy la IA hasta copia el estilo de escritura.' },
    { k: 'mail', f: 'no-reply@entregarapida.com.co', s: 'Tu pedido #48213 va en camino', b: 'Tu paquete llegará mañana entre 8 a. m. y 12 m. Puedes seguirlo en <m>entregarapida.com.co/rastreo</m> con tu número de guía.', r: 1, w: 'El enlace coincide con el dominio de quien lo envía y no te pide pagar nada.' },
    { k: 'mail', f: 'premios@sorteo-colombia.top', s: '¡Ganaste un celular! Reclámalo', b: 'Fuiste elegido entre miles. Paga solo <m>$9.900 de envío</m> en el siguiente enlace para recibirlo. Tienes <m>30 minutos</m>.', r: 0, w: 'Un premio que no pediste y un “pequeño pago”: la forma más vieja del engaño, y sigue funcionando.' },
    { k: 'mail', f: 'soporte@tubanco.com.co', s: 'Nuevo inicio de sesión en tu cuenta', b: 'Detectamos un ingreso desde un dispositivo nuevo. Si fuiste tú, no hagas nada. Si no, <m>cambia tu clave desde la app</m>, no desde un enlace.', r: 1, w: 'No te hace dar clic en nada: te manda a la app. Esa es la señal de que es legítimo.' }];
var TEL = [
    { k: 'sms', f: '+57 300 555 0142', b: 'Tu tarjeta fue bloqueada. Ingresa a <m>bit.ly/desbloqueo-ya</m> para reactivarla.', r: 0, w: 'Un enlace acortado esconde a dónde vas. Los bancos no reactivan tarjetas por SMS.' },
    { k: 'call', f: 'Sin identificar', p: '+57 601 555 0188', b: 'Le habla de su banco. Para evitar un cobro necesitamos que nos confirme <m>el código que le llegó por mensaje</m>.', r: 0, w: 'Ningún banco real te pide un código de verificación. Ese código es la llave de tu cuenta.' },
    { k: 'sms', f: 'Mamá', b: 'Mijo, ¿llegaste bien? Llámame cuando puedas.', r: 1, w: 'Era tu mamá. Aquí no hay pista obvia: por eso toca desconfiar del contexto, no solo del número.' },
    { k: 'sms', f: '+57 320 555 0123', b: 'Hola, soy yo, cambié de número. <m>Necesito que me hagas una transferencia</m>, mañana te pago.', r: 0, w: 'Suplantan a alguien cercano. Confirma por otro medio antes de mover plata.' },
    { k: 'sms', f: '891234', b: 'Tu código de verificación es 482913. <m>No lo compartas con nadie.</m>', r: 1, w: 'Es lo contrario de un estafador: te pide NO compartirlo. Ojo si fuiste tú quien lo pidió.' },
    { k: 'call', f: 'Sin identificar', p: '+57 601 555 0199', b: 'Hola mamá, tuve un accidente y <m>necesito plata ya</m>. No me preguntes nada.', r: 0, w: 'La IA puede clonar una voz con pocos segundos de audio. Acuerden una palabra clave familiar.' }];
var WEB = [
    { k: 'web', u: 'tubanco.com.co/ingreso', t: 'Bienvenido a tu banca', b: 'Ingresa con tu usuario.', r: 1, w: 'Dominio exacto, sin palabras extra ni letras raras.' },
    { k: 'web', u: 'tubanco<m>-seguro</m>.co/ingreso', t: 'Bienvenido a tu banca', b: 'Ingresa con tu usuario.', r: 0, w: 'Las palabras como “seguro” o “oficial” en la dirección suelen ser carnada.' },
    { k: 'web', u: 'tuba<m>a</m>nco.com.co', t: 'Bienvenido a tu banca', b: 'Ingresa con tu usuario.', r: 0, w: 'Una letra de más. Está hecho para que tu ojo lo pase por alto.' },
    { k: 'web', u: '<m>tienda-ofertas.shop</m>/zapatos', t: 'Zapatillas originales -80%', b: 'Solo hoy. Quedan 3 unidades.', r: 0, w: 'Precios imposibles y urgencia. Las tiendas falsas viven de ofertas que no existen.' },
    { k: 'web', u: 'entregarapida.com.co/rastreo', t: 'Rastrea tu pedido', b: 'Escribe tu número de guía.', r: 1, w: 'Dominio coherente y no te pide datos de pago, solo la guía.' },
    { k: 'web', u: 'tubanco.com.co.<m>ingreso-app.net</m>', t: 'Bienvenido a tu banca', b: 'Ingresa con tu usuario.', r: 0, w: 'Lo que manda es lo que va justo antes de la primera barra: acá es ingreso-app.net.' }];
var ST = {
    correo: { n: 'ESTACION 1 · CORREO', q: MAIL, mid: ['36%', 'de los colombianos ha sido víctima de fraude digital en 2026. La suplantación de identidad es la modalidad más común.'], end: ['90%', 'siente que el fraude está presente en su día a día (declaración de Bancolombia, abril 2026).'] },
    tel: { n: 'ESTACION 2 · TELEFONO', q: TEL, mid: ['7.584', 'casos de smishing reportados solo en Bogotá durante 2025.'], end: ['+70%', 'es la tasa de apertura de los SMS: casi todos se leen.'] },
    web: { n: 'ESTACION 3 · WEB', q: WEB, mid: ['40%', 'de los colombianos no sabe identificar un sitio web falso (Kaspersky, marzo 2026).'], end: ['2.º', 'país de LATAM en ciberataques: 4.090 ataques semanales por organización (Check Point Research, 2026).'] }
};
function hdr(t) {
    var q = ''; if (Q && ST[Q.id]) { q = '<div class="hud"><div class="pd">' + ST[Q.id].q.map(function (_, i) { return '<i class="' + (Q.h[i] === 1 ? 'ok' : Q.h[i] === 0 ? 'no' : i === Q.i ? 'cur' : '') + '"></i>' }).join('') + '</div>' + (Q.streak > 1 ? '<div class="pill hot">RACHA ×' + Q.streak + '</div>' : '') + '<div class="pill">' + Q.score + ' ✓</div></div>' }
    return '<div class="top"><div class="tag">' + t + '</div>' + q + '<button class="btn g" onclick="go(\'home\')">Inicio</button></div>'
}
function clr() { clearInterval(tm); var o = stage.querySelector('.ov'); if (o) o.remove() }
function go(id) { clr(); if (id === 'home') { Q = null; home() } else if (id === 'nucleo') { Q = null; nucleo() } else { Q = { id: id, i: 0, score: 0, streak: 0, h: [] }; qs() } }
function home() {
    var c = [['1', 'Correo', '¿Cúal correo es real?', 'correo', ''], ['2', 'Teléfono', '¿Cuál llamada es estafa?', 'tel', ''], ['3', 'Web', '¿Real o réplica?', 'web', ''], ['★', 'Núcleo', 'Memoria compartida', 'nucleo', 'n']];
    app.innerHTML = '<div class="top"><div class="tag">CYVORA · SEGURIDAD DIGITAL</div></div><h1>Casi todos<br><span class="pk">lo han vivido.</span></h1><div class="grid">' + c.map(function (x) { return '<div class="card ' + x[4] + '" onclick="go(\'' + x[3] + '\')"><div class="k">' + (DONE[x[3]] ? '✓' : x[0]) + '</div><div><div class="t">' + x[2] + '</div><div class="d">' + (x[3] === 'nucleo' ? 'Estación · Núcleo' : 'Estación · ' + x[1] + ' · 6 preguntas') + '</div></div></div>' }).join('') + '</div><div class="hint">Toca una estación · teclas 1–4 · H inicio · M sonido</div>'
}
function dev(q) {
    if (q.k === 'mail') return '<div class="dev mail"><div class="mh">De: ' + q.f + '<br><b>' + q.s + '</b></div>' + q.b + '</div>';
    if (q.k === 'sms') return '<div class="dev phone"><div class="pn">' + q.f + '</div><div class="bub">' + q.b + '</div></div>';
    if (q.k === 'call') return '<div class="dev phone call"><div class="av"></div><div class="pn">' + q.f + '</div><div class="sm">' + q.p + '</div><div class="bub">“' + q.b + '”</div><div class="cb"><i class="rd"></i><i class="gn"></i></div></div>';
    return '<div class="dev web"><div class="url"><span>' + q.u + '</span></div><div class="wh">' + q.t + '</div><div class="wb">' + q.b + '<div class="in"></div><div class="in"></div><b class="fake">Continuar</b></div></div>'
}
function qs() {
    clr(); var s = ST[Q.id], q = s.q[Q.i]; Q.a = 0;
    app.innerHTML = hdr(s.n) + '<div class="row"><div class="devwrap" id="dw">' + dev(q) + '</div><div class="side"><div class="cnt">PREGUNTA ' + (Q.i + 1) + ' / ' + s.q.length + '</div><h2>¿Es <span class="gl">real</span> o <span class="pk">falso</span>?</h2><div class="opts"><button class="ob rl" onclick="ans(1)">REAL</button><button class="ob fk" onclick="ans(0)">FALSO</button></div><div class="tbar"><i id="tb"></i></div><div id="res"></div></div></div>';
    var t0 = Date.now(); tm = setInterval(function () { var p = (Date.now() - t0) / TL; document.getElementById('tb').style.width = Math.max(0, 100 - p * 100) + '%'; if (p >= 1) ans(-1) }, 100)
}
function ans(v) {
    if (Q.a) return; Q.a = 1; clearInterval(tm); var s = ST[Q.id], q = s.q[Q.i], ok = v === q.r;
    if (ok) { Q.score++; Q.streak++; Q.h[Q.i] = 1; beep(660, .18); setTimeout(function () { beep(880, .2) }, 160); burst('#B4F59A') } else { Q.streak = 0; Q.h[Q.i] = 0; beep(180, .35); burst('#F23A95') }
    document.getElementById('dw').classList.add('rv'); document.querySelectorAll('.ob').forEach(function (b) { b.disabled = true });
    var last = Q.i + 1 >= s.q.length;
    document.getElementById('res').innerHTML = '<div class="v ' + (ok ? 'gl' : 'pk') + '">' + (v === -1 ? 'Se acabó el tiempo' : ok ? '¡Bien!' : 'Casi') + ' · era ' + (q.r ? 'REAL' : 'FALSO') + '</div><p>' + q.w + '</p><button class="btn p" onclick="nxt()">' + (last ? 'Ver resultado' : 'Siguiente') + '</button>';
    var h = document.querySelector('.hud'); if (h) h.outerHTML = hdr(s.n).match(/<div class="hud">[\s\S]*?<\/div><button/)[0].replace('<button', '');
    tm = setTimeout(nxt, 14000)
}
function nxt() { clearTimeout(tm); Q.i++; var s = ST[Q.id]; if (Q.i >= s.q.length) return fin(); if (Q.i === 3) return ov(s.mid[0], s.mid[1], 'Seguir', 'qs()'); qs() }
function ov(n, t, b, fn) { clr(); var d = document.createElement('div'); d.className = 'ov'; d.innerHTML = '<div class="big">' + n + '</div><div class="l">' + t + '</div><div class="l gl" style="font-size:36px">Caer en el engaño no te hace ingenuo. Te hace humano.</div><button class="btn" onclick="' + fn + '">' + b + '</button>'; stage.appendChild(d); beep(330, .25) }
function fin() {
    clr(); var s = ST[Q.id], n = Q.score, len = s.q.length, nx = ORD[ORD.indexOf(Q.id) + 1]; DONE[Q.id] = 1;
    var m = n >= 5 ? 'Tienes buen ojo. Aun así, el engaño está diseñado para parecer real.' : n >= 3 ? 'Dudaste en algunas, como casi todos. Eso es normal.' : 'Caíste en varias, y eso es de lo más humano que hay.';
    app.innerHTML = hdr(s.n) + '<div style="text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px"><div class="big" style="color:var(--gl)">' + n + '/' + len + '</div><div class="l">' + m + '</div><div class="sc"><div><div class="big">' + s.end[0] + '</div><p>' + s.end[1] + '</p></div></div><div style="display:flex;gap:26px;margin-top:20px"><button class="btn" onclick="go(\'' + nx + '\')">Siguiente estacion</button><button class="btn g" onclick="go(\'' + Q.id + '\')">Repetir</button></div></div>';
    Q = null; burst('#4DAC32')
}
var CH = ['Un SMS de mi banco falso', 'Una llamada pidiendo mi clave', 'Una tienda que nunca me llegó', 'Un correo de mi “jefe”', 'Una voz clonada', 'Un enlace por WhatsApp'], CT = [0, 0, 0, 0, 0, 0], CC = ['#F23A95', '#8A0F67', '#4DAC32', '#17470E'];
function nucleo() {
    CT = [0, 0, 0, 0, 0, 0];
    app.innerHTML = hdr('NUCLEO · MEMORIA COMPARTIDA') + '<h2 style="text-align:center">Tu <span class="pk">memoria</span> compartida</h2><div class="sc"><div><div class="big" data-n="36" data-s="%">0%</div><p>ha sido víctima de fraude digital</p></div><div><div class="big" data-n="40" data-s="%">0%</div><p>no identifica un sitio falso</p></div><div><div class="big" data-n="90" data-s="%">0%</div><p>siente que el fraude está presente</p></div></div><div class="fin">Toca lo que <span class="pk">también te pasó</span></div><div class="chips">' + CH.map(function (c, i) { return '<div class="chip" onclick="addc(' + i + ')">' + c + '<b id="cc' + i + '">0</b></div>' }).join('') + '</div><div class="wall" id="wall"></div><div class="fin" style="font-size:40px;margin-top:16px">El engaño está diseñado para parecer real. <span class="gl">Caer en él no te hace ingenuo. Te hace humano.</span></div>';
    var els = app.querySelectorAll('[data-n]'), t0 = Date.now(); tm = setInterval(function () { var p = Math.min(1, (Date.now() - t0) / 2200); els.forEach(function (e) { e.textContent = Math.round(e.dataset.n * p) + e.dataset.s }); if (p >= 1) clearInterval(tm) }, 40)
}
function addc(i) { CT[i]++; document.getElementById('cc' + i).textContent = CT[i]; var w = document.getElementById('wall'), d = document.createElement('div'); d.className = 'cell'; d.textContent = CH[i]; d.style.cssText = 'left:' + Math.random() * (w.clientWidth - 460) + 'px;top:' + Math.random() * (w.clientHeight - 70) + 'px;background:' + CC[Math.floor(Math.random() * 4)]; w.appendChild(d); if (w.children.length > 28) w.removeChild(w.firstChild); beep(500 + i * 60, .12) }
go('home');
