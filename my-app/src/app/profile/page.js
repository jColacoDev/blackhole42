"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import axios from 'axios';
import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kickoff_date, setKickoff_date] = useState('');
  const [daily_hours, setDaily_hours] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [level, setLevel] = useState(0);
  const [level_percentage, setLevel_percentage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
  
        setName(userData.name ?? '');
        setEmail(userData.email ?? '');
        setLevel(userData.level ?? 0);
        setDaily_hours(userData.daily_hours ?? 0);
        setWeekly_days(userData.weekly_days ?? 0);
        setLevel_percentage(userData.level_percentage ?? 0);
  
        if (userData.kickoff_date) {
          const formattedDate = new Date(userData.kickoff_date).toISOString().slice(0, 10);
          setKickoff_date(formattedDate);
        } else {
          setKickoff_date('');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
        if (error.response && error.response.status === 401) {
          router.push('/auth');
        }
      }
    };
  
    fetchUserData();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name,
        email,
        password,
        kickoff_date: formatToYYYYMMDD(kickoff_date),
        level,
        level_percentage,
        daily_hours,
        weekly_days,
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/user`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
      if (error.response && error.response.status === 401) {
        router.push('/auth');
      }
    }
  };

  const formatToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <section className={styles.page}>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={styles.lf_input}
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              className={styles.lf_input}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={styles.lf_input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="kickoff_date">
              Kickoff
            </label>
            <input
              id="kickoff_date"
              className={styles.lf_input}
              placeholder="Kickoff Date"
              type="date"
              value={kickoff_date}
              onChange={(e) => setKickoff_date(e.target.value)}
            />
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="level">
              Level
            </label>
            <input
              id="level"
              className={styles.lf_input}
              placeholder="Level"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="level_percentage">
              Level %
            </label>
            <input
              id="level_percentage"
              className={styles.lf_input}
              placeholder="Level Percentage"
              type="number"
              value={level_percentage}
              onChange={(e) => setLevel_percentage(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="daily_hours">
              Daily hours
            </label>
            <input
              id="daily_hours"
              className={styles.lf_input}
              placeholder="Daily hours"
              type="number"
              value={daily_hours}
              onChange={(e) => setDaily_hours(e.target.value)}
            />
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label} htmlFor="weekly_days">
              Weekly days
            </label>
            <input
              id="weekly_days"
              className={styles.lf_input}
              placeholder="Weekly days"
              type="number"
              value={weekly_days}
              onChange={(e) => setWeekly_days(e.target.value)}
            />
          </div>
        </div>
        <input className={styles.lf_submit} type="submit" value="Update Profile" />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}
