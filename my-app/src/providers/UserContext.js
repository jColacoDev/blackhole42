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
  
    const authWindow = window.open(authUrl, '_blank');
  
    const handleMessage = (event) => {
      // if (event.origin !== window.location.origin) {
      //   console.log("ignoring unknown origin")
      //   // Ignore messages from unknown origins
      //   return;
      // }
  
      const { authToken, authUserData } = event.data;
  
      console.log(event.data)

      if (authToken && authUserData) {
        try {
          const parsedUserData = JSON.parse(authUserData);
          setUser({ ...user, ...parsedUserData, authToken });
          router.push('/');
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
        }
      }
  
      // Cleanup
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

  return (
    <UserContext.Provider value={{ user, setUser, signOut, signIn42 }}>
      {children}
    </UserContext.Provider>
  );
};
