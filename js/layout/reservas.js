// Lógica para la página de reservas

import { isUserLoggedIn } from './auth.js';
import { showSection } from './navbar.js';
import { getRooms } from './storage.js';
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

document.addEventListener('DOMContentLoaded', () => {
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
      const availableRooms = rooms.filter(room => room.capacity >= numPersonas && room.available);

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
