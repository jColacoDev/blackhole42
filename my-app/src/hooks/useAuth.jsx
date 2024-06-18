import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/providers/UserContext';

const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const removeUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUserData');
    setUser(null);
    if (router.pathname !== '/auth')
      router.push('/auth');
  };

  const checkAuth = async () => {
    let flag = "";

    try {
      let authToken = user?.authToken;

      if (!authToken) {
        const storedAuthToken = localStorage.getItem('authToken');
        const authUserData = localStorage.getItem('authUserData');
        if (storedAuthToken) {
          authToken = storedAuthToken;
          const parsedUserData = JSON.parse(authUserData);
          setUser({ ...user, ...parsedUserData, authToken });
        } else {
          flag = "No token found";
        }
      }
      if(authToken){
        await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/token/verifyToken`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
    } catch (error) {
      flag = `${flag} - Not authenticated`;
    }
    if (flag) {
      console.error(flag);
      removeUser();
    }
  };

  useEffect(() => {
    if (!user?.authToken) {
      checkAuth();
    }
  }, [user]);

  return { checkAuth };
};

export default useAuth;
