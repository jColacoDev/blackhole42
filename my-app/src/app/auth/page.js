"use client";
import styles from "./page.module.scss";
import { useContext } from 'react';
import { UserContext } from './../../providers/UserContext';

export default function AuthPage() {
  const { user, setUser, signOut } = useContext(UserContext);

  const handle42SignInSubmit = (e) => {
    e.preventDefault();

    const clientId = process.env.NEXT_PUBLIC_42_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/auth/callback`;
    const scope = "public";
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    const authWindow = window.open(authUrl, '_blank');
    const interval = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(interval);
        console.log('Authentication window closed.');
        const authToken = localStorage.getItem('authToken');
        const authUserData = localStorage.getItem('authUserData');
    
        console.log(authToken)
        console.log(authUserData)

        if (authToken && authUserData) {
          try {
            const parsedUserData = JSON.parse(authUserData);
            setUser({ ...user, ...parsedUserData, authToken });

            localStorage.removeItem('authToken');
            localStorage.removeItem('authUserData');
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
          }
        }
      }
    }, 1500);
  };

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
          <button onClick={handle42SignInSubmit} className={styles.lf_submit}>Sign In</button>
        </form>
      )}
      </section>
    );
  }
  