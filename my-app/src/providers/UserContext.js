"use client";
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [levels, setLevels] = useState(null);

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
  
    window.open(authUrl);
  };

  const handleAuthCallback = async (event) => {
    if (event.origin !== window.location.origin) return;

    const { authToken, authUserData } = event.data;

    if (authToken && authUserData) {
      try {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUserData', JSON.stringify(authUserData));
        setUser({ ...JSON.parse(authUserData), authToken });
        await fetchUserData(authToken);
        router.push('/');
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
    window.removeEventListener('message', handleAuthCallback);
  };

  const fetchLevels = async (token) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/user/levels`);
      const levelData = response.data;
      // console.log(levelData);
      setLevels(levelData);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser((prevUser) => ({ ...prevUser, ...userData }));
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleAuthCallback);
    return () => {
      window.removeEventListener('message', handleAuthCallback);
    };
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const authUserData = JSON.parse(localStorage.getItem('authUserData'));

    if (authToken && authUserData) {
      setUser({ ...authUserData, authToken });
      fetchUserData(authToken);
    }
    fetchLevels();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, signOut, signIn42, levels }}>
      {children}
    </UserContext.Provider>
  );
};
