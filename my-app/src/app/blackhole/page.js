"use client"

import styles from "./page.module.scss";
import { useEffect, useState } from 'react';
import axios from 'axios';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from '@/db';

export default function Blackhole () {
  const [projects, setProjects] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [myLevel, setMyLevel] = useState(0);
  const [myLevelPercentage, setMyLevelPercentage] = useState(4);
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
        window.location.href = '/login'; // Redirect to login if token is not present
        return;
      }
    //   const response = await axios.get('/api/projects', { headers: { Authorization: token } });
      const response = await axios.get('/api/projects', { });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

    useEffect(()=>{
        fetchProjects();

        setMyLevel(1);
        setMyLevelPercentage(4);
    }, []);
    
    useEffect(()=>{
      calculateXpFromLevel(myLevel, myLevelPercentage);

  }, [myLevel, myLevelPercentage]);

  return (
    <div>
        <TopBanner />
        <Header 
            myCurrentBlackHole={myCurrentBlackHole}
            myLevel={myLevel}
            myLevelPercentage={myLevelPercentage}
            myXp={myXp}
        />
        <ProjectCards projects={projects} myXp={myXp} myRank={myRank} />
    </div>
  );
};
