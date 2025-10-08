// habitaciones.js
export function habitacionesComponent() {
  return `
    <!-- 🔸 Habitaciones -->
    <div class="section" id="habitaciones">
      <h2 class="section-title">Nuestras Habitaciones</h2>
      <p class="section-subtitle">Descubre espacios diseñados para tu comodidad y descanso</p>

      <input type="radio" name="carousel" id="dot1" class="carousel-radio" checked>
      <input type="radio" name="carousel" id="dot2" class="carousel-radio">
      <input type="radio" name="carousel" id="dot3" class="carousel-radio">

      <div class="carousel">
        <div class="carousel-track">
          <!-- Habitación 1 -->
          <div class="carousel-slide">
            <div class="room-card">
              <div class="room-image room1">
                <span class="room-badge">Más Popular</span>
              </div>
              <div class="room-content">
                <h3>Suite Deluxe</h3>
                <p><strong>Ubicación:</strong> Cartagena, Colombia</p>
                <p>Espaciosa suite con vista panorámica, jacuzzi privado y todas las comodidades de lujo.</p>
                <div class="room-features">
                  <span>👥 2-4 personas</span>
                  <span>🛏️ 2 camas</span>
                  <span>📶 WiFi</span>
                  <span>🍷 Minibar</span>
                </div>
                <div class="room-price">$250,000 <span>/ noche</span></div>
                <button class="reserve-button-carousel" data-room-name="Suite Deluxe">Reservar</button>
              </div>
            </div>
          </div>

          <!-- Habitación 2 -->
          <div class="carousel-slide">
            <div class="room-card">
              <div class="room-image room2">
                <span class="room-badge">Recomendada</span>
              </div>
              <div class="room-content">
                <h3>Habitación Ejecutiva</h3>
                <p><strong>Ubicación:</strong> Floridablanca, Colombia</p>
                <p>Perfecta para viajes de negocios o parejas, con escritorio y zona de trabajo.</p>
                <div class="room-features">
                  <span>👥 2 personas</span>
                  <span>🛏️ 1 cama king</span>
                  <span>📶 WiFi</span>
                  <span>☕ Cafetera</span>
                </div>
                <div class="room-price">$180,000 <span>/ noche</span></div>
                <button class="reserve-button-carousel" data-room-name="Habitación Ejecutiva">Reservar</button>
              </div>
            </div>
          </div>

          <!-- Habitación 3 -->
          <div class="carousel-slide">
            <div class="room-card">
              <div class="room-image room3">
                <span class="room-badge">Familiar</span>
              </div>
              <div class="room-content">
                <h3>Habitación Familiar</h3>
                <p><strong>Ubicación:</strong> Floridablanca, Colombia</p>
                <p>Amplio espacio para toda la familia con dos habitaciones conectadas.</p>
                <div class="room-features">
                  <span>👥 4-6 personas</span>
                  <span>🛏️ 3 camas</span>
                  <span>📶 WiFi</span>
                  <span>🎮 Área de juegos</span>
                </div>
                <div class="room-price">$320,000 <span>/ noche</span></div>
                <button class="reserve-button-carousel" data-room-name="Habitación Familiar">Reservar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
        <label for="dot1" class="carousel-dot"></label>
        <label for="dot2" class="carousel-dot"></label>
        <label for="dot3" class="carousel-dot"></label>
      </div>
    </div>
  `;
}
