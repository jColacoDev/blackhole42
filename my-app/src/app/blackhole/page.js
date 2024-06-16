"use client"

import styles from "./page.module.scss";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TopBanner from '@/components/topBanner/TopBanner';
import Header from "@/components/header/Header";
import ProjectCards from "@/components/projectCards/ProjectCards";
import { levels } from '@/db';
import useAuth from "@/hooks/useAuth";
import { UserContext } from './../../providers/UserContext';

export default function BlackholePage () {
  useAuth();
  const { user } = useContext(UserContext);

  const [cursus_id, setCursus_id] = useState(0);
  const [name, setName] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [myRank, setMyRank] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [weekly_days, setWeekly_days] = useState(0);
  const [daily_hours, setDaily_hours] = useState(0);
  const [kickoff_date, setKickoff_date] = useState('');
  const [level, setLevel] = useState(0);
  const [myCurrentBlackHole, setMyCurrentBlackHole] = useState("19/10/2024");
  const [filterText, setFilterText] = useState('');

  function calculateXpFromLevel() {
    const levelPercentage = 4;
    if (level < 0 || level >= levels.length)
      throw new Error('Invalid level');

    const currentLevel = levels[level];
    const nextLevel = levels[level + 1];
  
    if (!nextLevel) 
      setMyXp(currentLevel?.xp_total);
    else{
      const xpDifference = nextLevel.xp_total - currentLevel?.xp_total;
      const xpFromPercentage = (xpDifference * levelPercentage) / 100;
      setMyXp(currentLevel?.xp_total + xpFromPercentage);
    }
  }

  const fetchProjects = async (update = false) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/auth'; 
        return;
      }
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/myproject`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("projects", response.data);
  
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/auth';
      }
    }
  };

  useEffect(() => {
    if(cursus_id != 0)
      fetchProjects(false);
  }, [cursus_id]);

  useEffect(() => {
    if(user)
      fetchUserData();
  }, [user]);
    
  useEffect(()=>{
    if(level != 0)
      calculateXpFromLevel();
  }, [level]);

  useEffect(() => {
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [filterText, projects]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;

      console.log(user);

      setCursus_id(user.cursus_id ?? 0);
      setWeekly_days(userData.weekly_days ?? '');
      setDaily_hours(userData.daily_hours ?? '');
      setKickoff_date(formatToYYYYMMDD(user.cursus_user_created_at) ?? '');
      setName(user.login ?? '');
      setLevel(user.cursus_user_level ?? 0);

    } catch (error) {
      console.error('Error fetching user data:', error);
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
        myXp={myXp}
        name={name}
      />
      <section className={styles.filters}>
        <input 
          type="text" 
          value={filterText} 
          onChange={(e) => setFilterText(e.target.value)} 
          placeholder="Filter projects by name" 
        />
        <div>
          <p>Filtered Projects: {filteredProjects.length}</p>
          {filteredProjects.map(project => (
            <div key={project.id}>
              <p>Name: {project.name}</p>
              <p>ID: {project.id}</p>
            </div>
          ))}
        </div>
      </section>
      <ProjectCards projects={projects} myXp={myXp} myRank={myRank} />
    </div>
  );
};
