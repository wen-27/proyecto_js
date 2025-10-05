// Lógica para la página de reservas

import { isUserLoggedIn } from './auth.js';
import { showSection } from './navbar.js';
import { getRooms, getReservations, saveReservations, checkRoomAvailability } from './storage.js';
import { showRoomModal } from '../components/modalReserva.js';

function getServiceIcon(service) {
  const icons = {
    'WiFi': '📶',
    'Minibar': '🍷',
    'Jacuzzi': '🛁',
    'Vista panorámica': '🏞️',
    'Cafetera': '☕',
    'Escritorio': '💼',
    'Área de juegos': '🎮',
    'Cocina': '🍳'
  };
  return icons[service] || '✅';
}

function loadReservations() {
  const reservations = getReservations();
  const reservationsList = document.querySelector('.reservations-list');
  reservationsList.innerHTML = '';

  if (reservations.length === 0) {
    reservationsList.innerHTML = `
      <div class="no-reservations">
        <div class="no-reservations-icon">📅</div>
        <h3>No tienes reservas activas</h3>
        <p>¡Haz tu primera reserva ahora!</p>
      </div>
    `;
    return;
  }

  reservations.forEach(reservation => {
    const room = getRooms().find(r => r.id === reservation.roomId);
    if (!room) return;

    const reservationCard = document.createElement('div');
    reservationCard.className = 'reservation-card active-reservation';
    reservationCard.innerHTML = `
      <div class="reservation-status">
        <div class="status-badge confirmed">Confirmada</div>
        <div class="reservation-id">ID: ${reservation.id}</div>
      </div>
      <div class="reservation-details">
        <div class="reservation-room">
          <div class="room-icon">🛏️</div>
          <div class="room-info">
            <h3>${room.name}</h3>
            <p>${room.description}</p>
          </div>
        </div>
        <div class="reservation-data">
          <div class="data-item">
            <div class="data-label">Fecha de entrada</div>
            <div class="data-value">${reservation.fechaEntrada}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Fecha de salida</div>
            <div class="data-value">${reservation.fechaSalida}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Personas</div>
            <div class="data-value">${reservation.numPersonas}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Precio total</div>
            <div class="data-value highlight">$${reservation.totalPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div class="reservation-actions">
        <button class="btn-action btn-details" data-reservation-id="${reservation.id}">Ver Detalles</button>
        <button class="btn-action btn-cancel" data-reservation-id="${reservation.id}">Cancelar Reserva</button>
      </div>
    `;
    reservationsList.appendChild(reservationCard);
  });

  // Agregar event listeners para cancelar
  document.querySelectorAll('.btn-cancel').forEach(button => {
    button.addEventListener('click', (e) => {
      const reservationId = parseInt(e.target.dataset.reservationId);
      if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
        cancelReservation(reservationId);
      }
    });
  });
}

function cancelReservation(reservationId) {
  let reservations = getReservations();
  reservations = reservations.filter(r => r.id !== reservationId);
  saveReservations(reservations);
  loadReservations(); // Recargar la lista
  alert('Reserva cancelada exitosamente.');
}

document.addEventListener('DOMContentLoaded', () => {
  loadReservations(); // Cargar reservas al inicio

  // Escuchar actualizaciones de reservas
  window.addEventListener('reservationUpdated', () => {
    loadReservations();
  });

  // Manejar clics en botones de reservar
  document.querySelectorAll('.btn-reserve, .reserve-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isUserLoggedIn()) {
        alert('Debes iniciar sesión para hacer una reserva.');
        showSection('login');
        return;
      }
      // Aquí iría la lógica para procesar la reserva
      alert('Reserva realizada exitosamente!');
      // Podrías redirigir a una página de confirmación o mostrar un modal
    });
  });

  // Manejar búsqueda de habitaciones
  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const fechaEntrada = document.getElementById('fecha-entrada').value;
      const fechaSalida = document.getElementById('fecha-salida').value;
      const numPersonas = parseInt(document.getElementById('num-personas').value);

      if (!fechaEntrada || !fechaSalida || !numPersonas) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      const entrada = new Date(fechaEntrada);
      const salida = new Date(fechaSalida);

      if (entrada >= salida) {
        alert('La fecha de salida debe ser posterior a la de entrada.');
        return;
      }

      const rooms = getRooms();
      const availableRooms = rooms.filter(room => room.capacity >= numPersonas && room.available && checkRoomAvailability(room.id, fechaEntrada, fechaSalida));

      const roomsGrid = document.querySelector('.rooms-grid');
      roomsGrid.innerHTML = '';

      if (availableRooms.length === 0) {
        roomsGrid.innerHTML = '<p>No hay habitaciones disponibles para los criterios seleccionados.</p>';
        return;
      }

      const numNights = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

      availableRooms.forEach(room => {
        const totalPrice = room.pricePerNight * numNights;
        const roomCard = document.createElement('div');
        roomCard.className = 'room-result-card';
        roomCard.innerHTML = `
          <div class="room-result-image">
            <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 150px; object-fit: cover;">
          </div>
          <div class="room-result-content">
            <h3>${room.name}</h3>
            <p>${room.description}</p>
            <div class="room-features">
              <span>👥 ${room.capacity} personas</span>
              <span>🛏️ ${room.beds} camas</span>
              ${room.services.map(service => `<span>${getServiceIcon(service)} ${service}</span>`).join('')}
            </div>
            <div class="room-price">$${totalPrice.toLocaleString()} <span>total (${numNights} noches)</span></div>
            <button class="btn-details" data-room-id="${room.id}">Ver Detalles</button>
          </div>
        `;
        roomsGrid.appendChild(roomCard);
      });

      // Agregar event listeners a los botones de detalles
      document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', (e) => {
          const roomId = parseInt(e.target.dataset.roomId);
          const room = availableRooms.find(r => r.id === roomId);
          const searchData = { fechaEntrada, fechaSalida, numPersonas };
          showRoomModal(room, searchData);
        });
      });
    });
  }
});
