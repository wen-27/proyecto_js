// Modal para detalles de habitación y reserva

import { isUserLoggedIn } from '../layout/auth.js';
import { showSection } from '../layout/navbar.js';
import { addReservation } from '../layout/storage.js';

let currentRoom = null;
let currentSearchData = null;

export function showRoomModal(room, searchData) {
  currentRoom = room;
  currentSearchData = searchData;

  const modal = document.getElementById('room-modal');
  if (!modal) return;

  const numNights = Math.ceil((new Date(searchData.fechaSalida) - new Date(searchData.fechaEntrada)) / (1000 * 60 * 60 * 24));
  const totalPrice = room.pricePerNight * numNights;

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${room.name}</h2>
      <img src="${room.image}" alt="${room.name}" style="width: 100%; max-height: 300px; object-fit: cover;">
      <p>${room.description}</p>
      <div class="room-details">
        <p><strong>Capacidad:</strong> ${room.capacity} personas</p>
        <p><strong>Camas:</strong> ${room.beds}</p>
        <p><strong>Servicios:</strong> ${room.services.join(', ')}</p>
        <p><strong>Precio por noche:</strong> $${room.pricePerNight.toLocaleString()}</p>
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
      alert('Debes iniciar sesión para hacer una reserva.');
      showSection('login');
      modal.style.display = 'none';
      return;
    }

    const reservation = {
      id: Date.now(),
      roomId: room.id,
      fechaEntrada: searchData.fechaEntrada,
      fechaSalida: searchData.fechaSalida,
      numPersonas: searchData.numPersonas,
      totalPrice: totalPrice,
      userEmail: localStorage.getItem('currentUser'), // Asumiendo que se guarda el email del usuario logueado
      fechaReserva: new Date().toISOString()
    };

    addReservation(reservation);
    alert('Reserva realizada exitosamente!');
    modal.style.display = 'none';
  });
}
