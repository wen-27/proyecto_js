import './layout/auth.js';
import './layout/navbar.js';
import './layout/reservas.js';
import { initRoomManagement } from './layout/habitaciones.js';
import { createFooter } from './components/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('app.js cargado correctamente');

  const footerDiv = document.getElementById('footer');
  if (footerDiv) {
    console.log(' footerDiv encontrado, insertando footer');
    footerDiv.appendChild(createFooter());
  } else {
    console.log(' No se encontró el div con id="footer"');
  }

  // Inicializar gestión de habitaciones cuando se accede a la sección admin
  const adminSection = document.getElementById('admin');
  if (adminSection) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = window.getComputedStyle(adminSection).display;
          if (display === 'block') {
            initRoomManagement();
          }
        }
      });
    });
    observer.observe(adminSection, { attributes: true, attributeFilter: ['style'] });
  }
});
