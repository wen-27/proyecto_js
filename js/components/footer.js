// Componente para el pie de página

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  footer.innerHTML = `
    <div class="footer-content">
      <div class="footer-section">
        <h3>Hotel El Rincón del Carmen</h3>
        <p>Tu escape perfecto te espera</p>
      </div>
      <div class="footer-section">
        <h3>Contacto</h3>
        <p>📞 +57 607 123 4567</p>
        <p>✉️ info@rincondelcarmen.com</p>
      </div>
      <div class="footer-section">
        <h3>Redes Sociales</h3>
        <p>Facebook | Instagram | Twitter</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2023 Hotel El Rincón del Carmen. Todos los derechos reservados.</p>
    </div>
  `;

  return footer;
}
