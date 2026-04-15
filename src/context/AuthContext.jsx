import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, signupWithEmail, loginWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
