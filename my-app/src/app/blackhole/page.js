"use client";
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from "@/db";
import useAuth from "@/hooks/useAuth";
import { UserContext } from './../../providers/UserContext';
import styles from "./page.module.scss";

const mergeProjects = (coreProjects, myProjects, projectsUsers) => {
  const projectMap = new Map();
  const projectsUsersMap = new Map();

  projectsUsers?.forEach(user => {
    if (!projectsUsersMap.has(user.project.id)) {
      projectsUsersMap.set(user.project.id, []);
    }
    projectsUsersMap.get(user.project.id).push(user);
  });

  coreProjects?.forEach(project => {
    projectMap.set(project.id, { ...project });
  });

  myProjects?.forEach(project => {
    if (projectMap.has(project.id)) {
      projectMap.set(project.id, { ...projectMap.get(project.id), ...project });
    } else {
      projectMap.set(project.id, { ...project });
    }
  });

  const mergedProjects = Array.from(projectMap.values()).map(project => ({
    ...project,
    projects_users: projectsUsersMap.get(project.id) || []
  }));

  return mergedProjects;
};

const BlackholePage = () => {
  useAuth();
  const { user } = useContext(UserContext);

  const [cursus_id, setCursus_id] = useState(0);
  const [name, setName] = useState('');
  const [projects_users, setProjects_users] = useState([]);
  const [projects, setProjects] = useState([]);
  const [coreProjects, setCoreProjects] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [daily_hours, setDaily_hours] = useState(0);
  const [kickoff_date, setKickoff_date] = useState('');
  const [level, setLevel] = useState(0);
  const [myCurrentBlackHole, setMyCurrentBlackHole] = useState("19/10/2024");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects_users)
      console.log(projects_users);
  }, [projects_users]);

  useEffect(() => {
    if (user)
      fetchUserData();
  }, [user]);

  useEffect(() => {
    if (cursus_id !== 0)
      fetchProjects();
  }, [cursus_id]);

  useEffect(() => {
    if (level)
      calculateXpFromLevel(level);
  }, [level]);

  const fetchProjects = async () => {
    try {
      const myProjectsResponse = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/myproject`, {
        headers: { Authorization: `Bearer ${user?.authToken}` }
      });
      const coreProjectsResponse = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/coreproject`, {
        headers: { Authorization: `Bearer ${user?.authToken}` }
      });
      setProjects(myProjectsResponse.data);
      setCoreProjects(coreProjectsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Blackhole Failed to fetch projects:');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/user`, {
        headers: {
          Authorization: `Bearer ${user?.authToken}`,
        },
      });
      const userData = response.data;

      setWeekly_days(userData.weekly_days ?? '');
      setDaily_hours(userData.daily_hours ?? '');
      setName(user.login ?? '');
      setCursus_id(user.cursus_id ?? 0);
      setLevel(user.cursus_user_level ?? 0);
      setProjects_users(user.projects_users ?? []);
      setKickoff_date(formatToYYYYMMDD(user.cursus_user_created_at) ?? '');

    } catch (error) {
      console.error('Blackhole Error fetching user data');
    }
  };

  const formatToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

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
    if (!loading) {
      const mergedProjects = mergeProjects(coreProjects, projects, projects_users);
      console.log(mergedProjects);
      if (Array.isArray(mergedProjects) && mergedProjects.length > 0) {
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
    }
  }, [loading, coreProjects, projects, projects_users]);
  

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
            projects={mergeProjects(coreProjects, projects)} 
            myXp={myXp} 
            myRank={myRank} 
            setProjects={setProjects} // Pass the setProjects function
          />
        </>
      )}
    </div>
  );
};

export default BlackholePage;
