// components/contacto.js
export function contactoComponent() {
  return `
    <div class="parent">
      <!-- 🔸 Header -->
      <div class="div1">
        <header>
          <div class="logo-box"><span>🏨</span></div>
          <h1>Hotel el Rincón del Carmen</h1>
          <p>Estamos aquí para atenderte</p>
        </header>
      </div>

      <!-- 🔸 Dirección -->
      <div class="div2 address-box">
        <h3>📍 Nuestra Ubicación</h3>
        <p>
          Calle Principal #123, Barrio El Carmen<br>
          Floridablanca, Santander, Colombia
        </p>
      </div>

      <!-- 🔸 Teléfonos -->
      <div class="div3 contact-card">
        <div class="contact-icon">📞</div>
        <h3>Teléfonos</h3>
        <a href="tel:+576071234567">+57 607 123 4567</a><br>
        <a href="tel:+573001234567">+57 300 123 4567</a>
      </div>

      <!-- 🔸 Correos -->
      <div class="div4 contact-card">
        <div class="contact-icon">✉️</div>
        <h3>Correos Electrónicos</h3>
        <a href="mailto:info@rincondelcarmen.com">info@rincondelcarmen.com</a><br>
        <a href="mailto:reservas@rincondelcarmen.com">reservas@rincondelcarmen.com</a>
      </div>

      <!-- 🔸 WhatsApp -->
      <div class="div5 contact-card">
        <div class="contact-icon">💬</div>
        <h3>WhatsApp</h3>
        <a href="https://wa.me/573001234567" target="_blank">Enviar mensaje</a>
      </div>

      <!-- 🔸 Mapa -->
      <div class="div6 map-section">
        <h2>Encuéntranos en el Mapa</h2>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0887877891643!2d-73.08623792487853!3d7.097734216602359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e681576c2ab4aeb%3A0x7f8a5b6f9a8e5c3d!2sFloridablanca%2C%20Santander%2C%20Colombia!5e0!3m2!1ses!2sus!4v1696445678901!5m2!1ses!2sus"
          loading="lazy"></iframe>
      </div>
    </div>
  `;
}
