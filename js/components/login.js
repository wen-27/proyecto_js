// Componente para la sección de Login / Registro
export function createLoginSection() {
  const section = document.createElement('section');
  section.id = 'login';
  section.className = 'active login-body';

  section.innerHTML = `
    <div class="bg-decoration decoration-1"></div>
    <div class="bg-decoration decoration-2"></div>
    <div class="bg-decoration decoration-3"></div>

    <div class="container">
      <div class="header">
        <div class="logo-box">
          <span>🏨</span>
        </div>
        <h1>Hotel el Rincón del Carmen</h1>
        <p>Tu escape perfecto te espera</p>
      </div>

      <div class="card">
        <div class="tabs">
          <a href="#" class="tab tab-login active">Iniciar Sesión</a>
          <a href="#" class="tab tab-register">Registrarse</a>
        </div>

        <div class="form-container">
          <!-- 🔸 Login -->
          <div class="form-view active" id="login-view">
            <div class="user-type-selector">
              <p>Selecciona tipo de usuario:</p>
              <input type="radio" id="user-type-usuario" name="user-type" checked />
              <input type="radio" id="user-type-admin" name="user-type" />
              <div class="user-type-buttons">
                <label for="user-type-usuario" class="user-type-btn">Usuario</label>
                <label for="user-type-admin" class="user-type-btn">Administrador</label>
              </div>
            </div>

            <div class="input-group">
              <input type="email" id="login-email" placeholder="Correo electrónico" required />
            </div>

            <div class="input-group">
              <input type="password" id="login-password" placeholder="Contraseña" required />
            </div>

            <div class="forgot-password">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" class="submit-btn">Iniciar Sesión</button>
          </div>

          <!-- 🔸 Registro -->
          <div class="form-view" id="register-view">
            <div class="input-group">
              <input type="text" placeholder="Número de identificación" required />
            </div>
            <div class="input-group">
              <input type="text" placeholder="Nombre completo" required />
            </div>
            <div class="input-group">
              <input type="text" placeholder="Nacionalidad" required />
            </div>
            <div class="input-group">
              <input type="email" placeholder="Correo electrónico" required />
            </div>
            <div class="input-group">
              <input type="tel" placeholder="Teléfono" required />
            </div>
            <div class="input-group">
              <input type="password" placeholder="Contraseña" required />
            </div>
            <button type="submit" class="submit-btn">Crear Cuenta</button>
          </div>
        </div>

        <div class="footer">
          <p>
            <span class="footer-register">¿No tienes cuenta? <a href="#register-view" class="tab-register">Regístrate aquí</a></span>
            <span class="footer-login">¿Ya tienes cuenta? <a href="#login-view" class="tab-login">Inicia sesión</a></span>
          </p>
        </div>
      </div>

      <div class="terms">
        <p>Al continuar, aceptas nuestros términos y condiciones</p>
      </div>
    </div>
  `;

  return section;
}
