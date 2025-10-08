import './layout/auth.js';
import './layout/reservas.js';
import { initRoomManagement } from './layout/habitaciones.js';
import { createFooter } from './components/footer.js';
import { createNavbar } from './components/navbar.js';
import { createLoginSection } from './components/login.js'; 
import { habitacionesComponent } from './components/habitaciones.js'; // componente de habitaciones

document.addEventListener('DOMContentLoaded', () => {
  console.log('app.js cargado correctamente');

  // 🔹 Insertar Navbar en <header>
  const header = document.querySelector('header');
  if (header) {
    header.appendChild(createNavbar());
    console.log('Navbar insertado correctamente');
  } else {
    console.log('No se encontró el <header> para insertar navbar');
  }

  // 🔹 Insertar Login/Registro
  const main = document.querySelector('main') || document.body; 
  main.prepend(createLoginSection());
  console.log('Login/Registro insertado correctamente');

  // 🔹 Insertar Habitaciones después del login
  const habitacionesDiv = document.getElementById('habitaciones-container');
  if (habitacionesDiv) {
    habitacionesDiv.innerHTML = habitacionesComponent(); // ✅ corregido
    console.log('Sección de Habitaciones insertada correctamente');
  } else {
    console.log('No se encontró el contenedor de habitaciones');
  }

  // 🔹 Insertar Footer
  const footerDiv = document.getElementById('footer');
  if (footerDiv) {
    footerDiv.appendChild(createFooter());
    console.log('Footer insertado correctamente');
  } else {
    console.log('No se encontró el div con id="footer"');
  }

  // 🔹 Inicializar gestión de habitaciones (solo admin)
  const adminSection = document.getElementById('admin');
  if (adminSection) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const display = window.getComputedStyle(adminSection).display;
          if (display === 'block') initRoomManagement();
        }
      });
    });
    observer.observe(adminSection, { attributes: true, attributeFilter: ['style'] });
  }
});
