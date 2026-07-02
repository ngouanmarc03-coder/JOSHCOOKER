// ==================== ADMIN LAYOUT ====================
const ADMIN_SIDEBAR_HTML = `
<div class="admin-sidebar" id="admin-sidebar">
  <div class="sidebar-brand">
    <h2>Josua <span>Cooker</span></h2>
    <p>Panneau d'administration</p>
  </div>
  <nav class="sidebar-nav">
    <div class="sidebar-nav-group">
      <div class="sidebar-nav-group-label">Principal</div>
      <a href="dashboard.html" class="sidebar-link" data-page="dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Tableau de bord
      </a>
      <a href="orders.html" class="sidebar-link" data-page="orders">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Commandes
        <span class="badge-count" id="pending-badge" style="display:none">0</span>
      </a>
    </div>
    <div class="sidebar-nav-group">
      <div class="sidebar-nav-group-label">Contenu</div>
      <a href="heroes.html" class="sidebar-link" data-page="heroes">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Heroes & Médias
      </a>
      <a href="menus.html" class="sidebar-link" data-page="menus">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        Produits / Menu
      </a>
      <a href="events.html" class="sidebar-link" data-page="events">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Événements & Promos
      </a>
    </div>
    <div class="sidebar-nav-group">
      <div class="sidebar-nav-group-label">Clients</div>
      <a href="users.html" class="sidebar-link" data-page="users">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Clients
      </a>
    </div>
    <div class="sidebar-nav-group">
      <div class="sidebar-nav-group-label">Configuration</div>
      <a href="settings.html" class="sidebar-link" data-page="settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 0 14.14 14.14"/></svg>
        Paramètres
      </a>
    </div>
    <div class="sidebar-nav-group">
      <a href="../../index.html" class="sidebar-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Voir le site
      </a>
    </div>
  </nav>
  <div class="sidebar-footer">
    <div class="sidebar-user">
      <div class="sidebar-user-avatar" id="sidebar-avatar">A</div>
      <div class="sidebar-user-info">
        <h4 id="sidebar-name">Admin</h4>
        <p>Administrateur</p>
      </div>
    </div>
    <button onclick="Auth.logout()" style="width:100%;margin-top:10px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.08);border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Déconnexion
    </button>
  </div>
</div>
<div class="sidebar-overlay" id="sidebar-overlay"></div>
`;

function initAdminLayout(currentPage) {
  // Vérif auth
  const token = localStorage.getItem('jc_token');
  let user = null;
  try { user = JSON.parse(localStorage.getItem('jc_user')); } catch (e) { user = null; }
  if (!token || !user || user.role !== 'admin') {
    window.location.href = '../auth.html';
    return;
  }

  document.body.classList.add('admin-body');

  // Injection sidebar en premier enfant
  const wrapper = document.getElementById('admin-wrapper');
  if (wrapper) {
    const temp = document.createElement('div');
    temp.innerHTML = ADMIN_SIDEBAR_HTML.trim();
    Array.from(temp.children).reverse().forEach(node => {
      wrapper.insertBefore(node, wrapper.firstChild);
    });
  }

  // Lien actif
  document.querySelectorAll('.sidebar-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === currentPage);
  });

  // Info utilisateur
  const av = document.getElementById('sidebar-avatar');
  const nm = document.getElementById('sidebar-name');
  if (av) av.textContent = user.name.charAt(0).toUpperCase();
  if (nm) nm.textContent = user.name;

  // Toggle mobile
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('admin-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Badge commandes en attente — on attend que apiFetch soit dispo
  setTimeout(() => loadPendingBadge(), 100);
}

async function loadPendingBadge() {
  try {
    if (typeof apiFetch !== 'function') return;
    const orders = await apiFetch('/orders/admin/all?status=pending');
    const badge = document.getElementById('pending-badge');
    if (badge && orders.length > 0) {
      badge.textContent = orders.length;
      badge.style.display = 'inline-block';
    }
  } catch (e) {}
}
