"use client";
import React, { useState, useEffect, useContext } from 'react';
import styles from './page.module.scss';
import axios from 'axios';
import useAuth from "@/hooks/useAuth";
import { UserContext } from './../../providers/UserContext';

export default function ProfilePage() {
  useAuth();
  const { user, setUser } = useContext(UserContext);

  // Ensure initial values are always defined
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  const [daily_hours, setDaily_hours] = useState(user?.daily_hours || 0);
  const [weekly_days, setWeekly_days] = useState(user?.weekly_days || 0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only update state if user is defined
    if (user) {
      setEmail(user.email || '');
      setPassword(user.password || '');
      setDaily_hours(user.daily_hours || 0);
      setWeekly_days(user.weekly_days || 0);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        email,
        password,
        daily_hours,
        weekly_days,
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/user`, updatedUser, {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      });

      setUser({ ...user, ...updatedUser });
      console.log('User updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
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
            <label className={styles.lf_label}>
              Name
            </label>
            <span className={styles.lf_input}>
              {user?.first_name}
            </span>
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label}>
              E-mail
            </label>
            <span className={styles.lf_input}>
              {user?.email}
            </span>
          </div>
        </div>
        <div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label}>
              Kickoff
            </label>
            <span className={styles.lf_input}>
              {formatToYYYYMMDD(user?.cursus_user_created_at)}
            </span>
          </div>
          <div className={styles.flex_row}>
            <label className={styles.lf_label}>
              Level
            </label>
            <span className={styles.lf_input}>
              {user?.cursus_user_level}
            </span>
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
              onChange={(e) => setDaily_hours(Number(e.target.value))}
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
              onChange={(e) => setWeekly_days(Number(e.target.value))}
            />
          </div>
        </div>
        <input className={styles.lf_submit} type="submit" value="Update Profile" />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}
