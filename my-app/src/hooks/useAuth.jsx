import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/providers/UserContext';

const useAuth = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const checkAuth = async () => {
    try {
      if (!user?.authToken) {
        throw new Error('No token found');
      }
      await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/token/verifyToken`, {
        headers: {
          Authorization: `Bearer ${user.authToken}`,
        },
      });
    } catch (error) {
      console.error('Not authenticated:', error);
      router.push('/auth');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router]);
};

export default useAuth;
