"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUserData');
    router.push(window.location.pathname);
  };

  const signIn42 = () => {
    const clientId = process.env.NEXT_PUBLIC_42_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/auth/callback`;
    const scope = "public";
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
    const authWindow = window.open(authUrl);
  
    const handleMessage = (event) => {  
      const { authToken, authUserData } = event.data;

      if (authToken && authUserData) {
        try {
          setUser({ ...user, ...JSON.parse(authUserData), authToken });
          router.push('/');
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
        }
      }
      window.removeEventListener('message', handleMessage);
    };
    window.addEventListener('message', handleMessage);
  };
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('authUserData'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const authUserData = JSON.parse(localStorage.getItem('authUserData'));

    if (authToken && authUserData) {
      setUser({ ...authUserData, authToken });
    } else {
      setUser(null);
    }
  }, [setUser]);
  
  return (
    <UserContext.Provider value={{ user, setUser, signOut, signIn42 }}>
      {children}
    </UserContext.Provider>
  );
};
