"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import BlackholeAnimation from '@/components/BlackholeAnimation/BlackholeAnimation';

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const message = "We are logging In";
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

        const { user: responseUser, token: responseToken } = response.data;
        const mergedUserData = JSON.stringify({ ...responseUser, ...parsedUserData })

        localStorage.setItem('server_user', JSON.stringify(responseUser));
        localStorage.setItem('authToken', responseToken);
        localStorage.setItem('authUserData', mergedUserData);
        window.opener.postMessage(
          { authToken: responseToken, authUserData: mergedUserData },
          window.location.origin
        );

        window.close();
      } catch (error) {
        console.error('Failed to authenticate:', error);
      }
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, [searchParams]);

  return (
    <section className="redirectPage">
      <BlackholeAnimation message={message} />
    </section>
  );
}
