import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log(token)
        if (!token) {
          throw new Error('No token found');
        }
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/token/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Not authenticated:', error);
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);
};

export default useAuth;
