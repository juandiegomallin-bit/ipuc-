/* Pinta el contenido (publicado o borrador del admin) en index.html */
(function () {
  var d = window.CONTENIDO_BASE, borrador = false;
  if (!d) return;
  try {
    var raw = localStorage.getItem('ipuc_borrador');
    if (raw) { d = JSON.parse(raw); borrador = true; }
  } catch (e) {}

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return document.querySelectorAll(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var br = function (s) { return esc(s).replace(/\n/g, '<br>'); };
  var txt = function (sel, v) { var el = $(sel); if (el) el.textContent = v; };
  var html = function (sel, v) { var el = $(sel); if (el) el.innerHTML = v; };
  var seguro = function (fn) { try { fn(); } catch (e) { console.warn('sitio.js:', e); } };
  var lista = function (sel, arr, fn) { html(sel, (arr || []).map(fn).join('')); };

  seguro(function () {
    var i = d.iglesia;
    document.title = i.nombre + ' – ' + i.ciudad;
    $$('.nav-brand img, .hero-logo-wrap img, .footer-logo-row img').forEach(function (img) { img.src = i.logo; });
    html('.nav-brand-text', esc(i.nombre) + '<span>' + esc(i.denominacion) + '</span>');
    txt('.hero-church-name', i.nombre.toUpperCase());
    txt('.hero-sub', i.subtitulo);
    txt('.footer-church', i.nombre + ' – ' + i.ciudad);
    var fs = $$('.footer-sub');
    if (fs[0]) fs[0].textContent = i.denominacion;
    if (fs[1]) fs[1].textContent = i.ubicacionPie;
    txt('.footer-copy', d.pie.copyright);
  });

  seguro(function () {
    txt('.hero-verse-text', d.inicio.versiculo);
    txt('.hero-verse-ref', '— ' + d.inicio.referencia);
    txt('.hero-welcome', d.inicio.bienvenida);
  });

  seguro(function () {
    lista('.sobre-grid', d.sobre, function (c) {
      return '<div class="sobre-card reveal"><div class="sobre-icon">' + esc(c.icono) + '</div><div class="sobre-card-text"><h3>' +
        esc(c.titulo) + '</h3><p>' + esc(c.texto) + '</p></div></div>';
    });
  });

  seguro(function () {
    var f = d.familia;
    if (f.foto) $('.familia-foto-wrap img').src = f.foto;
    html('.familia-foto-caption', esc(f.pie) + '<p>' + esc(f.subpie) + '</p>');
    lista('.pastoral-cards', f.miembros, function (m) {
      return '<div class="pastoral-card reveal"><div class="pastoral-avatar">' + esc(m.icono) + '</div><h3>' +
        esc(m.nombre) + '</h3><span class="role">' + esc(m.rol) + '</span></div>';
    });
  });

  seguro(function () {
    lista('.ministerios-grid', d.ministerios, function (m) {
      return '<div class="ministerio-card reveal"><div class="ministerio-icon">' + esc(m.icono) + '</div><h3>' + esc(m.nombre) + '</h3>' +
        (m.lider ? '<p class="ministerio-lider">Líder: <strong>' + esc(m.lider) + '</strong></p>' : '') + '</div>';
    });
  });

  seguro(function () {
    lista('.horarios-grid', d.horarios, function (h) {
      return '<div class="horario-card reveal"><div class="horario-icon">' + esc(h.icono) + '</div><div class="horario-day">' +
        esc(h.dia) + '</div><div class="horario-time">' + esc(h.hora) + '</div></div>';
    });
  });

  seguro(function () {
    var v = String(d.predicaciones.video || ''), m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || v.match(/^([\w-]{11})$/);
    var ifr = $('.video-wrapper iframe');
    if (m) ifr.src = 'https://www.youtube.com/embed/' + m[1];
    else $('#predicaciones').style.display = 'none';
  });

  seguro(function () {
    var c = d.contacto, tel = String(c.telefono).replace(/\D/g, '');
    var item = function (ic, h, cuerpo) {
      return '<div class="contacto-item reveal"><div class="contacto-item-icon">' + ic + '</div><div class="contacto-item-text"><h4>' + h + '</h4>' + cuerpo + '</div></div>';
    };
    html('.contacto-info',
      item('📍', 'Dirección', '<p>' + br(c.direccion) + '</p>') +
      item('📱', 'Teléfono', '<a href="tel:' + (tel.length === 10 ? '+57' : '') + tel + '">' + esc(c.telefono) + '</a>') +
      item('✉️', 'Correo Electrónico', '<a href="mailto:' + esc(c.correo) + '">' + esc(c.correo) + '</a>') +
      item('🕊️', 'Bienvenida', '<p>' + br(c.bienvenida) + '</p>'));
    if (c.mapa) $('.map-container iframe').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(c.mapa) + '&z=16&output=embed';
  });

  if (borrador) {
    var b = document.createElement('div');
    b.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2000;background:#1A2F3E;color:#fff;padding:10px 18px;border-radius:50px;font:600 .85rem Nunito,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)';
    b.innerHTML = 'Vista previa del borrador (solo la ves tú) · <a href="admin.html" style="color:#A8D8F0">Volver al admin</a>';
    document.body.appendChild(b);
  }
})();
