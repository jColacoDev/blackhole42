"use client";
import React, { useEffect, useState, useContext } from 'react';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from "@/db";
import useAuth from "@/hooks/useAuth";
import { UserContext } from './../../providers/UserContext';
import { ProjectsContext } from './../../providers/ProjectsContext';
import { formatToYYYYMMDD } from '@/utils/utils';
import axios from 'axios';

const BlackholePage = () => {
  useAuth();
  const { user } = useContext(UserContext);
  const { mergedProjects, loading } = useContext(ProjectsContext);

  const [name, setName] = useState('');
  const [rank, setrank] = useState(0);
  const [xp, setXp] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [daily_hours, setDaily_hours] = useState(0);
  const [kickoff_date, setKickoff_date] = useState('');
  const [level, setLevel] = useState(0);
  const [currentBlackHole, setCurrentBlackHole] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.first_name || '');
      setLevel(user.cursus_user_level || 0);
      setKickoff_date(user.kickoff_date || '');
      setDaily_hours(user.daily_hours || 0);
      setWeekly_days(user.weekly_days || 0);
      setCurrentBlackHole(formatToYYYYMMDD(user.cursus_user_blackholed_at) || "");
    }
  }, [user]);

  useEffect(() => {
    if (level)
      calculateXpFromLevel(level);
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
      setXp(Math.round(currentLevel?.xp_total));
    } else {
      const xpDifference = nextLevel.xp_total - currentLevel?.xp_total;
      const xpFromPercentage = (xpDifference * levelPercentage) / 100;
      const totalXp = currentLevel?.xp_total + xpFromPercentage;
      setXp(Math.round(totalXp));
    }
  };

  useEffect(() => {
    if (!loading && Array.isArray(mergedProjects) && mergedProjects.length > 0) {
      mergedProjects.sort((a, b) => a.rank - b.rank);
      for (const project of mergedProjects) {
        const { rank, start_date, end_date, grade, projects_users } = project;
        if(projects_users){
          if (!(projects_users[0]?.final_mark >= 100)) {
            setrank(rank);
            return;
          }
        }
      }
      const maxRank = mergedProjects.reduce((max, project) => Math.max(max, project.rank), 0);
      setrank(maxRank + 1);
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
            currentBlackHole={currentBlackHole}
            level={level}
            xp={xp}
            name={name}
            rank={rank}
          />
          <ProjectCards 
            user={user}
            projects={mergedProjects} 
            xp={xp}
            rank={rank}
          />
        </>
      )}
    </div>
  );
};

export default BlackholePage;
