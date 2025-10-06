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
  let rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  if (!rooms) {
    // Crear habitaciones de muestra si no existen
    const defaultRooms = [
      {
        id: 1,
        name: 'Suite Deluxe',
        capacity: 4,
        beds: 2,
        services: ['WiFi', 'Minibar', 'Jacuzzi', 'Vista panorámica'],
        pricePerNight: 250000,
        image: 'img/Hotel La Semilla - Playa del Carmen, Mexico _.jpeg',
        description: 'Espaciosa suite con vista panorámica, jacuzzi privado y todas las comodidades de lujo.',
        available: true
      },
      {
        id: 2,
        name: 'Habitación Ejecutiva',
        capacity: 2,
        beds: 1,
        services: ['WiFi', 'Cafetera', 'Escritorio'],
        pricePerNight: 180000,
        image: 'img/Chic 2bdr Ground Floor at El Faro Coral 101!.jpeg',
        description: 'Perfecta para viajes de negocios o parejas, con escritorio y zona de trabajo.',
        available: true
      },
      {
        id: 3,
        name: 'Habitación Familiar',
        capacity: 6,
        beds: 3,
        services: ['WiFi', 'Área de juegos', 'Cocina'],
        pricePerNight: 320000,
        image: 'img/salas/familiar.png',
        description: 'Amplio espacio para toda la familia con dos habitaciones conectadas.',
        available: true
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(defaultRooms));
    rooms = JSON.stringify(defaultRooms);
  }
  return JSON.parse(rooms);
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

  return !reservations.some(reservation => {
    if (reservation.roomId !== roomId) return false;
    const resEntrada = new Date(reservation.fechaEntrada);
    const resSalida = new Date(reservation.fechaSalida);
    // Check overlap: not (salida <= resEntrada or entrada >= resSalida)
    return !(salida <= resEntrada || entrada >= resSalida);
  });
}

// Usuario actual
export function getCurrentUser() {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}
