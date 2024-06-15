"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const signIn = (token, userData) => {
    localStorage.setItem('token', token);
    setUser({ token, ...userData });
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);

    router.push(window.location.pathname);
  };

  return (
    <UserContext.Provider value={{ user, signOut, signIn }}>
      {children}
    </UserContext.Provider>
  );
};
