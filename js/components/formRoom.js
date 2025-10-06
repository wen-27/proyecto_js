// Componente para formulario de habitación (agregar/editar)

export function createRoomForm(room = null, onSave, onCancel) {
  const form = document.createElement('form');
  form.className = 'room-form';

  const isEdit = room !== null;

  form.innerHTML = `
    <h3>${isEdit ? 'Editar Habitación' : 'Agregar Nueva Habitación'}</h3>

    <div class="form-group">
      <label for="room-name">Nombre de la Habitación:</label>
      <input type="text" id="room-name" name="name" required value="${room ? room.name : ''}">
    </div>

    <div class="form-group">
      <label for="room-description">Descripción:</label>
      <textarea id="room-description" name="description" required>${room ? room.description : ''}</textarea>
    </div>

    <div class="form-group">
      <label for="room-beds">Número de Camas:</label>
      <input type="number" id="room-beds" name="beds" min="1" required value="${room ? room.beds : ''}">
    </div>

    <div class="form-group">
      <label for="room-capacity">Capacidad Máxima (personas):</label>
      <input type="number" id="room-capacity" name="capacity" min="1" required value="${room ? room.capacity : ''}">
    </div>

    <div class="form-group">
      <label for="room-price">Precio por Noche:</label>
      <input type="number" id="room-price" name="pricePerNight" min="0" step="1000" required value="${room ? room.pricePerNight : ''}">
    </div>

    <div class="form-group">
      <label for="room-image">URL de Imagen:</label>
      <input type="url" id="room-image" name="image" required value="${room ? room.image : ''}">
    </div>

    <div class="form-group">
      <label>Servicios Incluidos:</label>
      <div class="services-checkboxes">
        ${getServiceCheckboxes(room ? room.services : [])}
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-save">${isEdit ? 'Actualizar' : 'Guardar'}</button>
      <button type="button" class="btn-cancel">Cancelar</button>
    </div>
  `;

  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const roomData = {
      id: isEdit ? room.id : Date.now(), // Simple ID generation
      name: formData.get('name'),
      description: formData.get('description'),
      beds: parseInt(formData.get('beds')),
      capacity: parseInt(formData.get('capacity')),
      pricePerNight: parseInt(formData.get('pricePerNight')),
      image: formData.get('image'),
      services: getSelectedServices(form),
      available: true
    };
    onSave(roomData);
  });

  form.querySelector('.btn-cancel').addEventListener('click', onCancel);

  return form;
}

function getServiceCheckboxes(selectedServices) {
  const allServices = ['WiFi', 'Minibar', 'Jacuzzi', 'Vista panorámica', 'Cafetera', 'Escritorio', 'Área de juegos', 'Cocina'];
  return allServices.map(service => `
    <label>
      <input type="checkbox" name="services" value="${service}" ${selectedServices.includes(service) ? 'checked' : ''}>
      ${service}
    </label>
  `).join('');
}

function getSelectedServices(form) {
  const checkboxes = form.querySelectorAll('input[name="services"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}
