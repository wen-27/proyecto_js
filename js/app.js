import './layout/auth.js';
import './layout/navbar.js';
import './layout/reservas.js';
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
});
