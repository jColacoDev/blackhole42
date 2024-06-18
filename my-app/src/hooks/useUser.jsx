import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/providers/UserContext';
import useAuth from "@/hooks/useAuth";

const useUser = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const checkUser = async () => {
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUserData');
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, [router, setUser]);

  return { checkUser };
};

export default useUser;
