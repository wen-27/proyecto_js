// Modal para detalles de habitación y reserva

import { isUserLoggedIn } from '../layout/auth.js';
import { showSection } from '../layout/navbar.js';
import { addReservation, checkRoomAvailability, getAvailableDateRanges } from '../layout/storage.js';

let currentRoom = null;
let currentSearchData = null;

export function showRoomModal(room, searchData) {
  currentRoom = room;
  currentSearchData = searchData;

  const modal = document.getElementById('room-modal');
  if (!modal) return;

  const numNights = Math.ceil((new Date(searchData.fechaSalida) - new Date(searchData.fechaEntrada)) / (1000 * 60 * 60 * 24));
  const totalPrice = room.pricePerNight * numNights;

  const availableRanges = getAvailableDateRanges(room.id);
  const rangesText = availableRanges.length > 0
    ? availableRanges.map(range => `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`).join(', ')
    : 'No hay fechas disponibles próximamente.';

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${room.name}</h2>
      <img src="${room.image}" alt="${room.name}" style="width: 100%; max-height: 300px; object-fit: cover;">
      <p>${room.description}</p>
      <div class="room-details">
        <p><strong>Ubicación:</strong> ${room.location}</p>
        <p><strong>Capacidad:</strong> ${room.capacity} personas</p>
        <p><strong>Camas:</strong> ${room.beds}</p>
        <p><strong>Servicios:</strong> ${room.services.join(', ')}</p>
        <p><strong>Precio por noche:</strong> $${room.pricePerNight.toLocaleString()}</p>
        <p><strong>Rango de fechas disponibles:</strong> ${rangesText}</p>
        <p><strong>Fecha de entrada:</strong> ${searchData.fechaEntrada}</p>
        <p><strong>Fecha de salida:</strong> ${searchData.fechaSalida}</p>
        <p><strong>Número de noches:</strong> ${numNights}</p>
        <p><strong>Número de personas:</strong> ${searchData.numPersonas}</p>
        <p><strong>Precio total:</strong> $${totalPrice.toLocaleString()}</p>
      </div>
      <button class="btn-reserve-modal">Reservar Ahora</button>
    </div>
  `;

  modal.style.display = 'block';

  // Cerrar modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Reservar
  modal.querySelector('.btn-reserve-modal').addEventListener('click', () => {
  if (!isUserLoggedIn()) {
    Swal.fire({
      title: 'Debes iniciar sesión',
      text: 'Para hacer una reserva, primero inicia sesión en tu cuenta.',
      icon: 'warning',
      confirmButtonText: 'Ir a iniciar sesión'
    }).then(() => {
      showSection('login');
      modal.style.display = 'none';
    });
    return;
  }

    // Verificar disponibilidad antes de reservar
  if (!checkRoomAvailability(room.id, searchData.fechaEntrada, searchData.fechaSalida)) {
  Swal.fire({
    title: 'Lo sentimos 😔',
    text: 'La habitación ya no está disponible para las fechas seleccionadas.',
    icon: 'error',
    confirmButtonText: 'Entendido'
  }).then(() => {
    modal.style.display = 'none';
  });
  return;
}

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const reservation = {
      id: Date.now(),
      roomId: room.id,
      fechaEntrada: searchData.fechaEntrada,
      fechaSalida: searchData.fechaSalida,
      numPersonas: searchData.numPersonas,
      totalPrice: totalPrice,
      userEmail: currentUser ? currentUser.email : null,
      fechaReserva: new Date().toISOString()
    };

addReservation(reservation);

Swal.fire({
  title: '¡Reserva realizada exitosamente! 🎉',
  text: 'Tu reserva ha sido confirmada.',
  icon: 'success',
  confirmButtonText: 'Aceptar'
}).then(() => {
  modal.style.display = 'none';
  });
  
    // Disparar evento para recargar reservas
    window.dispatchEvent(new CustomEvent('reservationUpdated'));
  });
}
