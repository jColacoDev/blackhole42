import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/providers/UserContext';

const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const checkAuth = async () => {
    try {
      let authToken = user?.authToken;

      if (!authToken) {
        const storedAuthToken = localStorage.getItem('authToken');
        const authUserData = localStorage.getItem('authUserData');
        if (storedAuthToken) {
          authToken = storedAuthToken;
          const parsedUserData = JSON.parse(authUserData);

          setUser({ ...user,...parsedUserData, authToken });
        } else {
          throw new Error('No token found');
        }
      }

      await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/token/verifyToken`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error('Not authenticated:', error);
      router.push('/auth');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [router, setUser]);

  return { checkAuth };
};

export default useAuth;
