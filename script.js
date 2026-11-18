/* ==========================================================================
   NÁCAR ESTÉTICA · script.js
   1. Configuración  2. Utilidades  3. Cabecera y menú  4. Imágenes y animaciones
   5. Pestañas de tratamientos  6. Reserva online  7. Tarjetas regalo
   8. Diálogo de WhatsApp  9. Novias: cuenta atrás de belleza  10. Novias: formulario
   ========================================================================== */

/* ---------- 1. Configuración (editar por cada centro) ---------- */
const CONFIG = {
  // Número de WhatsApp con prefijo y sin "+" ni espacios, p. ej. "34600111222".
  // Mientras sea un marcador, WhatsApp pedirá elegir el contacto.
  whatsapp: '[WHATSAPP]',
  businessName: 'Nácar',

  // [HORARIO] Franjas de apertura por día (0 = domingo … 6 = sábado). null = cerrado.
  schedule: {
    0: null,
    1: [['10:00', '14:00'], ['16:00', '20:00']],
    2: [['10:00', '14:00'], ['16:00', '20:00']],
    3: [['10:00', '14:00'], ['16:00', '20:00']],
    4: [['10:00', '14:00'], ['16:00', '20:00']],
    5: [['10:00', '14:00'], ['16:00', '20:00']],
    6: [['10:00', '14:00']]
  },
  slotStep: 30,                 // minutos entre horas ofrecidas
  minNoticeMinutes: 120,        // antelación mínima para reservar hoy
  maxDaysAhead: 90,             // hasta cuántos días se puede reservar
  closedDates: ['2026-12-25', '2027-01-01', '2027-01-06'] // festivos (AAAA-MM-DD)
};

/* ---------- 2. Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.documentElement.classList.add('js'); // (también se añade en el <head> para evitar parpadeos)

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

const fmtLong = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

// Enlace de WhatsApp con el mensaje ya escrito
const waLink = (message) => {
  const number = CONFIG.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

// Marca un campo como inválido (o lo limpia)
const setInvalid = (el, invalid) => {
  if (!el) return;
  if (invalid) el.setAttribute('aria-invalid', 'true');
  else el.removeAttribute('aria-invalid');
};

/* ---------- 3. Cabecera y menú ---------- */
(() => {
  const header = $('[data-header]');
  const toggle = $('.nav-toggle');
  const nav = $('#menu-principal');

  // Fondo de la cabecera al hacer scroll
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!toggle || !nav) return;

  const setOpen = (open, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const first = $('a', nav);
      if (first) setTimeout(() => first.focus(), 60);
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  // Cerrar al pulsar un enlace
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });

  // Si se agranda la ventana con el menú abierto, se cierra
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });

  // Año del pie
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

/* ---------- 4. Imágenes (relleno si no cargan) y animaciones de entrada ---------- */
(() => {
  $$('.media img').forEach((img) => {
    const fail = () => img.closest('.media').classList.add('is-broken');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  const items = $$('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
})();

/* ---------- 5. Pestañas de tratamientos (accesibles con teclado) ---------- */
(() => {
  const tabs = $$('[role="tab"]');
  if (!tabs.length) return;

  const select = (tab, focus = true) => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next); }
    });
  });
})();

/* Carta de tratamientos leída del HTML (una sola fuente de datos) */
const TREATMENTS = $$('.t-item').map((el) => ({
  id: el.dataset.id,
  cat: el.dataset.cat,
  name: el.dataset.name,
  duration: Number(el.dataset.duration),
  price: el.dataset.price
}));
const findTreatment = (id) => TREATMENTS.find((t) => t.id === id);

