"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const ProjectsContext = createContext();

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

const ProjectsProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);

  const [mergedProjects, setMergedProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjectsData = async () => {
    try {
      const [myProjectsResponse, coreProjectsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/myproject`, {
          headers: { Authorization: `Bearer ${user.authToken}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/coreproject`, {
          headers: { Authorization: `Bearer ${user.authToken}` }
        }),
      ]);
      const merged = mergeProjects(coreProjectsResponse?.data, myProjectsResponse?.data, user?.projects_users);
      setMergedProjects(merged);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user)
      fetchProjectsData();
  }, [setUser, user]);

  return (
    <ProjectsContext.Provider value={{ mergedProjects, loading }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
