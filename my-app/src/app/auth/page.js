"use client";
import styles from "./page.module.scss";
import { useState, useContext, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from './../../providers/UserContext';

export default function AuthPage() {
  const { user, signOut, signIn } = useContext(UserContext);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  
  useEffect(()=>{
    console.log(user)
  }, [user])

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    if (token && userData) {
      const parsedUserData = JSON.parse(decodeURIComponent(userData));
      
      signIn(token, parsedUserData);
      // router.push('/');
    }
  }, [searchParams]);

  const handle42SignInSubmit = (e) => {
    e.preventDefault();

    const clientId = process.env.NEXT_PUBLIC_42_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/auth/callback`;
    const scope = "public";
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
    // router.push('/');
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
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}
