// Componente para crear tarjetas de habitación

export function createRoomCard(room, numNights = 1) {
  const totalPrice = room.pricePerNight * numNights;
  const card = document.createElement('div');
  card.className = 'room-result-card';
  card.innerHTML = `
    <div class="room-result-image">
      <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 150px; object-fit: cover;">
    </div>
    <div class="room-result-content">
      <h3>${room.name}</h3>
      <p><strong>Ubicación:</strong> ${room.location}</p>
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
  return card;
}

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