// Rellena un <select> con los tratamientos agrupados por categoría
const fillTreatmentSelect = (select) => {
  const cats = [...new Set(TREATMENTS.map((t) => t.cat))];
  cats.forEach((cat) => {
    const group = document.createElement('optgroup');
    group.label = cat;
    TREATMENTS.filter((t) => t.cat === cat).forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name} · ${t.duration} min`;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
};

/* ---------- 8. Diálogo de WhatsApp (se define antes porque lo usan varias secciones) ---------- */
const Sheet = (() => {
  const sheet = $('#sheet');
  if (!sheet) return { open: () => {} };
  const msgBox = $('#sheet-msg', sheet);
  const wa = $('#sheet-wa', sheet);
  const copyBtn = $('#sheet-copy', sheet);
  const title = $('#sheet-title', sheet);
  let lastFocus = null;
  let currentMsg = '';

  const close = () => {
    sheet.hidden = true;
    document.body.classList.remove('menu-open');
    if (lastFocus) lastFocus.focus();
  };

  const open = (message, heading = 'Revisa tu mensaje') => {
    lastFocus = document.activeElement;
    currentMsg = message;
    msgBox.textContent = message;
    title.textContent = heading;
    wa.href = waLink(message);
    copyBtn.textContent = 'Copiar mensaje';
    sheet.hidden = false;
    document.body.classList.add('menu-open');
    wa.focus();
  };

  $$('[data-close]', sheet).forEach((el) => el.addEventListener('click', close));

  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    // Mantiene el foco dentro del diálogo
    if (e.key === 'Tab') {
      const focusables = $$('a[href], button', sheet).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentMsg);
      copyBtn.textContent = '¡Copiado!';
    } catch {
      // Alternativa: seleccionar el texto para copiarlo a mano
      const range = document.createRange();
      range.selectNodeContents(msgBox);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyBtn.textContent = 'Texto seleccionado';
    }
  });

  return { open };
})();

/* ---------- 6. Reserva online ---------- */
(() => {
  const form = $('#booking-form');
  if (!form) return;

  const selTreatment = $('#bk-treatment');
  const inDate = $('#bk-date');
  const slotsBox = $('#bk-slots');
  const dateHint = $('#bk-date-hint');
  const inName = $('#bk-name');
  const inPhone = $('#bk-phone');
  const inNotes = $('#bk-notes');
  const inFirst = $('#bk-first');
  const errorBox = $('#bk-error');
  const ticket = $('.ticket');
  const sum = (key) => $(`[data-sum="${key}"]`);

  let selectedTime = null;

  fillTreatmentSelect(selTreatment);

  // Límites del calendario
  const today = startOfToday();
  inDate.min = toISO(today);
  inDate.max = toISO(addDays(today, CONFIG.maxDaysAhead));

  // Devuelve las horas libres para un día y una duración
  const getSlots = (date, duration) => {
    const iso = toISO(date);
    if (CONFIG.closedDates.includes(iso)) return null;
    const ranges = CONFIG.schedule[date.getDay()];
    if (!ranges) return null;

    const isToday = iso === toISO(new Date());
    const now = new Date();
    const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + CONFIG.minNoticeMinutes : 0;

    return ranges.map(([from, to]) => {
      const list = [];
      for (let m = toMinutes(from); m + duration <= toMinutes(to); m += CONFIG.slotStep) {
        if (m >= earliest) list.push(m);
      }
      return list;
    });
  };

  const renderSlots = () => {
    slotsBox.innerHTML = '';
    const t = findTreatment(selTreatment.value);
    if (!inDate.value) {
      slotsBox.innerHTML = '<p class="slots-empty">Elige un día para ver las horas.</p>';
      return;
    }
    const date = fromISO(inDate.value);
    const groups = getSlots(date, t ? t.duration : 30);

    if (!groups) {
      selectedTime = null;
      dateHint.textContent = 'Ese día el centro está cerrado. Prueba con otro.';
      slotsBox.innerHTML = '<p class="slots-empty">Sin horas disponibles.</p>';
      return;
    }
    dateHint.textContent = t ? `Horas en las que cabe tu ${t.name.toLowerCase()} (${t.duration} min).` : 'Elige un tratamiento para ajustar las horas a su duración.';

    const labels = ['Mañana', 'Tarde'];
    let any = false;
    groups.forEach((list, gi) => {
      if (!list.length) return;
      any = true;
      const label = document.createElement('p');
      label.className = 'slots-group';
      label.textContent = groups.length > 1 ? labels[gi] || '' : 'Horas';
      slotsBox.appendChild(label);
      list.forEach((m) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot';
        b.textContent = toHHMM(m);
        b.dataset.min = m;
        b.setAttribute('aria-pressed', String(selectedTime === m));
        slotsBox.appendChild(b);
      });
    });

    if (!any) {
      slotsBox.innerHTML = '<p class="slots-empty">No quedan horas este día. Prueba con el siguiente.</p>';
    }
    // Si la hora elegida ya no cabe, se borra
    if (selectedTime !== null && !$(`.slot[data-min="${selectedTime}"]`, slotsBox)) selectedTime = null;
  };

  const updateSummary = () => {
    const t = findTreatment(selTreatment.value);
    sum('treatment').textContent = t ? t.name : 'Elige un tratamiento';
    sum('duration').textContent = t ? `${t.duration} min` : '—';
    sum('price').textContent = t ? t.price : '—';
    sum('date').textContent = inDate.value ? fmtLong.format(fromISO(inDate.value)) : '—';
    if (selectedTime !== null) {
      const end = t ? ` – ${toHHMM(selectedTime + t.duration)}` : '';
      sum('time').textContent = `${toHHMM(selectedTime)}${end}`;
    } else {
      sum('time').textContent = '—';
    }
  };

  // Eventos
  selTreatment.addEventListener('change', () => { setInvalid(selTreatment, false); renderSlots(); updateSummary(); });
  inDate.addEventListener('change', () => { setInvalid(inDate, false); renderSlots(); updateSummary(); });

  slotsBox.addEventListener('click', (e) => {
    const b = e.target.closest('.slot');
    if (!b) return;
    selectedTime = Number(b.dataset.min);
    $$('.slot', slotsBox).forEach((s) => s.setAttribute('aria-pressed', String(s === b)));
    updateSummary();
  });

  // Botones "Reservar" de la carta y del tratamiento estrella: preseleccionan
  $$('[data-book]').forEach((link) => {
    link.addEventListener('click', () => {
      selTreatment.value = link.dataset.book;
      selTreatment.dispatchEvent(new Event('change'));
      if (ticket) {
        ticket.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
          { duration: 600, delay: 500, easing: 'ease-out' }
        );
      }
    });
  });

  // Envío: valida y prepara el mensaje
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = findTreatment(selTreatment.value);
    const checks = [
      [selTreatment, !t, 'Elige un tratamiento.'],
      [inDate, !inDate.value, 'Elige un día.'],
      [slotsBox, selectedTime === null, 'Elige una hora.'],
      [inName, !inName.value.trim(), 'Escribe tu nombre.'],
      [inPhone, inPhone.value.replace(/\D/g, '').length < 9, 'Escribe un teléfono válido.']
    ];
    let firstError = null;
    checks.forEach(([el, bad, msg]) => {
      if (el !== slotsBox) setInvalid(el, bad);
      if (bad && !firstError) firstError = { el, msg };
    });
    if (firstError) {
      errorBox.textContent = firstError.msg;
      const target = firstError.el === slotsBox ? ($('.slot', slotsBox) || inDate) : firstError.el;
      target.focus();
      return;
    }
    errorBox.textContent = '';

    const lines = [
      `¡Hola ${CONFIG.businessName}! Me gustaría reservar una cita:`,
      '',
      `• Tratamiento: ${t.name} (${t.duration} min)`,
      `• Día: ${fmtLong.format(fromISO(inDate.value))}`,
      `• Hora: ${toHHMM(selectedTime)}`,
      `• Nombre: ${inName.value.trim()}`,
      `• Teléfono: ${inPhone.value.trim()}`,
      `• Primera visita: ${inFirst.checked ? 'Sí' : 'No'}`
    ];
    if (inNotes.value.trim()) lines.push(`• Notas: ${inNotes.value.trim()}`);
    lines.push('', '¡Gracias!');
    Sheet.open(lines.join('\n'), 'Tu solicitud de cita');
  });

  updateSummary();
})();

/* ---------- 7. Tarjetas regalo de Navidad ---------- */
(() => {
  const form = $('#gift-form');
  if (!form) return;

  const card = $('#gift-card');
  const selTreat = $('#g-treatment');
  const treatField = $('.gift-treatment');
  const inTo = $('#g-to');
  const inFrom = $('#g-from');
  const inMsg = $('#g-msg');
  const counter = $('#g-count');
  const out = { value: $('#gc-value'), to: $('#gc-to'), from: $('#gc-from'), msg: $('#gc-msg'), year: $('#gc-year') };

  fillTreatmentSelect(selTreat);
  selTreat.value = 'ritual-nacar';

  // Cuenta atrás hasta Navidad
  const countdown = $('#gift-countdown');
  const today = startOfToday();
  let xmas = new Date(today.getFullYear(), 11, 25);
  if (today > xmas) xmas = new Date(today.getFullYear() + 1, 11, 25);
  const left = daysBetween(today, xmas);
  if (countdown) {
    countdown.innerHTML = left === 0
      ? '<strong>¡Hoy es Navidad!</strong> Aún puedes regalar en formato digital'
      : `Quedan <strong>${left}</strong> ${left === 1 ? 'día' : 'días'} para Navidad`;
  }
  const yearLabel = xmas.getFullYear();

  const update = () => {
    const value = $('input[name="g-value"]:checked', form).value;
    const design = $('input[name="g-design"]:checked', form).value;
    const isTreatment = value === 'tratamiento';
    treatField.hidden = !isTreatment;

    const t = findTreatment(selTreat.value);
    out.value.textContent = isTreatment && t ? t.name : value;
    out.value.style.fontSize = isTreatment ? 'clamp(1.7rem, 6vw, 2.4rem)' : '';
    out.to.textContent = inTo.value.trim() || 'Lucía';
    out.from.textContent = inFrom.value.trim() || 'ti';
    out.year.textContent = yearLabel;
    out.msg.textContent = inMsg.value.trim() || 'Porque te mereces una pausa…';
    counter.textContent = `${inMsg.value.length}/120`;
    card.className = `gift-card design-${design}`;
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = $('input[name="g-value"]:checked', form).value;
    const t = findTreatment(selTreat.value);
    const design = $('input[name="g-design"]:checked', form).closest('label').textContent.trim();
    const delivery = $('input[name="g-delivery"]:checked', form).value;
    const what = value === 'tratamiento' && t ? `${t.name} (${t.duration} min)` : `Importe de ${value}`;

    const lines = [
      `¡Hola ${CONFIG.businessName}! Quiero una tarjeta regalo de Navidad:`,
      '',
      `• Regalo: ${what}`,
      `• Diseño: ${design}`,
      `• Para: ${inTo.value.trim() || '(sin indicar)'}`,
      `• De parte de: ${inFrom.value.trim() || '(sin indicar)'}`,
      `• Mensaje: ${inMsg.value.trim() || '(sin mensaje)'}`,
      `• Entrega: ${delivery}`,
      '',
      '¿Cómo hago el pago?'
    ];
    Sheet.open(lines.join('\n'), 'Tu tarjeta regalo');
  });

  update();
})();

/* ---------- 9. Novias: cuenta atrás de belleza ---------- */
(() => {
  const form = $('#planner-form');
  if (!form) return;

  const inDate = $('#wedding-date');
  const inName = $('#wedding-name');
  const result = $('#planner-result');
  const today = startOfToday();
  inDate.min = toISO(addDays(today, 1));

  // Hitos del plan: días antes de la boda
  const MILESTONES = [
    { d: 365, title: 'Diagnóstico de piel y plan a medida', text: 'Fijamos objetivos y calendario. Si quieres depilación láser, es el momento de empezar: necesita varias sesiones espaciadas.', late: 'Lo hacemos en tu primera cita y adaptamos el plan al tiempo que queda.' },
    { d: 180, title: 'Rutina facial mensual', text: 'Hydra Glow o antimanchas una vez al mes para unificar el tono y ganar luminosidad. Opcional: programa corporal.', late: 'Concentramos las sesiones cada 2–3 semanas para llegar a tiempo.' },
    { d: 90, title: 'Primera prueba de maquillaje y peinado', text: 'Probamos estilos con tus fotos de referencia y el escote del vestido.', late: 'Hacemos una única prueba completa y muy enfocada.' },
    { d: 30, title: 'Prueba definitiva', text: 'Con accesorios y, si puedes, con el tono del vestido. Último peeling suave como muy tarde esta semana.', late: 'Prueba definitiva en cuanto nos llames; sin peelings a partir de ahora.' },
    { d: 14, title: 'Limpieza facial profunda', text: 'Dos semanas antes, para que cualquier rojez desaparezca a tiempo.', late: 'La sustituimos por una hidratación suave sin extracciones.' },
    { d: 7, title: 'Hydra Glow + manicura y pedicura', text: 'Piel jugosa y manos perfectas para la foto de los anillos.', late: 'Hydra Glow exprés y manos el mismo día.' },
    { d: 2, title: 'Masaje relajante', text: 'Para dormir bien y llegar descansada. Nada de productos nuevos.', late: 'Un masaje corto la víspera, si te apetece.' },
    { d: 0, title: 'Día B: maquillaje y peinado', text: 'En el centro o a domicilio. Kit de retoque incluido.' }
  ];

  let lastPlanText = '';

  const render = (wedding) => {
    const left = daysBetween(today, wedding);
    const name = inName.value.trim();
    let sub;
    if (left >= 300) sub = 'Tiempo perfecto para el plan completo, sin prisas.';
    else if (left >= 120) sub = 'Buen margen: podemos hacer casi todo el plan a tu ritmo.';
    else if (left >= 30) sub = 'Vamos con plan exprés: aún da tiempo a mucho.';
    else sub = 'Plan de última hora: nos centramos en lo esencial.';

    const items = MILESTONES.map((m) => {
      const date = addDays(wedding, -m.d);
      const isLate = date < today;
      const isDayB = m.d === 0;
      return { ...m, date, isLate, isDayB };
    });

    const html = `
      <div class="plan-head">
        <p class="eyebrow">${name ? `Plan de ${name.replace(/</g, '&lt;')}` : 'Tu plan'}</p>
        <p class="plan-days">${left}<small>${left === 1 ? 'día' : 'días'} para tu boda</small></p>
        <p class="plan-sub">${sub}</p>
      </div>
      <ol class="timeline">
        ${items.map((it) => `
          <li class="${it.isLate ? 'is-late' : ''} ${it.isDayB ? 'is-dayb' : ''}">
            <span class="tl-date">${it.isLate ? 'Cuanto antes' : fmtShort.format(it.date)}${it.isLate ? '<span class="tl-flag">Exprés</span>' : ''}</span>
            <h3>${it.title}</h3>
            <p>${it.isLate && it.late ? it.late : it.text}</p>
          </li>`).join('')}
      </ol>
      <div class="btn-row">
        <button class="btn btn-dark" type="button" id="plan-send">Enviar mi plan por WhatsApp</button>
        <a class="btn btn-link" href="#prueba">Reservar mi cita de novia</a>
      </div>`;
    result.innerHTML = html;

    lastPlanText = [
      `¡Hola ${CONFIG.businessName}! ${name ? `Soy ${name} y ` : ''}me caso el ${fmtLong.format(wedding)} de ${wedding.getFullYear()} (faltan ${left} días).`,
      'Me gustaría empezar mi plan de belleza de novia:',
      '',
      ...items.map((it) => `• ${it.isLate ? 'Cuanto antes' : fmtShort.format(it.date)}: ${it.title}`),
      '',
      '¿Cuándo podemos vernos para la primera cita?'
    ].join('\n');

    $('#plan-send').addEventListener('click', () => Sheet.open(lastPlanText, 'Tu plan de novia'));

    // Rellena la fecha en el formulario de cita
    const trialDate = $('#tr-date');
    if (trialDate) trialDate.value = toISO(wedding);
    const trialName = $('#tr-name');
    if (trialName && name && !trialName.value) trialName.value = name;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!inDate.value) {
      setInvalid(inDate, true);
      inDate.focus();
      return;
    }
    const wedding = fromISO(inDate.value);
    if (wedding <= today) {
      setInvalid(inDate, true);
      result.innerHTML = '<div class="planner-empty"><span class="ring" aria-hidden="true"></span><p>Elige una fecha futura para calcular tu plan.</p></div>';
      inDate.focus();
      return;
    }
    setInvalid(inDate, false);
    render(wedding);
  });
})();

/* ---------- 10. Novias: formulario de cita ---------- */
(() => {
  const form = $('#trial-form');
  if (!form) return;

  const inName = $('#tr-name');
  const inPhone = $('#tr-phone');
  const inDate = $('#tr-date');
  const inPlace = $('#tr-place');
  const selPack = $('#tr-pack');
  const errorBox = $('#tr-error');
  inDate.min = toISO(addDays(startOfToday(), 1));

  // Botones "Me interesa" de los packs
  $$('[data-pack]').forEach((btn) => {
    btn.addEventListener('click', () => { selPack.value = btn.dataset.pack; });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checks = [
      [inName, !inName.value.trim(), 'Escribe tu nombre.'],
      [inPhone, inPhone.value.replace(/\D/g, '').length < 9, 'Escribe un teléfono válido.'],
      [inDate, !inDate.value, 'Indica la fecha de la boda.']
    ];
    let firstError = null;
    checks.forEach(([el, bad, msg]) => {
      setInvalid(el, bad);
      if (bad && !firstError) firstError = { el, msg };
    });
    if (firstError) {
      errorBox.textContent = firstError.msg;
      firstError.el.focus();
      return;
    }
    errorBox.textContent = '';

    const guests = $('input[name="tr-guests"]:checked', form).value;
    const wedding = fromISO(inDate.value);
    const lines = [
      `¡Hola ${CONFIG.businessName}! Quiero pedir mi cita de novia:`,
      '',
      `• Nombre: ${inName.value.trim()}`,
      `• Teléfono: ${inPhone.value.trim()}`,
      `• Boda: ${fmtLong.format(wedding)} de ${wedding.getFullYear()}`,
      `• Lugar: ${inPlace.value.trim() || '(sin indicar)'}`,
      `• Pack: ${selPack.value}`,
      `• Acompañantes: ${guests}`,
      '',
      '¡Gracias!'
    ];
    Sheet.open(lines.join('\n'), 'Tu cita de novia');
  });
})();
