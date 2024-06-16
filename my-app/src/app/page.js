"use client";

import styles from "./page.module.scss";
import { useContext, useEffect } from 'react';
import { UserContext } from './../providers/UserContext';
import { useRouter } from 'next/navigation';
import useUser from "@/hooks/useUser";

export default function HomePage() {
  useUser();
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleLoginClick = (e) => {
    e.preventDefault();
    router.push('/auth');
  };

  return (
    <div className={styles.Home}>
      <h1>
        Hello {user?.first_name ? user.first_name : 'stranger'}!
      </h1>
      {!user && <button onClick={handleLoginClick} className={styles.lf_submit}>Sign in</button>}
    </div>
  );
}
