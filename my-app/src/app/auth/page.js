"use client";
import styles from "./page.module.scss";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './../../providers/UserContext';
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  useAuth();

  const router = useRouter();

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
        setLoading(false);
        router.push("/");
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser]);

  return (
    <section className={styles.page}>
      {user ? (
        <div className={styles.login_form}>
          <h2>Hello {user.first_name}</h2>
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
