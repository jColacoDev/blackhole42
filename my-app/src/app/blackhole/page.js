"use client";
import React, { useEffect, useState, useContext } from 'react';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from "@/db";
import useAuth from "@/hooks/useAuth";
import { UserContext } from './../../providers/UserContext';
import { ProjectsContext } from './../../providers/ProjectsContext';

const BlackholePage = () => {
  useAuth();
  const { user } = useContext(UserContext);
  const { mergedProjects, loading } = useContext(ProjectsContext);

  const [cursus_id, setCursus_id] = useState(0);
  const [name, setName] = useState('');
  const [myRank, setMyRank] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [daily_hours, setDaily_hours] = useState(0);
  const [kickoff_date, setKickoff_date] = useState('');
  const [level, setLevel] = useState(0);
  const [myCurrentBlackHole, setMyCurrentBlackHole] = useState("19/10/2024");

  useEffect(() => {
    if (user) {
      setName(user.first_name || '');
      setCursus_id(user.cursus_id || 0);
      setLevel(user.level || 0);
      setKickoff_date(user.kickoff_date || '');
      setDaily_hours(user.daily_hours || 0);
      setWeekly_days(user.weekly_days || 0);
      setMyCurrentBlackHole(user.blackhole_date || "19/10/2024");
    }
  }, [user]);

  useEffect(() => {
    if (level) {
      calculateXpFromLevel(level);
    }
  }, [level]);

  const calculateXpFromLevel = (level) => {
    const integerPart = Math.floor(level);
    const fractionalPart = level - integerPart;
    const levelPercentage = fractionalPart * 100;

    if (integerPart < 0 || integerPart >= levels.length)
      throw new Error('Invalid level');

    const currentLevel = levels[integerPart];
    const nextLevel = levels[integerPart + 1];

    if (!nextLevel) {
      setMyXp(Math.round(currentLevel?.xp_total));
    } else {
      const xpDifference = nextLevel.xp_total - currentLevel?.xp_total;
      const xpFromPercentage = (xpDifference * levelPercentage) / 100;
      const totalXp = currentLevel?.xp_total + xpFromPercentage;
      setMyXp(Math.round(totalXp));
    }
  };

  useEffect(() => {
    if (!loading && Array.isArray(mergedProjects) && mergedProjects.length > 0) {
      mergedProjects.sort((a, b) => a.rank - b.rank);
      for (const project of mergedProjects) {
        const { rank, start_date, end_date, grade } = project;
        if (!(start_date && end_date && grade >= 100)) {
          setMyRank(rank);
          return;
        }
      }
      const maxRank = mergedProjects.reduce((max, project) => Math.max(max, project.rank), 0);
      setMyRank(maxRank + 1);
    }
  }, [loading, mergedProjects]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <TopBanner
            daily_hours={daily_hours}
            weekly_days={weekly_days}
            kickoff_date={kickoff_date}
          />
          <Header
            myCurrentBlackHole={myCurrentBlackHole}
            level={level}
            myXp={myXp}
            name={name}
            rank={myRank}
          />
          <ProjectCards 
            user={user} 
            projects={mergedProjects} 
            myXp={myXp} 
            myRank={myRank} 
          />
        </>
      )}
    </div>
  );
};

export default BlackholePage;
