// Lógica para la gestión de quejas y reclamos del usuario

import { getCurrentUser, getReservations, getComplaints, addComplaint, deleteComplaint } from './storage.js';

export function loadUserComplaints() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const complaints = getComplaints().filter(c => c.userEmail === currentUser.email);
  const complaintsList = document.getElementById('complaints-list');

  if (!complaintsList) return;

  complaintsList.innerHTML = '';

  if (complaints.length === 0) {
    complaintsList.innerHTML = `
      <div class="no-complaints">
        <div class="no-complaints-icon">📝</div>
        <h3>No tienes quejas o reclamos</h3>
        <p>Si tienes algún inconveniente, puedes crear una nueva queja.</p>
      </div>
    `;
    return;
  }

  complaints.forEach(complaint => {
    const complaintCard = document.createElement('div');
    complaintCard.className = 'complaint-card';
    complaintCard.innerHTML = `
      <div class="complaint-header">
        <div class="complaint-status">
          <div class="status-badge ${complaint.status}">${complaint.status === 'pendiente' ? 'Pendiente' : 'Resuelto'}</div>
          <div class="complaint-id">ID: ${complaint.id}</div>
        </div>
        <div class="complaint-date">${new Date(complaint.fecha).toLocaleDateString()}</div>
      </div>
      <div class="complaint-details">
        <div class="complaint-type">${complaint.tipo === 'queja' ? 'Queja' : 'Reclamo'}</div>
        <h3>${complaint.asunto}</h3>
        <p>${complaint.descripcion}</p>
        ${complaint.respuestaAdmin ? `<div class="admin-response"><strong>Respuesta del administrador:</strong> ${complaint.respuestaAdmin}</div>` : ''}
      </div>
      <div class="complaint-actions">
        ${complaint.status === 'pendiente' ? `<button class="btn-action btn-delete" data-complaint-id="${complaint.id}">Eliminar</button>` : ''}
      </div>
    `;
    complaintsList.appendChild(complaintCard);
  });

  // Event listeners
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', (e) => {
      const complaintId = parseInt(e.target.dataset.complaintId);
      deleteComplaintConfirm(complaintId);
    });
  });
}

function deleteComplaintConfirm(complaintId) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará permanentemente la queja o reclamo.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteComplaint(complaintId);
      loadUserComplaints();
      Swal.fire('Eliminado', 'La queja ha sido eliminada.', 'success');
    }
  });
}

export function showNewComplaintModal() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userReservations = getReservations().filter(r => r.userEmail === currentUser.email);

  if (userReservations.length === 0) {
    Swal.fire({
      title: 'No tienes reservas',
      text: 'Debes tener al menos una reserva para crear una queja o reclamo.',
      icon: 'warning'
    });
    return;
  }

  let reservationOptions = '<option value="">Selecciona una reserva</option>';
  userReservations.forEach(reservation => {
    reservationOptions += `<option value="${reservation.id}">ID ${reservation.id} - ${reservation.fechaEntrada} a ${reservation.fechaSalida}</option>`;
  });

  Swal.fire({
    title: 'Nueva Queja/Reclamo',
    html: `
      <select id="reservation-select" class="swal2-input">${reservationOptions}</select>
      <select id="tipo-select" class="swal2-input">
        <option value="">Selecciona el tipo</option>
        <option value="queja">Queja</option>
        <option value="reclamo">Reclamo</option>
      </select>
      <input type="text" id="asunto-input" class="swal2-input" placeholder="Asunto">
      <textarea id="descripcion-input" class="swal2-input" placeholder="Descripción detallada" rows="4"></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const reservationId = document.getElementById('reservation-select').value;
      const tipo = document.getElementById('tipo-select').value;
      const asunto = document.getElementById('asunto-input').value.trim();
      const descripcion = document.getElementById('descripcion-input').value.trim();

      if (!reservationId || !tipo || !asunto || !descripcion) {
        Swal.showValidationMessage('Por favor, completa todos los campos');
        return false;
      }

      return { reservationId: parseInt(reservationId), tipo, asunto, descripcion };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { reservationId, tipo, asunto, descripcion } = result.value;

      const newComplaint = {
        id: Date.now(),
        userEmail: currentUser.email,
        reservationId,
        tipo,
        asunto,
        descripcion,
        fecha: new Date().toISOString(),
        status: 'pendiente'
      };

      addComplaint(newComplaint);
      loadUserComplaints();

      Swal.fire({
        title: 'Enviado',
        text: 'Tu queja o reclamo ha sido enviado exitosamente.',
        icon: 'success'
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Cargar quejas al mostrar la sección
  const quejasSection = document.getElementById('quejas');
  if (quejasSection) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = window.getComputedStyle(quejasSection).display;
          if (display === 'block') {
            loadUserComplaints();
          }
        }
      });
    });
    observer.observe(quejasSection, { attributes: true, attributeFilter: ['style'] });
  }

  // Event listener para botón de nueva queja
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-new-complaint') {
      showNewComplaintModal();
    }
  });
});
