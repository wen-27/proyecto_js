// Manejo de navegación entre secciones
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');

  // Función para mostrar una sección específica
  function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active');
    });

    // Mostrar la sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Manejar clase del body para login
      if (sectionId === 'login') {
        document.body.classList.add('login-body');
      } else {
        document.body.classList.remove('login-body');
      }

      // Actualizar URL
      history.pushState(null, '', '#' + sectionId);
      
      // Scroll al inicio
      window.scrollTo(0, 0);
    }
  }

  // Agregar listeners a los enlaces del nav
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        showSection(sectionId);
      }
    });
  });

  // Manejar cambios en el hash (botón atrás/adelante)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showSection(hash);
    }
  });

  // Mostrar la sección correcta al cargar
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    showSection(initialHash);
  } else {
    // Por defecto mostrar login
    showSection('login');
  }

  // === MANEJO DEL LOGIN/REGISTRO ===
  const tabLogin = document.querySelector('.tab-login');
  const tabRegister = document.querySelector('.tab-register');
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');

  if (tabLogin && tabRegister && loginView && registerView) {
    tabLogin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Activar tab de login
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      
      // Mostrar vista de login
      loginView.classList.add('active');
      registerView.classList.remove('active');
      
      // Actualizar footer
      document.querySelector('.footer-register').style.display = 'inline';
      document.querySelector('.footer-login').style.display = 'none';
    });

    tabRegister.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Activar tab de registro
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      
      // Mostrar vista de registro
      registerView.classList.add('active');
      loginView.classList.remove('active');
      
      // Actualizar footer
      document.querySelector('.footer-register').style.display = 'none';
      document.querySelector('.footer-login').style.display = 'inline';
    });
  }
});