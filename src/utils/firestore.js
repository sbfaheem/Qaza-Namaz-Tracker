import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const getUserDocRef = (uid) => doc(db, 'users', uid);

export const fetchUserData = async (uid) => {
  if (!uid) return null;
  const docRef = getUserDocRef(uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: uid };
  }
  return null;
};

export const initializeUserRecord = async (uid, userState) => {
  const docRef = getUserDocRef(uid);
  const dataToSave = {
    profile: userState.profile,
    stats: userState.stats,
    dailyLogs: userState.dailyLogs || []
  };
  await setDoc(docRef, dataToSave);
  return { ...dataToSave, id: uid };
};

export const persistUserData = async (uid, userData) => {
  if (!uid) return;
  const docRef = getUserDocRef(uid);
  
  // Exclude 'id' from what is saved in the document body
  const { id, ...dataToSave } = userData;
  await updateDoc(docRef, dataToSave);
};
