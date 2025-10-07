// Funciones para manejar localStorage

const STORAGE_KEYS = {
  USERS: 'hotel_users',
  ROOMS: 'hotel_rooms',
  RESERVATIONS: 'hotel_reservations'
};

// 🔹 Inicializar admin por defecto si no existe
(function initializeAdmin() {
  try {
    let users = localStorage.getItem(STORAGE_KEYS.USERS);
    const defaultAdmin = [{
      identificacion: 'admin001',
      nombreCompleto: 'Administrador Principal',
      nacionalidad: 'N/A',
      email: 'admin@hotel.com',
      telefono: '0000000000',
      password: 'admin123',
      role: 'admin'
    }];

    if (!users || users === '[]') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAdmin));
    } else {
      const parsedUsers = JSON.parse(users);
      if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultAdmin));
      } else {
        // Si no existe un admin, agregarlo
        const hasAdmin = parsedUsers.some(u => u.role === 'admin');
        if (!hasAdmin) {
          parsedUsers.push(defaultAdmin[0]);
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
        }
      }
    }
  } catch (err) {
    console.error('Error initializing admin:', err);
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
  }
})();

// Usuarios
export function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  try {
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return [];
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
  let rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  if (!rooms) return [];

  const parsedRooms = JSON.parse(rooms);

  parsedRooms.forEach(room => {
    room.image = room.image.replace(/^\.*\/?/, ''); 
    room.image = `img/salas/${room.image.split('/').pop()}`; 
  });

  return parsedRooms;
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

export function addReservation(reservation) {
  const reservations = getReservations();
  reservations.push(reservation);
  saveReservations(reservations);
}

export function checkRoomAvailability(roomId, fechaEntrada, fechaSalida) {
  const reservations = getReservations();
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  return !reservations.some(r => {
    if (r.roomId !== roomId) return false;
    const resStart = new Date(r.fechaEntrada);
    const resEnd = new Date(r.fechaSalida);
    return !(salida <= resStart || entrada >= resEnd);
  });
}

export function getAvailableDateRanges(roomId) {
  const reservations = getReservations().filter(r => r.roomId === roomId);
  const today = new Date();
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 1);
  reservations.sort((a,b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada));
  const ranges = [];
  let currentStart = new Date(today);
  for (const res of reservations) {
    const resStart = new Date(res.fechaEntrada);
    const resEnd = new Date(res.fechaSalida);
    if (currentStart < resStart) ranges.push({start: new Date(currentStart), end: new Date(resStart)});
    currentStart = resEnd > currentStart ? resEnd : currentStart;
  }
  if (currentStart < oneYearLater) ranges.push({start: new Date(currentStart), end: new Date(oneYearLater)});
  return ranges;
}

// Usuario actual
export function getCurrentUser() {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}
