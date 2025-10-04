// Lógica para la página de disponibilidad y gestión de reservas
import { getRooms, getReservations, saveReservations } from './storage.js';

// Estado global
let currentUser = null; // Se debe asignar tras login con rol y datos
let rooms = [];
let reservations = [];

// Inicializar la app de reservas
export function initReservationApp(user) {
  currentUser = user;
  rooms = getRooms();
  reservations = getReservations();
  renderApp();
}

// Renderizar la interfaz según rol
function renderApp() {
  const container = document.getElementById('reservation-app');
  container.innerHTML = '';

  if (!currentUser) {
    container.innerHTML = '<p>Por favor, inicia sesión para gestionar reservas.</p>';
    return;
  }

  if (currentUser.role === 'admin') {
    renderAdminPanel(container);
  } else if (currentUser.role === 'usuario') {
    renderUserPanel(container);
  } else {
    container.innerHTML = '<p>Rol de usuario no reconocido.</p>';
  }
}

// Panel para usuarios
function renderUserPanel(container) {
  const html = `
    <h2>Habitaciones disponibles</h2>
    <div id="room-list"></div>
    <div id="user-reservations"></div>
  `;
  container.innerHTML = html;
  renderRoomList();
  renderUserReservations();
}

// Panel para administradores
import { initRoomManagement } from './habitaciones.js';
import { initAdminReservationManagement } from './adminReservas.js';

function renderAdminPanel(container) {
  const html = `
    <h2>Gestión de habitaciones</h2>
    <div id="admin-room-management"></div>
    <h2>Gestión de reservas</h2>
    <div id="admin-reservation-management"></div>
  `;
  container.innerHTML = html;
  initRoomManagement();
  initAdminReservationManagement();
}

// Renderizar lista de habitaciones para usuario
function renderRoomList() {
  const listContainer = document.getElementById('room-list');
  listContainer.innerHTML = '';

  rooms.forEach(room => {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-card';
    roomDiv.innerHTML = `
      <h3>Habitación ${room.id}</h3>
      <p>Camas: ${room.beds}</p>
      <p>Servicios: ${room.services.join(', ')}</p>
      <p>Precio por noche: $${room.price}</p>
      <p>Capacidad máxima: ${room.maxPersons}</p>
      <button data-room-id="${room.id}" class="btn-reserve">Reservar</button>
    `;
    listContainer.appendChild(roomDiv);
  });

  // Añadir eventos a botones reservar
  document.querySelectorAll('.btn-reserve').forEach(btn => {
    btn.addEventListener('click', e => {
      const roomId = e.target.getAttribute('data-room-id');
      openReservationForm(roomId);
    });
  });
}

// Abrir formulario de reserva para usuario
function openReservationForm(roomId) {
  const room = rooms.find(r => r.id == roomId);
  if (!room) {
    alert('Habitación no encontrada');
    return;
  }

  const container = document.getElementById('room-list');
  container.innerHTML = `
    <h3>Reservar Habitación ${room.id}</h3>
    <form id="reservation-form">
      <label>Fecha inicio: <input type="date" id="start-date" required></label><br/>
      <label>Fecha fin: <input type="date" id="end-date" required></label><br/>
      <label>Personas: <input type="number" id="persons" min="1" max="${room.maxPersons}" value="1" required></label><br/>
      <button type="submit">Confirmar Reserva</button>
      <button type="button" id="cancel-reservation">Cancelar</button>
    </form>
  `;

  document.getElementById('reservation-form').addEventListener('submit', e => {
    e.preventDefault();
    confirmReservation(room);
  });

  document.getElementById('cancel-reservation').addEventListener('click', e => {
    renderRoomList();
  });
}

// Confirmar reserva usuario
function confirmReservation(room) {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const persons = parseInt(document.getElementById('persons').value);

  if (!startDate || !endDate || !persons) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (persons > room.maxPersons) {
    alert('Número de personas excede la capacidad máxima');
    return;
  }

  // Verificar disponibilidad
  if (!isRoomAvailable(room.id, startDate, endDate)) {
    alert('La habitación no está disponible en las fechas seleccionadas');
    return;
  }

  // Registrar reserva
  const newReservation = {
    id: Date.now(),
    roomId: room.id,
    userId: currentUser.identificacion,
    startDate,
    endDate,
    persons
  };
  reservations.push(newReservation);
  saveReservations(reservations);
  alert('Reserva confirmada');
  renderRoomList();
  renderUserReservations();
}

// Verificar disponibilidad habitación
function isRoomAvailable(roomId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const res of reservations) {
    if (res.roomId == roomId) {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      if ((start <= resEnd) && (end >= resStart)) {
        return false;
      }
    }
  }
  return true;
}

// Renderizar reservas del usuario
function renderUserReservations() {
  const container = document.getElementById('user-reservations');
  container.innerHTML = '<h3>Mis Reservas</h3>';

  const userReservations = reservations.filter(r => r.userId === currentUser.identificacion);
  if (userReservations.length === 0) {
    container.innerHTML += '<p>No tienes reservas activas.</p>';
    return;
  }

  userReservations.forEach(res => {
    const room = rooms.find(r => r.id == res.roomId);
    const resDiv = document.createElement('div');
    resDiv.className = 'user-reservation';
    resDiv.innerHTML = `
      <p>Habitación ${room.id} - ${res.startDate} a ${res.endDate} - Personas: ${res.persons}</p>
      <button data-res-id="${res.id}" class="btn-cancel-reservation">Cancelar Reserva</button>
    `;
    container.appendChild(resDiv);
  });

  // Añadir eventos para cancelar reserva
  document.querySelectorAll('.btn-cancel-reservation').forEach(btn => {
    btn.addEventListener('click', e => {
      const resId = e.target.getAttribute('data-res-id');
      cancelReservation(resId);
    });
  });
}

// Cancelar reserva usuario
function cancelReservation(resId) {
  const index = reservations.findIndex(r => r.id == resId);
  if (index === -1) {
    alert('Reserva no encontrada');
    return;
  }
  reservations.splice(index, 1);
  saveReservations(reservations);
  alert('Reserva cancelada');
  renderUserReservations();
  renderRoomList();
}

// Renderizar gestión de habitaciones para admin
function renderAdminRoomManagement() {
  const container = document.getElementById('admin-room-management');
  container.innerHTML = '<p>Gestión de habitaciones próximamente...</p>';
}

// Renderizar gestión de reservas para admin
function renderAdminReservationManagement() {
  const container = document.getElementById('admin-reservation-management');
  container.innerHTML = '<p>Gestión de reservas próximamente...</p>';
}
