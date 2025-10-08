// Manejo de navegación entre secciones

import { isUserLoggedIn } from './auth.js';

const sections = ['login', 'inicio', 'reservas', 'contacto', 'admin'];

function showSection(sectionId) {
  // Ocultar todas las secciones
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.classList.remove('active');
      section.style.display = 'none';
    }
  });

  // Mostrar la sección activa
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
    activeSection.style.display = 'block';
  }

  // Manejar clases del body
  const body = document.body;
  if (sectionId === 'login') {
    body.classList.add('login-body');
  } else {
    body.classList.remove('login-body');
  }

  // Actualizar URL
  history.pushState(null, '', `#${sectionId}`);

  // Actualizar navegación
  updateNav();
}

function handleHashChange() {
  const hash = window.location.hash.substring(1); // Remover #

  if (sections.includes(hash)) {
    showSection(hash);
  } else {
    // Default to login if invalid hash
    showSection('login');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Manejar clics en enlaces de navegación
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').substring(1);
      showSection(target);
    });
  });

  // Manejar cambios de hash
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange);

  // Inicializar con el hash actual
  handleHashChange();
});

// Función para actualizar navegación basada en estado de login
import { getCurrentUser } from './storage.js';

function updateNav() {
  const logoutLink = document.getElementById('logout-link');
  const adminLink = document.querySelector('a[href="#admin"]');
  const currentUser = getCurrentUser();

  if (logoutLink) {
    if (isUserLoggedIn()) {
      logoutLink.style.display = 'inline';
    } else {
      logoutLink.style.display = 'none';
    }
  }

  if (adminLink) {
    if (currentUser && currentUser.role === 'admin') {
      adminLink.style.display = 'inline';
    } else {
      adminLink.style.display = 'none';
    }
  }
}

// Exportar función para uso en otros módulos
export { showSection, updateNav };
