// roomsTable.js
import { getRooms } from './storage.js';

// Función para obtener habitaciones con rutas de imagen normalizadas
function getRoomsWithImages() {
  const rooms = getRooms();
  return rooms.map(room => {
    let imgPath = room.image.trim(); // Limpiar espacios invisibles
    if (!imgPath.startsWith('./') && !imgPath.startsWith('http')) {
      imgPath = `./${imgPath}`; // Asegurar que sea relativa al HTML
    }
    return { ...room, image: imgPath };
  });
}

// Componente para crear tabla de habitaciones
export function createRoomsTable(numNights = 1) {
  const rooms = getRoomsWithImages(); // rutas ya normalizadas
  const table = document.createElement('table');
  table.className = 'rooms-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Imagen</th>
      <th>Nombre</th>
      <th>Capacidad</th>
      <th>Servicios</th>
      <th>Precio Total</th>
      <th>Acción</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  rooms.forEach(room => {
    const totalPrice = room.pricePerNight * numNights;
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <img src="${room.image}" 
             alt="${room.name}" 
             style="width: 100px; height: 60px; object-fit: cover;"
             onerror="this.src='./img/salas/fallback.png'">
      </td>
      <td>${room.name}</td>
      <td>${room.capacity} personas</td>
      <td>${room.services.join(', ')}</td>
      <td>$${totalPrice.toLocaleString()} (${numNights} noches)</td>
      <td>
        <button class="btn-details" data-room-id="${room.id}">Ver Detalles</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}

