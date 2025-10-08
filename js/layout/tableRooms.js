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

// Componente para crear tabla de habitaciones responsive tipo "cards" en móviles
export function createRoomsTable(numNights = 1) {
  const rooms = getRoomsWithImages(); // rutas ya normalizadas

  // Crear contenedor responsive
  const container = document.createElement('div');
  container.className = 'table-responsive';

  // Crear la tabla
  const table = document.createElement('table');
  table.className = 'rooms-table';

  // Cabecera
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

  // Cuerpo de la tabla
  const tbody = document.createElement('tbody');

  rooms.forEach(room => {
    const totalPrice = room.pricePerNight * numNights;
    const row = document.createElement('tr');

    row.innerHTML = `
      <td data-label="Imagen">
        <img src="${room.image}" 
             alt="${room.name}" 
             style="width: 100px; height: 60px; object-fit: cover;"
             onerror="this.src='./img/salas/fallback.png'">
      </td>
      <td data-label="Nombre">${room.name}</td>
      <td data-label="Capacidad">${room.capacity} personas</td>
      <td data-label="Servicios">${room.services.join(', ')}</td>
      <td data-label="Precio Total">$${totalPrice.toLocaleString()} (${numNights} noches)</td>
      <td data-label="Acción">
        <button class="btn-details" data-room-id="${room.id}">Ver Detalles</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  return container; // Retornamos el div que envuelve la tabla
}
