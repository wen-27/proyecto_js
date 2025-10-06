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

// Renderizar tabla de habitaciones
function renderRoomsTable() {
  const container = document.getElementById('rooms-table-container');
  if (!container) return;

  const table = document.createElement('table');
  table.className = 'admin-rooms-table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Camas</th>
        <th>Capacidad</th>
        <th>Precio/Noche</th>
        <th>Servicios</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${rooms.map(room => `
        <tr>
          <td>${room.id}</td>
          <td>${room.name}</td>
          <td>${room.beds}</td>
          <td>${room.capacity}</td>
          <td>$${room.pricePerNight.toLocaleString()}</td>
          <td>${room.services.join(', ')}</td>
          <td>
            <button class="btn-edit" data-room-id="${room.id}">Editar</button>
            <button class="btn-delete" data-room-id="${room.id}">Eliminar</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.innerHTML = '';
  container.appendChild(table);

  // Event listeners para botones de editar y eliminar
  table.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.target.dataset.roomId);
      const room = rooms.find(r => r.id === roomId);
      if (room) showRoomForm(room);
    });
  });

  table.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.target.dataset.roomId);
      if (confirm('¿Está seguro de que desea eliminar esta habitación?')) {
        deleteRoom(roomId);
      }
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
  alert('Habitación guardada exitosamente');
}

// Eliminar habitación
function deleteRoom(roomId) {
  rooms = rooms.filter(r => r.id !== roomId);
  saveRoomsToStorage();
  renderRoomsTable();
  alert('Habitación eliminada exitosamente');
}
