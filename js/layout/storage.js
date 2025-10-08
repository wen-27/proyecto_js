// Funciones para manejar localStorage

const STORAGE_KEYS = {
  USERS: 'hotel_users',
  ROOMS: 'hotel_rooms',
  RESERVATIONS: 'hotel_reservations',
  NOTIFICATIONS: 'hotel_notifications'
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

// 🔹 Inicializar habitaciones por defecto si no existen
(function initializeRooms() {
  try {
    let rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
    const defaultRooms = [
      {
        id: 1,
        location: 'Cartagena, Colombia',
        name: 'Suite Deluxe',
        description: 'Espaciosa suite con vista panorámica, jacuzzi privado y todas las comodidades de lujo.',
        beds: 2,
        capacity: 4,
        pricePerNight: 250000,
        image: 'img/salas/sala1.webp',
        services: ['WiFi', 'Minibar', 'Jacuzzi', 'Vista panorámica'],
        available: true
      },
      {
        id: 2,
        location: 'Bogotá, Colombia',
        name: 'Habitación Ejecutiva',
        description: 'Perfecta para viajes de negocios o parejas, con escritorio y zona de trabajo.',
        beds: 1,
        capacity: 2,
        pricePerNight: 180000,
        image: 'img/salas/standar.jpg',
        services: ['WiFi', 'Cafetera', 'Escritorio'],
        available: true
      },
      {
        id: 3,
        location: 'Medellín, Colombia',
        name: 'Habitación Familiar',
        description: 'Amplio espacio para toda la familia con dos habitaciones conectadas.',
        beds: 3,
        capacity: 6,
        pricePerNight: 320000,
        image: 'img/salas/familiar.png',
        services: ['WiFi', 'Área de juegos', 'Cocina'],
        available: true
      },
      {
        id: 4,
        location: 'Cali, Colombia',
        name: 'Habitación Estándar',
        description: 'Cómoda habitación con todas las comodidades básicas.',
        beds: 1,
        capacity: 2,
        pricePerNight: 150000,
        image: 'img/salas/standar.jpg',
        services: ['WiFi'],
        available: true
      },
      {
        id: 5,
        location: 'Barranquilla, Colombia',
        name: 'Suite Presidencial',
        description: 'La suite más lujosa con terraza privada y servicio de mayordomo.',
        beds: 2,
        capacity: 4,
        pricePerNight: 400000,
        image: 'img/salas/zuite.jpg',
        services: ['WiFi', 'Minibar', 'Jacuzzi', 'Vista panorámica', 'Servicio de habitaciones'],
        available: true
      },
      {
        id: 6,
        location: 'Cartagena, Colombia',
        name: 'Habitación Doble',
        description: 'Habitación cómoda para dos personas con vista al mar.',
        beds: 1,
        capacity: 2,
        pricePerNight: 200000,
        image: 'img/salas/doble.jpg',
        services: ['WiFi', 'Vista al mar'],
        available: true
      },
      {
        id: 7,
        location: 'Bogotá, Colombia',
        name: 'Habitación Suite Junior',
        description: 'Suite compacta ideal para parejas o viajes cortos.',
        beds: 1,
        capacity: 2,
        pricePerNight: 220000,
        image: 'img/salas/ejecutiva.png',
        services: ['WiFi', 'Minibar', 'Cafetera'],
        available: true
      },
      {
        id: 8,
        location: 'Medellín, Colombia',
        name: 'Habitación Triple',
        description: 'Espaciosa habitación para tres personas.',
        beds: 2,
        capacity: 3,
        pricePerNight: 280000,
        image: 'img/salas/familiar.png',
        services: ['WiFi', 'Cocina'],
        available: true
      },
      {
        id: 9,
        location: 'Cali, Colombia',
        name: 'Habitación con Balcón',
        description: 'Habitación con balcón privado y vista a la ciudad.',
        beds: 1,
        capacity: 2,
        pricePerNight: 170000,
        image: 'img/salas/mar.webp',
        services: ['WiFi', 'Balcón'],
        available: true
      },
      {
        id: 10,
        location: 'Barranquilla, Colombia',
        name: 'Habitación Deluxe',
        description: 'Habitación de lujo con amenities premium.',
        beds: 1,
        capacity: 2,
        pricePerNight: 260000,
        image: 'img/salas/sala8.jpg',
        services: ['WiFi', 'Minibar', 'Jacuzzi'],
        available: true
      },
      {
        id: 11,
        location: 'Cartagena, Colombia',
        name: 'Suite Marina',
        description: 'Suite con vista al mar y acceso directo a la playa.',
        beds: 2,
        capacity: 4,
        pricePerNight: 350000,
        image: 'img/salas/sala1.webp',
        services: ['WiFi', 'Minibar', 'Jacuzzi', 'Vista al mar'],
        available: true
      },
      {
        id: 12,
        location: 'Bogotá, Colombia',
        name: 'Habitación Business',
        description: 'Habitación ideal para ejecutivos con zona de trabajo amplia.',
        beds: 1,
        capacity: 2,
        pricePerNight: 190000,
        image: 'img/salas/standar.jpg',
        services: ['WiFi', 'Escritorio', 'Cafetera'],
        available: true
      },
      {
        id: 13,
        location: 'Medellín, Colombia',
        name: 'Suite Familiar Plus',
        description: 'Suite amplia para familias grandes con cocina completa.',
        beds: 3,
        capacity: 7,
        pricePerNight: 380000,
        image: 'img/salas/familiar.png',
        services: ['WiFi', 'Cocina', 'Área de juegos'],
        available: true
      },
      {
        id: 14,
        location: 'Cali, Colombia',
        name: 'Habitación Económica',
        description: 'Habitación básica pero cómoda para estancias cortas.',
        beds: 1,
        capacity: 1,
        pricePerNight: 120000,
        image: 'img/salas/standar.jpg',
        services: ['WiFi'],
        available: true
      },
      {
        id: 15,
        location: 'Barranquilla, Colombia',
        name: 'Suite Ejecutiva',
        description: 'Suite de alto nivel con servicios premium.',
        beds: 2,
        capacity: 4,
        pricePerNight: 420000,
        image: 'img/salas/zuite.jpg',
        services: ['WiFi', 'Minibar', 'Jacuzzi', 'Servicio de habitaciones'],
        available: true
      },
      {
        id: 16,
        location: 'Cartagena, Colombia',
        name: 'Habitación Vista Ciudad',
        description: 'Habitación con balcón y vista a la ciudad histórica.',
        beds: 1,
        capacity: 2,
        pricePerNight: 230000,
        image: 'img/salas/mar.webp',
        services: ['WiFi', 'Balcón'],
        available: true
      },
      {
        id: 17,
        location: 'Bogotá, Colombia',
        name: 'Habitación Romántica',
        description: 'Habitación especial para parejas con decoración romántica.',
        beds: 1,
        capacity: 2,
        pricePerNight: 210000,
        image: 'img/salas/ejecutiva.png',
        services: ['WiFi', 'Minibar', 'Cafetera'],
        available: true
      },
      {
        id: 18,
        location: 'Medellín, Colombia',
        name: 'Habitación Cuádruple',
        description: 'Habitación espaciosa para cuatro personas.',
        beds: 2,
        capacity: 4,
        pricePerNight: 300000,
        image: 'img/salas/familiar.png',
        services: ['WiFi', 'Cocina'],
        available: true
      },
      {
        id: 19,
        location: 'Cali, Colombia',
        name: 'Suite con Terraza',
        description: 'Suite con terraza privada y jacuzzi.',
        beds: 1,
        capacity: 2,
        pricePerNight: 280000,
        image: 'img/salas/sala8.jpg',
        services: ['WiFi', 'Jacuzzi', 'Terraza'],
        available: true
      },
      {
        id: 20,
        location: 'Barranquilla, Colombia',
        name: 'Habitación Premium',
        description: 'Habitación premium con amenities de lujo.',
        beds: 1,
        capacity: 2,
        pricePerNight: 270000,
        image: 'img/salas/doble.jpg',
        services: ['WiFi', 'Minibar', 'Vista panorámica'],
        available: true
      }
    ];

    if (!rooms || rooms === '[]' || JSON.parse(rooms).length < defaultRooms.length) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(defaultRooms));
    }
  } catch (err) {
    console.error('Error initializing rooms:', err);
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

export function updateReservation(reservationId, updatedReservation) {
  const reservations = getReservations();
  const index = reservations.findIndex(r => r.id === reservationId);
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...updatedReservation };
    saveReservations(reservations);
    return true;
  }
  return false;
}

export function checkRoomAvailability(roomId, fechaEntrada, fechaSalida, excludeReservationId = null) {
  const reservations = getReservations();
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  return !reservations.some(r => {
    if (r.id === excludeReservationId) return false;
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
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Notificaciones
export function getNotifications() {
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return notifications ? JSON.parse(notifications) : {};
}

export function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function addNotification(userEmail, message) {
  const notifications = getNotifications();
  if (!notifications[userEmail]) {
    notifications[userEmail] = [];
  }
  notifications[userEmail].push({ message, date: new Date().toISOString() });
  saveNotifications(notifications);
}

export function getUserNotifications(userEmail) {
  const notifications = getNotifications();
  return notifications[userEmail] || [];
}

export function clearUserNotifications(userEmail) {
  const notifications = getNotifications();
  if (notifications[userEmail]) {
    delete notifications[userEmail];
    saveNotifications(notifications);
  }
}
