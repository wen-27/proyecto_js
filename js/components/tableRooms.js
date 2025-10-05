// Componente para mostrar habitaciones disponibles en una tabla

export function createRoomsTable(rooms, numNights = 1) {
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
      <td><img src="${room.image}" alt="${room.name}" style="width: 100px; height: 60px; object-fit: cover;"></td>
      <td>${room.name}</td>
      <td>${room.capacity} personas</td>
      <td>${room.services.join(', ')}</td>
      <td>$${totalPrice.toLocaleString()} (${numNights} noches)</td>
      <td><button class="btn-details" data-room-id="${room.id}">Ver Detalles</button></td>
    `;

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  return table;
}
