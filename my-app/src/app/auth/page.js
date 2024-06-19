"use client";
import styles from "./page.module.scss";
import { useContext, useEffect } from 'react';
import { UserContext } from './../../providers/UserContext';
import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  useAuth();

  const { user, setUser, signOut, signIn42 } = useContext(UserContext);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem('authUserData'));
      const authToken = localStorage.getItem('authToken');
      if (storedUser && authToken) {
        setUser({ ...storedUser, authToken });
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial check in case the data is already in localStorage
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);

  return (
    <section className={styles.page}>
      {user ? (
        <div>
          <p>Hello {user.first_name}</p>
          <button onClick={handleSignOut} className={styles.lf_submit}>Sign Out</button>
        </div>
      ) : (
        <form className={styles.login_form}>
          <h2>Sign in with 42</h2>
          <button onClick={signIn42} className={styles.lf_submit}>Sign In</button>
        </form>
      )}
    </section>
  );
}
