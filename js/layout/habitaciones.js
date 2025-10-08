// Módulo para gestión de habitaciones por administrador

import { getRooms, saveRooms, getCurrentUser } from './storage.js';
import { createRoomForm } from '../components/formRoom.js';

let rooms = [];
let currentUser = null;

// Función principal para inicializar la gestión de habitaciones
export function initRoomManagement() {
  currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    console.log('Acceso denegado: Solo administradores pueden gestionar habitaciones');
    return;
  }

  loadRooms();
  renderRoomManagementUI();
}

// Cargar habitaciones desde localStorage
function loadRooms() {
  rooms = getRooms();
}

// Guardar habitaciones en localStorage
function saveRoomsToStorage() {
  saveRooms(rooms);
}

// Renderizar la interfaz de gestión de habitaciones
function renderRoomManagementUI() {
  const container = document.getElementById('room-management-container');
  if (!container) {
    console.error('No se encontró el contenedor para gestión de habitaciones');
    return;
  }

  container.innerHTML = `
    <div class="room-management">
      <h2>Gestión de Habitaciones</h2>
      <button id="add-room-btn" class="btn-add">Agregar Nueva Habitación</button>
      <div id="rooms-table-container"></div>
      <div id="room-form-container" style="display: none;"></div>
    </div>
  `;

  renderRoomsTable();

  // Event listeners
  document.getElementById('add-room-btn').addEventListener('click', () => showRoomForm());
}

// Renderizar tabla bonita de habitaciones
function renderRoomsTable() {
  const container = document.getElementById('rooms-table-container');
  if (!container) return;

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'admin-table-panel';

  tableWrapper.innerHTML = `
    <div class="admin-table-header">
      <h3>Habitaciones Registradas</h3>
      <span class="room-count">${rooms.length} habitaciones</span>
    </div>
    <div class="table-responsive">
      <table class="admin-rooms-table">
        <thead>
          <tr>
            <th class="mobile-hidden">ID</th>
            <th class="mobile-hidden">Imagen</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th class="mobile-hidden">Camas</th>
            <th class="mobile-hidden">Capacidad</th>
            <th>Precio/Noche</th>
            <th class="mobile-hidden">Servicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rooms.map(room => `
            <tr>
              <td class="mobile-hidden"><span class="id-badge">${room.id}</span></td>
              <td class="mobile-hidden"><img src="${room.image}" alt="${room.name}" class="room-thumb"></td>
              <td><strong>${room.name}</strong></td>
              <td>${room.location}</td>
              <td class="mobile-hidden">${room.beds}</td>
              <td class="mobile-hidden">${room.capacity}</td>
              <td><span class="price">$${room.pricePerNight.toLocaleString()}</span></td>
              <td class="mobile-hidden"><div class="services-list">${room.services.map(s => `<span class="service-chip">${s}</span>`).join('')}</div></td>
              <td>
                <div class="action-buttons">
                  <button class="btn-edit" data-room-id="${room.id}" title="Editar habitación">
                    <i class="icon-edit">✏️</i> Editar
                  </button>
                  <button class="btn-delete" data-room-id="${room.id}" title="Eliminar habitación">
                    <i class="icon-delete">🗑️</i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = '';
  container.appendChild(tableWrapper);

  // Event listeners
  tableWrapper.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.target.closest('.btn-edit').dataset.roomId);
      const room = rooms.find(r => r.id === roomId);
      if (room) showRoomForm(room);
    });
  });

  tableWrapper.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.target.closest('.btn-delete').dataset.roomId);
      const row = e.target.closest('tr');

      Swal.fire({
        title: "¿Eliminar habitación?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          deleteRoom(roomId);

          // Animación de eliminación visual
          row.style.transition = "all 0.4s ease";
          row.style.opacity = "0";
          row.style.transform = "translateX(-10px)";
          setTimeout(() => row.remove(), 400);

          Swal.fire({
            title: "Eliminada",
            text: "La habitación fue eliminada correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#de791aff"
          });
        }
      });
    });
  });
}


// Mostrar formulario para agregar/editar habitación
function showRoomForm(room = null) {
  const container = document.getElementById('room-form-container');
  if (!container) return;

  const form = createRoomForm(room, saveRoom, hideRoomForm);
  container.innerHTML = '';
  container.appendChild(form);
  container.style.display = 'block';

  // Ocultar tabla mientras se muestra el formulario
  document.getElementById('rooms-table-container').style.display = 'none';
  document.getElementById('add-room-btn').style.display = 'none';
}

// Ocultar formulario
function hideRoomForm() {
  const container = document.getElementById('room-form-container');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }

  // Mostrar tabla nuevamente
  document.getElementById('rooms-table-container').style.display = 'block';
  document.getElementById('add-room-btn').style.display = 'block';
}

// Guardar habitación (agregar o actualizar)
function saveRoom(roomData) {
  const existingIndex = rooms.findIndex(r => r.id === roomData.id);

  if (existingIndex >= 0) {
    // Actualizar habitación existente
    rooms[existingIndex] = roomData;
  } else {
    // Agregar nueva habitación
    rooms.push(roomData);
  }

  saveRoomsToStorage();
  loadRooms(); // Recargar para asegurar consistencia
  renderRoomsTable();
  hideRoomForm();

  Swal.fire({
    title: '¡Habitación guardada exitosamente! 🏨',
    text: 'Los cambios han sido registrados correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}


// Eliminar habitación
function deleteRoom(roomId) {
  rooms = rooms.filter(r => r.id !== roomId);
  saveRoomsToStorage();
  renderRoomsTable();

  Swal.fire({
    title: '¡Habitación eliminada exitosamente! 🧹',
    text: 'La habitación ha sido removida del sistema.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}