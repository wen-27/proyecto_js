// Componente para la barra de navegación

export function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  nav.innerHTML = `
    <div class="nav-left">
      🏨 <span>Hotel El Rincón del Carmen</span>
    </div>
    <div class="nav-right">
      <a href="#inicio">Inicio</a>
      <a href="#reservas">Reservas</a>
      <a href="#contacto">Contacto</a>
      <a href="#admin" id="admin-link" style="display:none;">Admin</a>
      <a href="#" id="logout-link" style="cursor:pointer; display:none;">Cerrar Sesión</a>
    </div>
  `;

  return nav;
}
