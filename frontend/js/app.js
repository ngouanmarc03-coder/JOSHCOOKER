// ==================== CONFIG ====================
const DEFAULT_API_BASE = 'http://localhost:5000';
const API_BASE = (() => {
  if (typeof window === 'undefined') return DEFAULT_API_BASE;
  const origin = window.location.origin;
  if (origin && origin !== 'null') {
    if (window.location.port === '5000' || window.location.port === '') {
      return origin;
    }
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return DEFAULT_API_BASE;
})();
const API = `${API_BASE}/api`;

// ==================== AUTH HELPERS ====================
const Auth = {
  getToken: () => localStorage.getItem('jc_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('jc_user')); } catch (e) { return null; } },
  isLoggedIn: () => !!localStorage.getItem('jc_token'),
  isAdmin: () => { const u = Auth.getUser(); return !!u && u.role === 'admin'; },
  logout: () => { localStorage.removeItem('jc_token'); localStorage.removeItem('jc_user'); window.location.href = '/index.html'; }
};

// ==================== API FETCH ====================
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(API + path, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error('Failed to parse JSON:', path, res.status, text);
    throw new Error(`Erreur serveur (${res.status})`);
  }
  if (!res.ok) {
    console.error('API error:', path, res.status, data);
    const msg = data?.message || `Erreur serveur (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// ==================== SETTINGS CACHE ====================
let _settings = null;
async function getSettings() {
  if (_settings) return _settings;
  try { _settings = await apiFetch('/settings'); return _settings; } catch { return {}; }
}

// ==================== DARK MODE ====================
function initDarkMode() {
  const isDark = localStorage.getItem('jc_dark') === '1';
  if (isDark) document.body.classList.add('dark-mode');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    if (isDark) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const on = document.body.classList.contains('dark-mode');
      localStorage.setItem('jc_dark', on ? '1' : '0');
      document.querySelectorAll('.theme-toggle').forEach(b => b.classList.toggle('active', on));
    });
  });
}

// ==================== TOAST ====================
function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '&#10003;', error: '&#10007;', info: '&#9432;' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.success}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ==================== CART ====================
const Cart = {
  get: () => { try { return JSON.parse(localStorage.getItem('jc_cart') || '[]'); } catch { return []; } },
  save: (items) => { localStorage.setItem('jc_cart', JSON.stringify(items)); Cart.updateBadge(); },
  add: (item) => {
    const items = Cart.get();
    const idx = items.findIndex(i => i._id === item._id);
    if (idx > -1) items[idx].qty = (items[idx].qty || 1) + 1;
    else items.push({ ...item, qty: 1 });
    Cart.save(items);
    showToast(`${item.name} ajouté au panier`);
    Cart.render();
  },
  remove: (id) => { const items = Cart.get().filter(i => i._id !== id); Cart.save(items); Cart.render(); },
  updateQty: (id, qty) => {
    const items = Cart.get();
    const idx = items.findIndex(i => i._id === id);
    if (idx > -1) { if (qty <= 0) items.splice(idx, 1); else items[idx].qty = qty; }
    Cart.save(items); Cart.render();
  },
  total: () => Cart.get().reduce((s, i) => s + (i.isPromo && i.promoPrice ? i.promoPrice : i.price) * (i.qty || 1), 0),
  count: () => Cart.get().reduce((s, i) => s + (i.qty || 1), 0),
  updateBadge: () => {
    document.querySelectorAll('.cart-count').forEach(el => {
      const n = Cart.count();
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  },
  render: () => {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const items = Cart.get();
    if (!items.length) { container.innerHTML = '<p style="text-align:center;padding:32px;color:var(--gray)">Votre panier est vide</p>'; }
    else {
      container.innerHTML = items.map(item => {
        const price = item.isPromo && item.promoPrice ? item.promoPrice : item.price;
        const imgSrc = item.image1
          ? (item.image1.startsWith('http') ? item.image1 : `${API_BASE}${item.image1}`)
          : 'images/placeholder.jpg';
        return `<div class="cart-item">
          <img src="${imgSrc}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
          <div class="cart-item-info"><h4>${item.name}</h4><p>${(price * (item.qty||1)).toLocaleString()} FCFA</p></div>
          <div class="cart-qty">
            <button onclick="Cart.updateQty('${item._id}', ${(item.qty||1)-1})">-</button>
            <span>${item.qty || 1}</span>
            <button onclick="Cart.updateQty('${item._id}', ${(item.qty||1)+1})">+</button>
          </div>
          <button onclick="Cart.remove('${item._id}')" style="background:none;border:none;color:#E53935;cursor:pointer;padding:4px">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
          </button>
        </div>`;
      }).join('');
    }
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = Cart.total().toLocaleString() + ' FCFA';
    Cart.updateBadge();
  },
  open: () => { document.getElementById('cart-drawer')?.classList.add('open'); document.getElementById('cart-overlay')?.classList.add('show'); Cart.render(); },
  close: () => { document.getElementById('cart-drawer')?.classList.remove('open'); document.getElementById('cart-overlay')?.classList.remove('show'); }
};

// ==================== FLOATING SOCIAL ====================
function initFloatingSocial() {
  const btn = document.querySelector('.floating-btn');
  if (!btn) return;
  const toggle = btn.querySelector('.floating-toggle');
  const links = btn.querySelector('.floating-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  let dragging = false, startX, startY, startLeft, startBottom;
  btn.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startY = e.clientY;
    const rect = btn.getBoundingClientRect();
    startLeft = rect.left; startBottom = window.innerHeight - rect.bottom;
    btn.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    const newLeft = Math.max(0, Math.min(window.innerWidth - 60, startLeft + dx));
    const newBottom = Math.max(0, Math.min(window.innerHeight - 60, startBottom - dy));
    btn.style.left = newLeft + 'px';
    btn.style.bottom = newBottom + 'px';
    btn.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; btn.style.transition = ''; });
  btn.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    const rect = btn.getBoundingClientRect();
    startLeft = rect.left; startBottom = window.innerHeight - rect.bottom;
  });
  btn.addEventListener('touchmove', e => {
    const t = e.touches[0], dx = t.clientX - startX, dy = t.clientY - startY;
    const newLeft = Math.max(0, Math.min(window.innerWidth - 60, startLeft + dx));
    const newBottom = Math.max(0, Math.min(window.innerHeight - 60, startBottom - dy));
    btn.style.left = newLeft + 'px'; btn.style.bottom = newBottom + 'px'; btn.style.right = 'auto';
    e.preventDefault();
  }, { passive: false });
}

// ==================== NAVBAR ====================
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('show'));
  }
  const user = Auth.getUser();
  const loginBtn = document.getElementById('nav-login');
  const userMenu = document.getElementById('nav-user');
  if (user && loginBtn && userMenu) {
    loginBtn.style.display = 'none';
    userMenu.style.display = 'flex';
    const nameEl = document.getElementById('nav-user-name');
    if (nameEl) nameEl.textContent = user.name.split(' ')[0];
  }
  Cart.updateBadge();
}

// ==================== LOAD SETTINGS INTO PAGE ====================
async function applySettings() {
  const s = await getSettings();
  if (!s) return;
  // Logo dynamique
  if (s.siteLogoUrl) {
    const logoSrc = s.siteLogoUrl.startsWith('http')
      ? s.siteLogoUrl
      : `${API_BASE}${s.siteLogoUrl}`;
    document.querySelectorAll('.navbar-brand img').forEach(img => {
      img.src = logoSrc + '?t=' + Date.now();
    });
  }
  // Réseaux sociaux
  const waLink = document.getElementById('social-wa');
  const fbLink = document.getElementById('social-fb');
  const ttLink = document.getElementById('social-tt');
  const scLink = document.getElementById('social-sc');
  if (waLink && s.whatsapp) waLink.href = s.whatsapp;
  if (fbLink && s.facebook) fbLink.href = s.facebook;
  if (ttLink && s.tiktok) ttLink.href = s.tiktok;
  if (scLink && s.snapchat) scLink.href = s.snapchat;
  // Footer
  const fPhone = document.getElementById('footer-phone');
  const fAddr = document.getElementById('footer-address');
  if (fPhone && s.phone) fPhone.textContent = s.phone;
  if (fAddr && s.address) fAddr.textContent = s.address;
  // Map
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame && s.mapEmbedUrl) mapFrame.src = s.mapEmbedUrl;
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavbar();
  initFloatingSocial();
  applySettings();
  document.querySelectorAll('.cart-icon-wrapper').forEach(el => el.addEventListener('click', Cart.open));
  document.getElementById('cart-overlay')?.addEventListener('click', Cart.close);
  document.querySelector('.btn-close-cart')?.addEventListener('click', Cart.close);
  Cart.updateBadge();
});
