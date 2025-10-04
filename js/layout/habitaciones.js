// Lógica para la gestión de habitaciones por el administrador
import { getRooms, saveRooms } from './storage.js';

let rooms = [];

// Inicializar gestión de habitaciones
export function initRoomManagement() {
  rooms = getRooms();
  renderRoomManagement();
}

// Renderizar interfaz de gestión de habitaciones
function renderRoomManagement() {
  const container = document.getElementById('admin-room-management');
  container.innerHTML = `
    <button id="btn-add-room">Agregar Habitación</button>
    <div id="room-list"></div>
    <div id="room-form-container" style="display:none;"></div>
  `;

  document.getElementById('btn-add-room').addEventListener('click', () => {
    openRoomForm();
  });

  renderRoomList();
}

// Renderizar lista de habitaciones
function renderRoomList() {
  const listContainer = document.getElementById('room-list');
  listContainer.innerHTML = '';

  rooms.forEach(room => {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-card';
    roomDiv.innerHTML = `
      <h3>Habitación ${room.id}</h3>
      <p>Camas: ${room.beds}</p>
      <p>Personas máximo: ${room.maxPersons}</p>
      <p>Precio por noche: $${room.price}</p>
      <p>Servicios: ${room.services.join(', ')}</p>
      <button data-room-id="${room.id}" class="btn-edit-room">Editar</button>
      <button data-room-id="${room.id}" class="btn-delete-room">Eliminar</button>
    `;
    listContainer.appendChild(roomDiv);
  });

  // Eventos editar y eliminar
  document.querySelectorAll('.btn-edit-room').forEach(btn => {
    btn.addEventListener('click', e => {
      const roomId = e.target.getAttribute('data-room-id');
      openRoomForm(roomId);
    });
  });

  document.querySelectorAll('.btn-delete-room').forEach(btn => {
    btn.addEventListener('click', e => {
      const roomId = e.target.getAttribute('data-room-id');
      deleteRoom(roomId);
    });
  });
}

// Abrir formulario para agregar o editar habitación
function openRoomForm(roomId = null) {
  const formContainer = document.getElementById('room-form-container');
  formContainer.style.display = 'block';

  let room = {
    id: '',
    beds: '',
    maxPersons: '',
    price: '',
    services: []
  };

  if (roomId) {
    room = rooms.find(r => r.id == roomId);
    if (!room) {
      alert('Habitación no encontrada');
      return;
    }
  }

  formContainer.innerHTML = `
    <h3>${roomId ? 'Editar' : 'Agregar'} Habitación</h3>
    <form id="room-form">
      <label>ID: <input type="text" id="room-id" value="${room.id}" ${roomId ? 'readonly' : ''} required></label><br/>
      <label>Camas: <input type="number" id="room-beds" value="${room.beds}" min="1" required></label><br/>
      <label>Personas máximo: <input type="number" id="room-max-persons" value="${room.maxPersons}" min="1" required></label><br/>
      <label>Precio por noche: <input type="number" id="room-price" value="${room.price}" min="0" required></label><br/>
      <label>Servicios (separados por coma): <input type="text" id="room-services" value="${room.services.join(', ')}"></label><br/>
      <button type="submit">${roomId ? 'Guardar' : 'Agregar'}</button>
      <button type="button" id="cancel-room-form">Cancelar</button>
    </form>
  `;

  document.getElementById('room-form').addEventListener('submit', e => {
    e.preventDefault();
    saveRoom(roomId);
  });

  document.getElementById('cancel-room-form').addEventListener('click', e => {
    formContainer.style.display = 'none';
  });
}

// Guardar habitación (agregar o editar)
function saveRoom(roomId) {
  const id = document.getElementById('room-id').value.trim();
  const beds = parseInt(document.getElementById('room-beds').value);
  const maxPersons = parseInt(document.getElementById('room-max-persons').value);
  const price = parseFloat(document.getElementById('room-price').value);
  const services = document.getElementById('room-services').value.split(',').map(s => s.trim()).filter(s => s);

  if (!id || isNaN(beds) || isNaN(maxPersons) || isNaN(price)) {
    alert('Por favor completa todos los campos correctamente');
    return;
  }

  if (roomId) {
    // Editar habitación existente
    const index = rooms.findIndex(r => r.id == roomId);
    if (index === -1) {
      alert('Habitación no encontrada');
      return;
    }
    rooms[index] = { id, beds, maxPersons, price, services };
  } else {
    // Agregar nueva habitación
    if (rooms.find(r => r.id == id)) {
      alert('Ya existe una habitación con ese ID');
      return;
    }
    rooms.push({ id, beds, maxPersons, price, services });
  }

  saveRooms(rooms);
  alert('Habitación guardada correctamente');
  document.getElementById('room-form-container').style.display = 'none';
  renderRoomList();
}

// Eliminar habitación
function deleteRoom(roomId) {
  if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;
  rooms = rooms.filter(r => r.id != roomId);
  saveRooms(rooms);
  alert('Habitación eliminada');
  renderRoomList();
}
