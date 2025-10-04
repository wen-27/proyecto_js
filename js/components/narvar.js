// Componente de navegación (navbar) básico para el sitio web del hotel

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a, .tab-login, .tab-register');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      const targetId = href.startsWith('#') ? href.substring(1) : null;
      if (!targetId) return;
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Ocultar todas las secciones visibles
        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
          section.style.display = 'none';
        });

        // Mostrar la sección objetivo
        targetSection.classList.add('active');
        targetSection.style.display = 'block';

        // Actualizar el hash en la URL sin hacer scroll automático
        history.pushState(null, '', `#${targetId}`);

        // Desplazar a la parte superior de la página
        window.scrollTo(0, 0);
      }
    });
  });

  // Función para mostrar la sección basada en hash
  const showSectionFromHash = () => {
    const currentHash = window.location.hash.substring(1);
    if (currentHash) {
      const currentSection = document.getElementById(currentHash);
      if (currentSection) {
        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
          section.style.display = 'none';
        });
        currentSection.classList.add('active');
        currentSection.style.display = 'block';

        // Desplazar a la parte superior de la página
        window.scrollTo(0, 0);
      }
    } else {
      // Mostrar la sección por defecto (inicio)
      const defaultSection = document.getElementById('inicio');
      if (defaultSection) {
        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active');
          section.style.display = 'none';
        });
        defaultSection.classList.add('active');
        defaultSection.style.display = 'block';
      }
    }
  };

  // Mostrar la sección correspondiente al hash actual al cargar la página
  showSectionFromHash();

  // Escuchar cambios de hash para actualizar la sección
  window.addEventListener('hashchange', showSectionFromHash);
});
