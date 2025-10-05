// Lógica para la página de reservas

import { isUserLoggedIn } from './auth.js';
import { showSection } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  // Manejar clics en botones de reservar
  document.querySelectorAll('.btn-reserve, .reserve-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isUserLoggedIn()) {
        alert('Debes iniciar sesión para hacer una reserva.');
        showSection('login');
        return;
      }
      // Aquí iría la lógica para procesar la reserva
      alert('Reserva realizada exitosamente!');
      // Podrías redirigir a una página de confirmación o mostrar un modal
    });
  });

  // Manejar búsqueda de habitaciones
  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Lógica para filtrar habitaciones basadas en fechas y personas
      alert('Búsqueda realizada. Mostrando habitaciones disponibles.');
      // Aquí irías la lógica real de búsqueda
    });
  }
});
