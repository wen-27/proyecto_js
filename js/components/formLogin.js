// Componente para el formulario de login

export function createLoginForm() {
  const form = document.createElement('form');
  form.className = 'login-form';

  form.innerHTML = `
    <div class="input-group">
      <label for="email">Correo electrónico</label>
      <input type="email" id="email" name="email" placeholder="Correo electrónico" required />
    </div>
    <div class="input-group">
      <label for="password">Contraseña</label>
      <input type="password" id="password" name="password" placeholder="Contraseña" required />
    </div>
    <button type="submit" class="submit-btn">Iniciar Sesión</button>
  `;

  return form;
}
