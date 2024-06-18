"use client";
import styles from "./page.module.scss";
import { useContext } from 'react';
import { UserContext } from './../../providers/UserContext';
import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  useAuth();

  const { user, signOut, signIn42 } = useContext(UserContext);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

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
