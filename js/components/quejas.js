// Componente UI para Quejas y Reclamos

export function quejasComponent() {
  return `
    <div class="quejas-container">
      <h1 class="quejas-title">Quejas y Reclamos</h1>
      <p class="quejas-subtitle">Gestiona tus quejas y reclamos sobre el servicio</p>

      <!-- Botón para nueva queja -->
      <div class="new-complaint-section">
        <button class="btn-new-complaint" id="btn-new-complaint">
          📝 Nueva Queja/Reclamo
        </button>
      </div>

      <!-- Listado de quejas -->
      <div class="complaints-list" id="complaints-list">
        <!-- Las quejas se cargarán aquí dinámicamente -->
      </div>
    </div>
  `;
}

export function adminQuejasComponent() {
  return `
    <div class="admin-quejas-container">
      <h2>Gestión de Quejas y Reclamos</h2>
      <p class="section-info">Aquí puedes ver y gestionar todas las quejas y reclamos de los huéspedes</p>

      <!-- Filtros -->
      <div class="filters-section">
        <select id="status-filter">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="resuelto">Resuelto</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <!-- Listado de quejas para admin -->
      <div class="admin-complaints-list" id="admin-complaints-list">
        <!-- Las quejas se cargarán aquí dinámicamente -->
      </div>
    </div>
  `;
}
