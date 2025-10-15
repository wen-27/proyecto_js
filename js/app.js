import { initAuth } from './layout/auth.js';
import { initNavListeners } from './layout/navbar-layout.js';
import './layout/reservas.js';
import { initRoomManagement } from './layout/habitaciones.js';
import { createFooter } from './components/footer.js';
import { createNavbar } from './components/navbar.js';
import { createLoginSection } from './components/login.js';
import { habitacionesComponent } from './components/habitaciones.js';
import { serviciosComponent } from './components/servicios.js';
import { contactoComponent } from './components/contacto.js';
import { quejasComponent, adminQuejasComponent } from './components/quejas.js';
import './layout/user-quejas.js';
import './layout/admin-quejas.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('app.js cargado correctamente');

  // 🔹 Navbar
  const header = document.querySelector('header');
  if (header) header.appendChild(createNavbar());

  // 🔹 Login/Registro
  const main = document.querySelector('main') || document.body;
  const loginSection = createLoginSection();
  main.prepend(loginSection);

  // Inicializar auth después de crear el login
  initAuth();

  // Inicializar listeners de navegación
  initNavListeners();

  // 🔹 Habitaciones
  const habitacionesDiv = document.getElementById('habitaciones-container');
  if (habitacionesDiv) habitacionesDiv.innerHTML = habitacionesComponent();

  // 🔹 Servicios
  const serviciosDiv = document.getElementById('servicios-container');
  if (serviciosDiv) serviciosDiv.innerHTML = serviciosComponent();

  // 🔹 Contacto
  const contactoDiv = document.getElementById('contacto');
  if (contactoDiv) contactoDiv.innerHTML = contactoComponent();

  // 🔹 Quejas
  const quejasDiv = document.getElementById('quejas');
  if (quejasDiv) quejasDiv.innerHTML = quejasComponent();

  // 🔹 Footer (siempre insertamos)
  const footerDiv = document.getElementById('footer');
  if (footerDiv) footerDiv.appendChild(createFooter());

  // 🔹 Ocultar footer solo si login está visible
  function updateFooterVisibility() {
    if (loginSection.style.display !== 'none') {
      footerDiv.style.display = 'none';
    } else {
      footerDiv.style.display = 'block';
    }
  }

  // Ejecutar al cargar
  updateFooterVisibility();

  // 🔹 Opcional: observar cambios en login para actualizar footer dinámicamente
  const observer = new MutationObserver(updateFooterVisibility);
  observer.observe(loginSection, { attributes: true, attributeFilter: ['style'] });

  // 🔹 Inicializar gestión de habitaciones (solo admin)
  const adminSection = document.getElementById('admin');
  if (adminSection) {
    const adminObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = window.getComputedStyle(adminSection).display;
          if (display === 'block') {
            initRoomManagement();
            // Agregar sección de quejas al admin
            const adminContainer = adminSection.querySelector('.container');
            if (adminContainer && !adminContainer.querySelector('.admin-quejas-container')) {
              const quejasSection = document.createElement('div');
              quejasSection.innerHTML = adminQuejasComponent();
              adminContainer.appendChild(quejasSection);
            }
          }
        }
      });
    });
    adminObserver.observe(adminSection, { attributes: true, attributeFilter: ['style'] });
  }
});
