/**
 * Storage manager for Qaza Tracker
 */

const STORAGE_KEY = 'qaza_tracker_data';

export const saveAppData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadAppData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { users: [], currentUserId: null };
};

export const addUser = (userState) => {
  const data = loadAppData();
  data.users.push(userState);
  data.currentUserId = userState.id;
  saveAppData(data);
  return data;
};

export const updateCurrentUser = (updateFn) => {
  const data = loadAppData();
  const index = data.users.findIndex(u => u.id === data.currentUserId);
  if (index !== -1) {
    data.users[index] = updateFn(data.users[index]);
    saveAppData(data);
  }
  return data;
};

export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
