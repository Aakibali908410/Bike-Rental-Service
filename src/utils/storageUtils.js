// LocalStorage utility functions

const STORAGE_KEYS = {
  USERS: 'aliMotoUsers',
  CURRENT_USER: 'aliMotoCurrentUser',
  BIKES: 'aliMotoBikes',
  BOOKINGS: 'aliMotoBookings'
};

export const storageUtils = {
  // Users
  getUsers: () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },
  setUsers: (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Current User
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Bikes
  getBikes: () => {
    const bikes = localStorage.getItem(STORAGE_KEYS.BIKES);
    return bikes ? JSON.parse(bikes) : [];
  },
  setBikes: (bikes) => {
    localStorage.setItem(STORAGE_KEYS.BIKES, JSON.stringify(bikes));
  },

  // Bookings
  getBookings: () => {
    const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return bookings ? JSON.parse(bookings) : [];
  },
  setBookings: (bookings) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};

export default storageUtils;
