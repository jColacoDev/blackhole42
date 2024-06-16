"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUserData')
    router.push(window.location.pathname);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('authUserData'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
