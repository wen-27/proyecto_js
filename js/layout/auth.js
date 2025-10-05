// Manejo de la lógica de login y registro usando localStorage

import { getUsers, addUser, findUserByEmail } from './storage.js';
import { showSection, updateNav } from './navbar.js';

const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');

const loginSubmitBtn = loginView.querySelector('.submit-btn');
const registerSubmitBtn = registerView.querySelector('.submit-btn');

const userTypeUsuario = document.getElementById('user-type-usuario');
const userTypeAdmin = document.getElementById('user-type-admin');

// Inputs registro
const registerInputs = registerView.querySelectorAll('input');

function showView(view) {
  const loginTab = document.querySelector('.tab-login');
  const registerTab = document.querySelector('.tab-register');

  if (view === 'login') {
    loginView.classList.add('active');
    registerView.classList.remove('active');
    if (loginTab) loginTab.classList.add('active');
    if (registerTab) registerTab.classList.remove('active');
    loginView.style.display = 'block';
    registerView.style.display = 'none';
    history.pushState(null, '', '#login');
  } else if (view === 'register') {
    loginView.classList.remove('active');
    registerView.classList.add('active');
    if (loginTab) loginTab.classList.remove('active');
    if (registerTab) registerTab.classList.add('active');
    loginView.style.display = 'none';
    registerView.style.display = 'block';
    history.pushState(null, '', '#register');
  }
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash === '#register') {
    showView('register');
  } else if (hash === '#login') {
    showView('login');
  }
  // For other hashes, do nothing to avoid interfering with navigation
}


window.addEventListener('popstate', handleHashChange);
window.addEventListener('hashchange', handleHashChange);


document.addEventListener('DOMContentLoaded', () => {
  handleHashChange();
});

function loginUser(email, password, userType) {
  let users = getUsers();
  if (!users || users.length === 0) {
    alert('No hay usuarios registrados');
    return false;
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    alert('Usuario no registrado');
    return false;
  }
  if (user.password !== password) {
    alert('Contraseña incorrecta');
    return false;
  }
  if (userType === 'usuario' && user.role !== 'usuario') {
    alert('No tienes permisos para acceder como usuario');
    return false;
  }
  if (userType === 'admin' && user.role !== 'admin') {
    alert('No tienes permisos para acceder como administrador');
    return false;
  }
  alert(`Bienvenido ${user.nombreCompleto}`);
  onLoginSuccess(user);
  return true;
}

// Registrar nuevo usuario
function registerUser(data) {
  const { identificacion, nombreCompleto, nacionalidad, email, telefono, password } = data;
  if (findUserByEmail(email)) {
    alert('El correo ya está registrado');
    return false;
  }
  const newUser = {
    identificacion,
    nombreCompleto,
    nacionalidad,
    email,
    telefono,
    password,
    role: 'usuario' 
  };
  addUser(newUser);
  // Confirmar que el usuario fue agregado correctamente
  const users = getUsers();
  const addedUser = users.find(u => u.email === email);
  if (!addedUser) {
    alert('Error al registrar el usuario. Intenta nuevamente.');
    return false;
  }
  alert('Registro exitoso, ya puedes iniciar sesión');
  // showView('login'); // Removido para evitar conflicto con el control externo
  return true;
}

// Eventos para cambiar entre login y registro
document.querySelectorAll('.tab-login').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showView('login');
  });
});
document.querySelectorAll('.tab-register').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    // Evitar que el navegador cambie el hash en la URL
    history.pushState(null, '', window.location.pathname);
    showView('register');
    // Asegurar que el formulario de registro se muestre
    const registerView = document.getElementById('register-view');
    if (registerView) {
      registerView.style.display = 'block';
      registerView.classList.add('active');
    }
    const loginView = document.getElementById('login-view');
    if (loginView) {
      loginView.style.display = 'none';
      loginView.classList.remove('active');
    }
  });
});



function onLoginSuccess(user) {
  // Guardar usuario en sesión o localStorage para persistencia
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  // Navegar a página de inicio
  showSection('inicio');
  updateNav();
}

// Función para verificar si el usuario está logueado
export function isUserLoggedIn() {
  return sessionStorage.getItem('currentUser') !== null;
}

// Función para cerrar sesión
export function logoutUser() {
  sessionStorage.removeItem('currentUser');
  alert('Has cerrado sesión.');
  showSection('login');
  updateNav();
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
});

// Función para proteger la página de reservas
function protectReservationPage() {
  if (!isUserLoggedIn()) {
    alert('Debes iniciar sesión para acceder a las reservas.');
    showSection('login');
    updateNav();
  }
}



loginSubmitBtn.addEventListener('click', e => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();
  const userType = userTypeUsuario.checked ? 'usuario' : 'admin';
  if (!email || !password) {
    alert('Por favor completa todos los campos');
    return;
  }
  const success = loginUser(email, password, userType);
  if (success) {
    const user = findUserByEmail(email);
    onLoginSuccess(user);
  }
});

// Evento registro
registerSubmitBtn.addEventListener('click', e => {
  e.preventDefault();
  const data = {};
  const inputs = registerView.querySelectorAll('input');
  data.identificacion = inputs[0].value.trim();
  data.nombreCompleto = inputs[1].value.trim();
  data.nacionalidad = inputs[2].value.trim();
  data.email = inputs[3].value.trim();
  data.telefono = inputs[4].value.trim();
  data.password = inputs[5].value.trim();

  if (Object.values(data).some(v => !v)) {
    alert('Por favor completa todos los campos');
    return;
  }
  registerUser(data);
});
