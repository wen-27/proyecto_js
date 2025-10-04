// Lógica para la gestión de reservas por el administrador
import { getReservations, saveReservations, getRooms } from './storage.js';

let reservations = [];
let rooms = [];

// Inicializar gestión de reservas
export function initAdminReservationManagement() {
  reservations = getReservations();
  rooms = getRooms();
  renderReservationManagement();
}

// Renderizar interfaz de gestión de reservas
function renderReservationManagement() {
  const container = document.getElementById('admin-reservation-management');
  container.innerHTML = '';

  if (reservations.length === 0) {
    container.innerHTML = '<p>No hay reservas registradas.</p>';
    return;
  }

  reservations.forEach(res => {
    const room = rooms.find(r => r.id == res.roomId);
    const resDiv = document.createElement('div');
    resDiv.className = 'admin-reservation-card';
    resDiv.innerHTML = `
      <p>Reserva ID: ${res.id}</p>
      <p>Habitación: ${room ? room.id : 'Desconocida'}</p>
      <p>Usuario ID: ${res.userId}</p>
      <p>Fecha inicio: ${res.startDate}</p>
      <p>Fecha fin: ${res.endDate}</p>
      <p>Personas: ${res.persons}</p>
      <button data-res-id="${res.id}" class="btn-edit-reservation">Modificar</button>
      <button data-res-id="${res.id}" class="btn-cancel-reservation">Cancelar</button>
    `;
    container.appendChild(resDiv);
  });

  // Eventos botones modificar y cancelar
  document.querySelectorAll('.btn-edit-reservation').forEach(btn => {
    btn.addEventListener('click', e => {
      const resId = e.target.getAttribute('data-res-id');
      openEditReservationForm(resId);
    });
  });

  document.querySelectorAll('.btn-cancel-reservation').forEach(btn => {
    btn.addEventListener('click', e => {
      const resId = e.target.getAttribute('data-res-id');
      cancelReservation(resId);
    });
  });
}

// Abrir formulario para modificar reserva
function openEditReservationForm(resId) {
  const reservation = reservations.find(r => r.id == resId);
  if (!reservation) {
    alert('Reserva no encontrada');
    return;
  }

  const container = document.getElementById('admin-reservation-management');
  container.innerHTML = `
    <h3>Modificar Reserva ID: ${reservation.id}</h3>
    <form id="edit-reservation-form">
      <label>Fecha inicio: <input type="date" id="edit-start-date" value="${reservation.startDate}" required></label><br/>
      <label>Fecha fin: <input type="date" id="edit-end-date" value="${reservation.endDate}" required></label><br/>
      <label>Personas: <input type="number" id="edit-persons" value="${reservation.persons}" min="1" required></label><br/>
      <button type="submit">Guardar Cambios</button>
      <button type="button" id="cancel-edit-reservation">Cancelar</button>
    </form>
  `;

  document.getElementById('edit-reservation-form').addEventListener('submit', e => {
    e.preventDefault();
    saveEditedReservation(reservation.id);
  });

  document.getElementById('cancel-edit-reservation').addEventListener('click', e => {
    renderReservationManagement();
  });
}

// Guardar cambios en reserva modificada
function saveEditedReservation(resId) {
  const startDate = document.getElementById('edit-start-date').value;
  const endDate = document.getElementById('edit-end-date').value;
  const persons = parseInt(document.getElementById('edit-persons').value);

  if (!startDate || !endDate || !persons) {
    alert('Por favor completa todos los campos');
    return;
  }

  const index = reservations.findIndex(r => r.id == resId);
  if (index === -1) {
    alert('Reserva no encontrada');
    return;
  }

  // Verificar disponibilidad para la habitación excluyendo la reserva actual
  const roomId = reservations[index].roomId;
  if (!isRoomAvailable(roomId, startDate, endDate, resId)) {
    alert('La habitación no está disponible en las fechas seleccionadas');
    return;
  }

  reservations[index].startDate = startDate;
  reservations[index].endDate = endDate;
  reservations[index].persons = persons;

  saveReservations(reservations);
  alert('Reserva modificada correctamente');
  renderReservationManagement();
}

// Cancelar reserva admin
function cancelReservation(resId) {
  if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
  const index = reservations.findIndex(r => r.id == resId);
  if (index === -1) {
    alert('Reserva no encontrada');
    return;
  }
  reservations.splice(index, 1);
  saveReservations(reservations);
  alert('Reserva cancelada');
  renderReservationManagement();
}

// Verificar disponibilidad habitación (excluyendo reserva actual si se pasa)
function isRoomAvailable(roomId, startDate, endDate, excludeResId = null) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const res of reservations) {
    if (res.roomId == roomId && res.id !== excludeResId) {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      if ((start <= resEnd) && (end >= resStart)) {
        return false;
      }
    }
  }
  return true;
}
