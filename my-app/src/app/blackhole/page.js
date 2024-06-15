"use client"

import styles from "./page.module.scss";
import { useEffect, useState } from 'react';
import axios from 'axios';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from '@/db';
import useAuth from "@/hooks/useAuth";

export default function BlackholePage () {
    useAuth();

  const [name, setName] = useState('');
  const [projects, setProjects] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [daily_hours, setDaily_hours] = useState(0);
  const [kickoff_date, setKickoff_date] = useState('');
  const [level, setLevel] = useState(0);
  const [level_percentage, setLevel_percentage] = useState(4);
  const [myCurrentBlackHole, setMyCurrentBlackHole] = useState("19/10/2024");

  function calculateXpFromLevel(level, levelPercentage) {
    if (level < 0 || level >= levels.length)
      throw new Error('Invalid level');

    const currentLevel = levels[level];
    const nextLevel = levels[level + 1];
  
    if (!nextLevel) 
      setMyXp(currentLevel.xp_total);
    else{
      const xpDifference = nextLevel.xp_total - currentLevel.xp_total;
      const xpFromPercentage = (xpDifference * levelPercentage) / 100;
      setMyXp(currentLevel.xp_total + xpFromPercentage);
    }
  }

  function calculateLevelFromXp(xp) {
    let level = 0;
    let levelPercentage = 0;
  
    for (let i = 0; i < levels.length - 1; i++) {
      if (xp >= levels[i].xp_total && xp < levels[i + 1].xp_total) {
        level = levels[i].level;
        const xpDifference = levels[i + 1].xp_total - levels[i].xp_total;
        levelPercentage = ((xp - levels[i].xp_total) / xpDifference) * 100;
        break;
      }
    }
  
    if (xp >= levels[levels.length - 1].xp_total) {
      level = levels[levels.length - 1].level;
      levelPercentage = 100;
    }
  
    return { level, levelPercentage };
  }

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login'; 
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }
    }
  };
  
  useEffect(() => {
    fetchUserData();
    fetchProjects();
  }, []);
    
    useEffect(()=>{
      calculateXpFromLevel(level, level_percentage);
  }, [level, level_percentage]);

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

      setWeekly_days(userData.weekly_days ?? '');
      setDaily_hours(userData.daily_hours ?? '');
      setKickoff_date(formatToYYYYMMDD(userData.kickoff_date) ?? '');
      setName(userData.name ?? '');
      setLevel(userData.level ?? 0);
      setLevel_percentage(userData.level_percentage ?? 0);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
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
    <div>
        <TopBanner 
          daily_hours={daily_hours}
          weekly_days={weekly_days}
          kickoff_date={kickoff_date}
        />
        <Header 
            myCurrentBlackHole={myCurrentBlackHole}
            level={level}
            level_percentage={level_percentage}
            myXp={myXp}
            name={name}
        />
        <ProjectCards projects={projects} myXp={myXp} myRank={myRank} />
    </div>
  );
};
