"use client";

import "./page.scss";
import { useContext, useEffect } from 'react';
import { UserContext } from './../providers/UserContext';
import { useRouter } from 'next/navigation';
import useUser from "@/hooks/useUser";
import TopBanner from "@/components/topBanner/TopBanner";
import Header from "@/components/header/Header";

export default function HomePage() {
  useUser();
  const { user } = useContext(UserContext);
  const router = useRouter();

  return (
    <div className="HomePage">
      <Header name={user?.login ? user.login : 'Arthur Philip Dent'} />
      <TopBanner />
      
      <section className="welcomeSection">
        <h1>Welcome to 42hub!</h1>
        <p className="description">
          <strong>Welcome, {user?.first_name ? user.first_name : "hitchhiker"}!</strong> You're now at 42hub, the place where your journey through the coding universe begins.
        </p>
        <p className="description">
          This app is currently under development and is specifically crafted for the brilliant minds at 42. By leveraging the power of the 42 API, we aim to create tools that enhance your coding experience and make your life easier.
        </p>
        <p className="description">
          Our login process is powered by the secure 42 OAuth system. Once you log in, we gather the necessary information to tailor this app to your needs. So, grab your towel, stay curious, and let's embark on this coding adventure together!
        </p>
        <div className="hitchhikerTheme">
          <img src="/images/hitchhiker.jpg" alt="Hitchhiker's Guide to the Galaxy" className="themeImage" />
          <p className="themeText">Don't Panic and Always Know Where Your Towel Is!</p>
        </div>
      </section>
    </div>
  );
}
