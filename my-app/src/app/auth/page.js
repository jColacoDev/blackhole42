"use client";
import styles from "./page.module.scss";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './../../providers/UserContext';
import useAuth from "@/hooks/useAuth";

export default function AuthPage() {
  useAuth();

  const { user, setUser, signOut, signIn42 } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    signIn42();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem('authUserData'));
      const authToken = localStorage.getItem('authToken');
      if (storedUser && authToken) {
        setUser({ ...storedUser, authToken });
        setLoading(false); // Stop loading when user is set
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
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <form className={styles.login_form}>
          <h2>Sign in with 42</h2>
          <button onClick={handleSignIn} className={styles.lf_submit}>Sign In</button>
        </form>
      )}
    </section>
  );
}
