  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsM2J4Dn_TWCz1L_tw9lO7c26RbfEh9M26ao8ouOx-K4ckLo2dlBCuuOfeTpWazJGM4eicpqn0vTqp/pub?output=csv';
  const WA_NUMBER = '56961437784';

  // ─── MODAL
  // ─── HELPER: imagen o emoji según el valor del campo
  function esURL(val) { return val && (val.startsWith('http://') || val.startsWith('https://')); }

  function thumbConcierto(item) {
    if (esURL(item.emoji)) {
      return `<img src="${item.emoji}" alt="${item.nombre}" class="card-thumb-img">`;
    }
    return `<span class="card-thumb-emoji">${item.emoji || '🎵'}</span>`;
  }

  function thumbTour(item) {
    if (esURL(item.emoji)) {
      return `<img src="${item.emoji}" alt="${item.nombre}" class="card-thumb-img">`;
    }
    return `<span class="card-thumb-emoji">${item.emoji || '🗺️'}</span>`;
  }

  function modalHeader(item) {
    if (esURL(item.emoji)) {
      return `<img src="${item.emoji}" alt="${item.nombre}" class="modal-header-img">`;
    }
    return `<div class="modal-header-emoji" id="modal-emoji" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-58%);font-size:4rem;opacity:0.2">${item.emoji || '🎵'}</div>`;
  }

  function abrirModal(item) {
    const msg = encodeURIComponent(item.mensaje_wa || `Hola! Me interesa: ${item.nombre}`);

    // Header: imagen real o emoji watermark
    const header = document.getElementById('modal-header');
    // Limpiar contenido previo salvo el badge
    const badge = document.getElementById('modal-badge');
    header.innerHTML = '';
    header.appendChild(badge);
    badge.textContent = item.tipo === 'concierto' ? 'Concierto' : 'Tour';
    if (esURL(item.emoji)) {
      header.classList.add('has-img');
      const img = document.createElement('img');
      img.src = item.emoji; img.alt = item.nombre; img.className = 'modal-header-img';
      header.insertBefore(img, badge);
    } else {
      header.classList.remove('has-img');
      const emojiEl = document.createElement('div');
      emojiEl.id = 'modal-emoji'; emojiEl.className = 'modal-header-emoji';
      emojiEl.textContent = item.emoji || '🎵';
      header.insertBefore(emojiEl, badge);
    }

    document.getElementById('modal-titulo').textContent = item.nombre;
    document.getElementById('modal-precio').innerHTML = `${item.precio} <small>por persona</small>`;

    // Info grid
    document.getElementById('modal-info-grid').innerHTML = `
      <div class="modal-info-item"><div class="modal-info-label">📅 Fecha</div><div class="modal-info-value">${item.fecha || '—'}</div></div>
      <div class="modal-info-item"><div class="modal-info-label">📍 Lugar</div><div class="modal-info-value">${item.lugar || '—'}</div></div>
      <div class="modal-info-item"><div class="modal-info-label">🕐 Horario</div><div class="modal-info-value">${item.horario || '—'}</div></div>
      <div class="modal-info-item"><div class="modal-info-label">🚌 Salida</div><div class="modal-info-value">${item.punto_salida || 'Machalí'}</div></div>
    `;

    document.getElementById('modal-desc').textContent = item.descripcion || 'Escríbenos para más información sobre este viaje.';

    const tags = (item.incluye || 'Traslado ida y vuelta').split(',').map(t => t.trim());
    document.getElementById('modal-tags').innerHTML = tags.map(t => `<span class="modal-tag">✓ ${t}</span>`).join('');
    if (item.cupos) {
      document.getElementById('modal-tags').innerHTML += `<span class="modal-tag" style="background:var(--bg2);border-color:var(--accent);color:var(--accent)">👥 ${item.cupos}</span>`;
    }

    document.getElementById('modal-wa-btn').href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
    document.getElementById('modal-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) cerrarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

  // ─── RENDER TARJETA CONCIERTO
  function renderConcierto(item, idx) {
    return `
      <div class="card" onclick="abrirModal(window._items[${idx}])" style="cursor:pointer">
        <div class="card-thumb ${esURL(item.emoji) ? 'card-thumb--img' : ''}">
          ${thumbConcierto(item)}
          <span class="card-badge">Disponible</span>
        </div>
        <div class="card-body">
          <div class="card-title">${item.nombre}</div>
          <div class="card-meta">
            <span>📅 ${item.fecha}</span>
            <span>📍 ${item.lugar}</span>
          </div>
          <div class="card-price">${item.precio} <small>por persona</small></div>
          <button class="btn-wa" style="border:none;cursor:pointer" onclick="event.stopPropagation();abrirModal(window._items[${idx}])">
            Ver detalles y reservar →
          </button>
        </div>
      </div>`;
  }

  // ─── RENDER TARJETA TOUR
  function renderTour(item, idx) {
    return `
      <div class="tour-card" onclick="abrirModal(window._items[${idx}])" style="cursor:pointer">
        <div class="tour-thumb ${esURL(item.emoji) ? 'tour-thumb--img' : ''}" ${esURL(item.emoji) ? '' : 'style="background:linear-gradient(135deg,#c8d8f0,#7aa0d4)"'}>
          ${thumbTour(item)}
        </div>
        <div class="tour-body">
          <div class="tour-title">${item.nombre}</div>
          <div class="tour-desc">📅 ${item.fecha} &nbsp;|&nbsp; 📍 ${item.lugar}</div>
          <div class="tour-tags">
            <span class="tour-tag">Salida desde Machalí</span>
            <span class="tour-tag">Ida y vuelta</span>
          </div>
          <div class="card-price">${item.precio} <small>por persona</small></div>
          <button class="btn-wa" style="border:none;cursor:pointer" onclick="event.stopPropagation();abrirModal(window._items[${idx}])">
            Ver detalles y reservar →
          </button>
        </div>
      </div>`;
  }

  // ─── CARGAR DATOS
  // ─── PARSER CSV que respeta comillas (maneja comas dentro de campos)
  function parseCSVRow(row) {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') {
        // comillas dobles seguidas dentro de campo = comilla literal
        if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    return cols;
  }

  async function cargarDatos() {
    const conciertosGrid = document.getElementById('conciertos-grid');
    const toursGrid = document.getElementById('tours-grid');
    let items = [];
    let desdSheet = false;

    try {
      const res = await fetch(SHEET_URL);
      const csv = await res.text();
      const rows = csv.split('\n').filter(r => r.trim()).slice(1); // ignora líneas vacías
      const todosLosItems = rows.map(row => {
        const cols = parseCSVRow(row);
        return {
          nombre:       cols[0],  fecha:        cols[1],  lugar:       cols[2],
          precio:       cols[3],  tipo:         cols[4],  emoji:       cols[5],
          activo:       cols[6],  mensaje_wa:   cols[7],  descripcion: cols[8],
          horario:      cols[9],  punto_salida: cols[10], cupos:       cols[11],
          incluye:      cols[12]
        };
      });
      // Filtra solo los activos — si no hay ninguno muestra "sin viajes", NO datos de ejemplo
      items = todosLosItems.filter(i => i.activo && i.activo.toUpperCase() === 'SI');
      desdSheet = true;
      document.getElementById('sheets-notice').style.display = 'none';
    } catch(e) {
      console.error('Error cargando Sheet:', e);
      items = EJEMPLO_DATA; // fallback solo si falla la red
    }

    window._items = items;
    const conciertos = items.filter(i => i.tipo === 'concierto');
    const tours      = items.filter(i => i.tipo === 'tour');

    conciertosGrid.innerHTML = conciertos.length
      ? conciertos.map(item => renderConcierto(item, items.indexOf(item))).join('')
      : '<div class="empty-state">🎵 Próximamente nuevos conciertos.</div>';

    toursGrid.innerHTML = tours.length
      ? tours.map(item => renderTour(item, items.indexOf(item))).join('')
      : '<div class="empty-state">🗺️ Próximamente nuevos tours.</div>';
  }

  // ─── SCROLL ANIMATIONS
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  cargarDatos();

