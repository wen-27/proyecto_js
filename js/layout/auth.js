// Manejo de login y registro usando localStorage + SweetAlert2
import { getUsers, addUser, findUserByEmail } from './storage.js';
import { showSection, updateNav } from './navbar-layout.js';

// 🔹 Referencias a los elementos del DOM
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');

const loginEmailInput = loginView ? loginView.querySelector('#login-email') : null;
const loginPasswordInput = loginView ? loginView.querySelector('#login-password') : null;

const loginSubmitBtn = loginView ? loginView.querySelector('.submit-btn') : null;
const registerSubmitBtn = registerView ? registerView.querySelector('.submit-btn') : null;

const userTypeUsuario = loginView ? loginView.querySelector('#user-type-usuario') : null;
const userTypeAdmin = loginView ? loginView.querySelector('#user-type-admin') : null;

// 🔹 Función para mostrar login o registro
function showView(view) {
  if (!loginView || !registerView) return;

  const loginTab = document.querySelector('.tab-login');
  const registerTab = document.querySelector('.tab-register');

  if (view === 'login') {
    loginView.classList.add('active');
    registerView.classList.remove('active');
    loginView.style.display = 'block';
    registerView.style.display = 'none';
    if (loginTab) loginTab.classList.add('active');
    if (registerTab) registerTab.classList.remove('active');
    history.pushState(null, '', '#login');
  } else if (view === 'register') {
    loginView.classList.remove('active');
    registerView.classList.add('active');
    loginView.style.display = 'none';
    registerView.style.display = 'block';
    if (loginTab) loginTab.classList.remove('active');
    if (registerTab) registerTab.classList.add('active');
    history.pushState(null, '', '#register');
  }
}

// 🔹 Manejo de cambios en el hash
function handleHashChange() {
  const hash = window.location.hash;
  if (hash === '#register') showView('register');
  else showView('login');
}

window.addEventListener('popstate', handleHashChange);
window.addEventListener('hashchange', handleHashChange);

document.addEventListener('DOMContentLoaded', () => {
  handleHashChange();
  initTabs();
});

// 🔹 Inicializar tabs de login/registro
function initTabs() {
  document.querySelectorAll('.tab-login').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showView('login');
    });
  });
  document.querySelectorAll('.tab-register').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showView('register');
    });
  });
}

// 🔹 Función de login
function loginUser(email, password, userType) {
  const users = getUsers() || [];

  const user = users.find(u => u.email === email);
  if (!user) return Swal.fire({ title: 'Usuario no encontrado', text: 'Correo no registrado.', icon: 'error' });
  if (user.password !== password) return Swal.fire({ title: 'Contraseña incorrecta', text: '', icon: 'error' });

  if ((userType === 'usuario' && user.role !== 'usuario') || (userType === 'admin' && user.role !== 'admin')) {
    return Swal.fire({ title: 'Acceso denegado', text: 'No tienes permisos para este rol.', icon: 'warning' });
  }

  Swal.fire({ title: `¡Bienvenido, ${user.nombreCompleto}!`, icon: 'success', timer: 1500, showConfirmButton: false })
    .then(() => onLoginSuccess(user));
}

// 🔹 Función de registro
function registerUser(data) {
  const { identificacion, nombreCompleto, nacionalidad, email, telefono, password } = data;

  if (findUserByEmail(email)) {
    return Swal.fire({ title: 'Correo ya registrado', text: '', icon: 'warning' });
  }

  addUser({ identificacion, nombreCompleto, nacionalidad, email, telefono, password, role: 'usuario' });

  Swal.fire({
    title: '¡Registro exitoso!',
    text: 'Ya puedes iniciar sesión.',
    icon: 'success',
    confirmButtonText: 'Ir a login'
  }).then(() => {
    showView('login');
    // Limpiar campos
    if (registerView) registerView.querySelectorAll('input').forEach(i => i.value = '');
  });
}

// 🔹 Eventos botones
if (loginSubmitBtn) {
  loginSubmitBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!loginEmailInput || !loginPasswordInput || !userTypeUsuario) return;

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();
    const userType = userTypeUsuario.checked ? 'usuario' : 'admin';

    if (!email || !password) return Swal.fire({ title: 'Campos incompletos', icon: 'warning' });
    loginUser(email, password, userType);
  });
}

if (registerSubmitBtn) {
  registerSubmitBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!registerView) return;

    const inputs = registerView.querySelectorAll('input');
    const data = {
      identificacion: inputs[0].value.trim(),
      nombreCompleto: inputs[1].value.trim(),
      nacionalidad: inputs[2].value.trim(),
      email: inputs[3].value.trim(),
      telefono: inputs[4].value.trim(),
      password: inputs[5].value.trim()
    };

    if (Object.values(data).some(v => !v)) {
      return Swal.fire({ title: 'Campos incompletos', icon: 'warning' });
    }

    registerUser(data);
  });
}

// 🔹 Funciones de sesión
export function isUserLoggedIn() {
  return sessionStorage.getItem('currentUser') !== null;
}

export function logoutUser() {
  sessionStorage.removeItem('currentUser');
  Swal.fire({ title: 'Sesión cerrada', icon: 'info', timer: 1500, showConfirmButton: false })
    .then(() => {
      showSection('login');
      updateNav();
    });
}

function onLoginSuccess(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  showSection('inicio');
  updateNav();
}
