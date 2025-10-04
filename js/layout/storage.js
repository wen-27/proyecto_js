// Funciones para manejar localStorage

const STORAGE_KEYS = {
  USERS: 'hotel_users',
  ROOMS: 'hotel_rooms',
  RESERVATIONS: 'hotel_reservations'
};

// Usuarios
export function getUsers() {
  let users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users || users === '[]') {
    // Crear usuario admin predefinido si no existe o si la lista está vacía
    const defaultAdmin = [{
      identificacion: 'admin001',
      nombreCompleto: 'Administrador Principal',
      nacionalidad: 'N/A',
      email: 'admin@hotel.com',
      telefono: '0000000000',
      password: 'admin123',
      role: 'admin'
    }];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAdmin));
    users = JSON.stringify(defaultAdmin);
  }
  try {
    const parsedUsers = JSON.parse(users);
    if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
      // Si no es un array válido o está vacío, reiniciar con admin por defecto
      const defaultAdmin = [{
        identificacion: 'admin001',
        nombreCompleto: 'Administrador Principal',
        nacionalidad: 'N/A',
        email: 'admin@hotel.com',
        telefono: '0000000000',
        password: 'admin123',
        role: 'admin'
      }];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAdmin));
      return defaultAdmin;
    }
    return parsedUsers;
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    // En caso de error, reiniciar con admin por defecto
    const defaultAdmin = [{
      identificacion: 'admin001',
      nombreCompleto: 'Administrador Principal',
      nacionalidad: 'N/A',
      email: 'admin@hotel.com',
      telefono: '0000000000',
      password: 'admin123',
      role: 'admin'
    }];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAdmin));
    return defaultAdmin;
  }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
}

// Habitaciones
export function getRooms() {
  const rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  return rooms ? JSON.parse(rooms) : [];
}

export function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
}

// Reservas
export function getReservations() {
  const reservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  return reservations ? JSON.parse(reservations) : [];
}

export function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
}
