// Lógica para la página de reservas

import { isUserLoggedIn } from './auth.js';
import { showSection } from './navbar.js';
import { getRooms, getReservations, saveReservations, checkRoomAvailability } from './storage.js';
import { showRoomModal } from '../components/modalReserva.js';
import { createRoomCard } from '../components/cardRoom.js';



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

  // Confirmación con SweetAlert2 💫
  document.querySelectorAll('.btn-cancel').forEach(button => {
    button.addEventListener('click', (e) => {
      const reservationId = parseInt(e.target.dataset.reservationId);
      const card = e.target.closest('.reservation-card');

      Swal.fire({
        title: "¿Estás segura?",
        text: "Esta acción cancelará tu reserva y no podrás revertirla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, volver"
      }).then((result) => {
        if (result.isConfirmed) {
          cancelReservation(reservationId);
          // ✨ Animación de eliminación visual
          card.style.transition = "all 0.5s ease";
          card.style.opacity = "0";
          card.style.transform = "translateY(-10px)";
          setTimeout(() => {
            card.remove();
            if (document.querySelectorAll('.reservation-card').length === 0) {
              reservationsList.innerHTML = `
                <div class="no-reservations">
                  <div class="no-reservations-icon">📅</div>
                  <h3>No tienes reservas activas</h3>
                  <p>¡Haz tu primera reserva ahora!</p>
                </div>
              `;
            }
          }, 400);

          Swal.fire({
            title: 'Reserva cancelada 🗑️',
            text: 'Tu reserva ha sido eliminada exitosamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  });
}


function cancelReservation(reservationId) {
  let reservations = getReservations();
  reservations = reservations.filter(r => r.id !== reservationId);
  saveReservations(reservations);
  loadReservations();

  Swal.fire({
    title: 'Reserva cancelada 🗑️',
    text: 'Tu reserva ha sido eliminada exitosamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}


document.addEventListener('DOMContentLoaded', () => {
  loadReservations(); // Cargar reservas al inicio

  // Poblar select de ubicaciones
  const ubicacionSelect = document.getElementById('ubicacion');
  if (ubicacionSelect) {
    const rooms = getRooms();
    const locations = [...new Set(rooms.map(room => room.location))];
    locations.forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      ubicacionSelect.appendChild(option);
    });
  }

  // Escuchar actualizaciones de reservas
  window.addEventListener('reservationUpdated', () => {
    loadReservations();
  });

  // Manejar clics en botones de reservar
document.querySelectorAll('.btn-reserve, .reserve-button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    if (!isUserLoggedIn()) {
      Swal.fire({
        title: 'Inicia sesión 🔒',
        text: 'Debes iniciar sesión para hacer una reserva.',
        icon: 'warning',
        confirmButtonText: 'Ir al login'
      }).then(() => {
        showSection('login');
      });
      return;
    }

    // Aquí iría la lógica real de reserva (guardar, validar fechas, etc.)

    Swal.fire({
      title: '¡Reserva exitosa! 🎉',
      text: 'Tu reserva ha sido realizada correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
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
      const ubicacion = document.getElementById('ubicacion').value;

      if (!fechaEntrada || !fechaSalida || !numPersonas) {
      Swal.fire({
      title: 'Campos incompletos 📝',
      text: 'Por favor, completa todos los campos.',
      icon: 'warning',
      confirmButtonText: 'Entendido'
    });
    return;
    }

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    if (entrada >= salida) {
    Swal.fire({
    title: 'Fechas inválidas 📅',
    text: 'La fecha de salida debe ser posterior a la de entrada.',
    icon: 'error',
    confirmButtonText: 'Corregir'
    });
    return;
    }




      const rooms = getRooms();
      let availableRooms = rooms.filter(room => room.capacity >= numPersonas && room.available && checkRoomAvailability(room.id, fechaEntrada, fechaSalida));

      if (ubicacion) {
        availableRooms = availableRooms.filter(room => room.location.toLowerCase() === ubicacion.toLowerCase());
      }

      const roomsGrid = document.querySelector('.rooms-grid');
      roomsGrid.innerHTML = '';

      if (availableRooms.length === 0) {
        roomsGrid.innerHTML = '<p>No hay habitaciones disponibles para los criterios seleccionados.</p>';
        return;
      }

      const numNights = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

      availableRooms.forEach(room => {
        const roomCard = createRoomCard(room, numNights);
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
