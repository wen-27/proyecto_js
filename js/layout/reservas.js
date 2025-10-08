// Lógica para la página de reservas

import { isUserLoggedIn } from './auth.js';
import { showSection } from './navbar-layout.js';
import { getRooms, getReservations, saveReservations, checkRoomAvailability, updateReservation, getCurrentUser, addNotification } from './storage.js';
import { showRoomModal } from './modalReserva.js';
import { createRoomCard } from '../components/cardRoom.js';



function loadReservations() {
  const currentUser = getCurrentUser();
  let reservations = getReservations();

  
  if (currentUser && currentUser.role !== 'admin') {
    reservations = reservations.filter(r => r.userEmail === currentUser.email);
  }

  const reservationsList = document.querySelector('.reservations-list');
  if (!reservationsList) return;
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

  // Confirmaciónes
  document.querySelectorAll('.btn-cancel').forEach(button => {
    button.addEventListener('click', (e) => {
      const reservationId = parseInt(e.target.dataset.reservationId);
      const card = e.target.closest('.reservation-card');

      Swal.fire({
        title: "¿Estás segura?",
        text: "Esta acción cancelará la reserva y no podrás revertirla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, volver"
      }).then((result) => {
        if (result.isConfirmed) {
          cancelReservation(reservationId);
         
          card.style.transition = "all 0.5s ease";
          card.style.opacity = "0";
          card.style.transform = "translateY(-10px)";
          setTimeout(() => {
            card.remove();
            if (document.querySelectorAll('.reservation-card').length === 0) {
              reservationsList.innerHTML = `
                <div class="no-reservations">
                  <div class="no-reservations-icon">📅</div>
                  <h3>No hay reservas activas</h3>
                  <p>¡Haz tu primera reserva ahora!</p>
                </div>
              `;
            }
          }, 400);

          Swal.fire({
            title: 'Reserva cancelada 🗑️',
            text: 'La reserva ha sido eliminada exitosamente.',
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
  const reservationToCancel = reservations.find(r => r.id === reservationId);
  const currentUser = getCurrentUser();

  reservations = reservations.filter(r => r.id !== reservationId);
  saveReservations(reservations);

  if (currentUser && currentUser.role === 'admin' && reservationToCancel && reservationToCancel.userEmail !== currentUser.email) {
    addNotification(reservationToCancel.userEmail, 'Tu reserva ha sido cancelada por el administrador.');
  }

  loadReservations();
  loadAdminReservations(); 

  Swal.fire({
    title: 'Reserva cancelada 🗑️',
    text: 'La reserva ha sido eliminada exitosamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}

function loadAdminReservations() {
  const reservations = getReservations();
  const adminReservationsList = document.querySelector('.admin-reservations-list');
  if (!adminReservationsList) return;
  adminReservationsList.innerHTML = '';

  if (reservations.length === 0) {
    adminReservationsList.innerHTML = `
      <div class="no-reservations">
        <div class="no-reservations-icon">📅</div>
        <h3>No hay reservas activas</h3>
        <p>No hay reservas para gestionar.</p>
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
            <div class="data-label">Cliente</div>
            <div class="data-value">${reservation.userEmail}</div>
          </div>
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
        <button class="btn-action btn-modify" data-reservation-id="${reservation.id}">Modificar Reserva</button>
        <button class="btn-action btn-cancel" data-reservation-id="${reservation.id}">Cancelar Reserva</button>
      </div>
    `;
    adminReservationsList.appendChild(reservationCard);
  });

  document.querySelectorAll('.admin-reservations-list .btn-cancel').forEach(button => {
    button.addEventListener('click', (e) => {
      const reservationId = parseInt(e.target.dataset.reservationId);
      const card = e.target.closest('.reservation-card');

      Swal.fire({
        title: "¿Estás segura?",
        text: "Esta acción cancelará la reserva del cliente y no podrás revertirla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, volver"
      }).then((result) => {
        if (result.isConfirmed) {
          cancelReservation(reservationId);
          card.style.transition = "all 0.5s ease";
          card.style.opacity = "0";
          card.style.transform = "translateY(-10px)";
          setTimeout(() => {
            card.remove();
            if (document.querySelectorAll('.admin-reservations-list .reservation-card').length === 0) {
              adminReservationsList.innerHTML = `
                <div class="no-reservations">
                  <div class="no-reservations-icon">📅</div>
                  <h3>No hay reservas activas</h3>
                  <p>No hay reservas para gestionar.</p>
                </div>
              `;
            }
          }, 400);

          Swal.fire({
            title: 'Reserva cancelada 🗑️',
            text: 'La reserva ha sido eliminada exitosamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  });

  document.querySelectorAll('.admin-reservations-list .btn-modify').forEach(button => {
    button.addEventListener('click', (e) => {
      const reservationId = parseInt(e.target.dataset.reservationId);
      openModifyReservationModal(reservationId);
    });
  });
}


function openModifyReservationModal(reservationId) {
  const reservations = getReservations();
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation) {
    Swal.fire({ title: 'Reserva no encontrada', icon: 'error' });
    return;
  }

  Swal.fire({
    title: 'Modificar Reserva',
    html:
      `<label for="fechaEntrada">Fecha de entrada:</label>` +
      `<input type="date" id="fechaEntrada" class="swal2-input" value="${reservation.fechaEntrada}">` +
      `<label for="fechaSalida">Fecha de salida:</label>` +
      `<input type="date" id="fechaSalida" class="swal2-input" value="${reservation.fechaSalida}">` +
      `<label for="numPersonas">Número de personas:</label>` +
      `<input type="number" id="numPersonas" class="swal2-input" min="1" value="${reservation.numPersonas}">`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const fechaEntrada = document.getElementById('fechaEntrada').value;
      const fechaSalida = document.getElementById('fechaSalida').value;
      const numPersonas = parseInt(document.getElementById('numPersonas').value);

      if (!fechaEntrada || !fechaSalida || !numPersonas) {
        Swal.showValidationMessage('Por favor, completa todos los campos');
        return false;
      }

      if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
        Swal.showValidationMessage('La fecha de salida debe ser posterior a la de entrada');
        return false;
      }

      return { fechaEntrada, fechaSalida, numPersonas };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { fechaEntrada, fechaSalida, numPersonas } = result.value;
 
      if (!checkRoomAvailability(reservation.roomId, fechaEntrada, fechaSalida)) {
        Swal.fire({
          title: 'No disponible',
          text: 'La habitación no está disponible en las fechas seleccionadas.',
          icon: 'error'
        });
        return;
      }

      
      const updated = updateReservation(reservationId, {
        fechaEntrada,
        fechaSalida,
        numPersonas
      });

      if (updated) {
        Swal.fire({
          title: 'Reserva modificada',
          text: 'La reserva ha sido actualizada exitosamente.',
          icon: 'success'
        });
        loadReservations();
        loadAdminReservations();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la reserva.',
          icon: 'error'
        });
      }
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  loadReservations(); // Cargar reservas al inicio
  loadAdminReservations(); // Cargar reservas de admin si aplica

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
    loadAdminReservations();
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

// Manejar clics en botones de reservar del carrusel
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('reserve-button-carousel')) {
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

    // Si está logueado, ir a la sección de reservas
    showSection('reservas');
  }
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
