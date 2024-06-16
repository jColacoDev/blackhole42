"use client"
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function RedirectPage() {
  const searchParams = useSearchParams();

  const handleAuthentication = async () => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userData));
        const { email } = parsedUserData;

        const endpoint = `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/auth/login`;
        const response = await axios.post(endpoint, { email });
        
        if (!response.data.token) {
          throw new Error('Server login failed');
        }

        const { user, token } = response.data;

        localStorage.setItem('server_user', JSON.stringify(user));
        localStorage.setItem('server_token', token);
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUserData', JSON.stringify(parsedUserData));
      } catch (error) {
        console.error('Failed to authenticate:', error);
      }
    }
  };

  useEffect(() => {
    handleAuthentication();
    const timer = setTimeout(() => {
      window.close();
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <section>
      <h2>Redirecting...</h2>
    </section>
  );
}
