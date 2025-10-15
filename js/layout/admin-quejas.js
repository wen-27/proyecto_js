// Lógica para la gestión de quejas y reclamos del administrador

import { getComplaints, updateComplaint } from './storage.js';

export function loadAdminComplaints() {
  const complaints = getComplaints();
  const adminComplaintsList = document.getElementById('admin-complaints-list');

  if (!adminComplaintsList) return;

  adminComplaintsList.innerHTML = '';

  if (complaints.length === 0) {
    adminComplaintsList.innerHTML = `
      <div class="no-complaints">
        <div class="no-complaints-icon">📝</div>
        <h3>No hay quejas o reclamos</h3>
        <p>No hay quejas para gestionar en este momento.</p>
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
          <div class="status-badge ${complaint.status}">${complaint.status === 'pendiente' ? 'Pendiente' : complaint.status === 'resuelto' ? 'Resuelto' : 'Rechazado'}</div>
          <div class="complaint-id">ID: ${complaint.id}</div>
        </div>
        <div class="complaint-date">${new Date(complaint.fecha).toLocaleDateString()}</div>
      </div>
      <div class="complaint-details">
        <div class="complaint-user">Usuario: ${complaint.userEmail}</div>
        <div class="complaint-type">${complaint.tipo === 'queja' ? 'Queja' : 'Reclamo'}</div>
        <h3>${complaint.asunto}</h3>
        <p>${complaint.descripcion}</p>
        ${complaint.respuestaAdmin ? `<div class="admin-response"><strong>Tu respuesta:</strong> ${complaint.respuestaAdmin}</div>` : ''}
      </div>
      <div class="complaint-actions">
        ${complaint.status === 'pendiente' ? `<button class="btn-action btn-respond" data-complaint-id="${complaint.id}">Responder</button>` : `<span class="resolved-text">${complaint.status === 'resuelto' ? 'Resuelto' : 'Rechazado'}</span>`}
      </div>
    `;
    adminComplaintsList.appendChild(complaintCard);
  });

  // Event listeners
  document.querySelectorAll('.btn-respond').forEach(button => {
    button.addEventListener('click', (e) => {
      const complaintId = parseInt(e.target.dataset.complaintId);
      showResponseModal(complaintId);
    });
  });
}

function showResponseModal(complaintId) {
  const complaints = getComplaints();
  const complaint = complaints.find(c => c.id === complaintId);

  if (!complaint) {
    Swal.fire('Error', 'Queja no encontrada', 'error');
    return;
  }

  Swal.fire({
    title: 'Responder Queja/Reclamo',
    html: `
      <div style="text-align: left; margin-bottom: 15px;">
        <strong>Tipo:</strong> ${complaint.tipo === 'queja' ? 'Queja' : 'Reclamo'}<br>
        <strong>Asunto:</strong> ${complaint.asunto}<br>
        <strong>Descripción:</strong> ${complaint.descripcion}
      </div>
      <textarea id="response-input" class="swal2-input" placeholder="Escribe tu respuesta..." rows="4"></textarea>
      <select id="status-select" class="swal2-input" style="margin-top: 10px;">
        <option value="resuelto">Marcar como Resuelto</option>
        <option value="rechazado">Marcar como Rechazado</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enviar Respuesta',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const respuesta = document.getElementById('response-input').value.trim();
      const status = document.getElementById('status-select').value;

      if (!respuesta) {
        Swal.showValidationMessage('Por favor, escribe una respuesta');
        return false;
      }

      return { respuesta, status };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { respuesta, status } = result.value;

      updateComplaint(complaintId, {
        respuestaAdmin: respuesta,
        status: status
      });

      loadAdminComplaints();

      Swal.fire({
        title: 'Respuesta enviada',
        text: 'La respuesta ha sido enviada al huésped.',
        icon: 'success'
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Cargar quejas al mostrar la sección de admin-quejas
  const adminQuejasSection = document.getElementById('admin-quejas');
  if (adminQuejasSection) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = window.getComputedStyle(adminQuejasSection).display;
          if (display === 'block') {
            loadAdminComplaints();
          }
        }
      });
    });
    observer.observe(adminQuejasSection, { attributes: true, attributeFilter: ['style'] });
  }

  // Event listener para filtro de estado
  document.addEventListener('change', (e) => {
    if (e.target.id === 'status-filter') {
      filterComplaints(e.target.value);
    }
  });
});

function filterComplaints(status) {
  const complaints = getComplaints();
  let filteredComplaints = complaints;

  if (status) {
    filteredComplaints = complaints.filter(c => c.status === status);
  }

  const adminComplaintsList = document.getElementById('admin-complaints-list');
  if (!adminComplaintsList) return;

  adminComplaintsList.innerHTML = '';

  if (filteredComplaints.length === 0) {
    adminComplaintsList.innerHTML = `
      <div class="no-complaints">
        <div class="no-complaints-icon">📝</div>
        <h3>No hay quejas con ese estado</h3>
        <p>No se encontraron quejas para el filtro seleccionado.</p>
      </div>
    `;
    return;
  }

  filteredComplaints.forEach(complaint => {
    const complaintCard = document.createElement('div');
    complaintCard.className = 'complaint-card';
    complaintCard.innerHTML = `
      <div class="complaint-header">
        <div class="complaint-status">
          <div class="status-badge ${complaint.status}">${complaint.status === 'pendiente' ? 'Pendiente' : complaint.status === 'resuelto' ? 'Resuelto' : 'Rechazado'}</div>
          <div class="complaint-id">ID: ${complaint.id}</div>
        </div>
        <div class="complaint-date">${new Date(complaint.fecha).toLocaleDateString()}</div>
      </div>
      <div class="complaint-details">
        <div class="complaint-user">Usuario: ${complaint.userEmail}</div>
        <div class="complaint-type">${complaint.tipo === 'queja' ? 'Queja' : 'Reclamo'}</div>
        <h3>${complaint.asunto}</h3>
        <p>${complaint.descripcion}</p>
        ${complaint.respuestaAdmin ? `<div class="admin-response"><strong>Tu respuesta:</strong> ${complaint.respuestaAdmin}</div>` : ''}
      </div>
      <div class="complaint-actions">
        ${complaint.status === 'pendiente' ? `<button class="btn-action btn-respond" data-complaint-id="${complaint.id}">Responder</button>` : `<span class="resolved-text">${complaint.status === 'resuelto' ? 'Resuelto' : 'Rechazado'}</span>`}
      </div>
    `;
    adminComplaintsList.appendChild(complaintCard);
  });

  // Re-attach event listeners
  document.querySelectorAll('.btn-respond').forEach(button => {
    button.addEventListener('click', (e) => {
      const complaintId = parseInt(e.target.dataset.complaintId);
      showResponseModal(complaintId);
    });
  });
}
