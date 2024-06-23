"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const ProjectsContext = createContext();

function addTotalOccurrences(merged) {
  return merged.map(project => {
      const totalOccurrences = project.projects_users.reduce((acc, userProject) => acc + (userProject.occurrence || 0), 0);
      return { ...project, totalOccurrences };
  });
}

const ProjectsProvider = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [coreProjects, setCoreProjects] = useState(null);
  const [myProjects, setMyProjects] = useState(null);
  const [mergedProjects, setMergedProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  const mergeProjects = (coreProjects, myProjects, projectsUsers) => {
    const projectMap = new Map();
    const projectsUsersMap = new Map();
  
    // Filter myProjects to include only those with ids present in coreProjects
    const filteredCoreProjects = coreProjects?.filter(coreProject =>
      myProjects?.some(myProject => myProject.id === coreProject.id)
    );
  
    // Create a map of project users
    projectsUsers?.forEach(user => {
      if (!projectsUsersMap.has(user.project.id)) {
        projectsUsersMap.set(user.project.id, []);
      }
      projectsUsersMap.get(user.project.id).push(user);
    });
  
    // Create a map of core projects
    filteredCoreProjects?.forEach(project => {
      projectMap.set(project.id, { ...project });
    });
  
    // Merge the filtered my projects with core projects
    myProjects?.forEach(project => {
      if (projectMap.has(project.id)) {
        projectMap.set(project.id, { ...projectMap.get(project.id), ...project });
      } else {
        projectMap.set(project.id, { ...project });
      }
    });
  
    // Create the merged projects array
    const mergedProjects = Array.from(projectMap.values()).map(project => {
      const projectUsers = projectsUsersMap.get(project.id) || [];
      const grade = projectUsers.some(user => user.final_mark > 99) ? 
                    Math.max(...projectUsers.map(user => user.final_mark).filter(mark => mark > 99)) : 
                    undefined;
  
      return {
        ...project,
        projects_users: projectUsers,
        grade
      };
    });
  
    console.log(mergedProjects);
  
    return mergedProjects;
  };
  

  const fetchAndUpdateProjects = async () => {
    let authToken = user?.authToken;
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/42project?cursus_id=${user?.cursus_id}&update=true`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.log('Failed to fetch and update projects', error);
    } finally {
      // setLoading(false);
    }
  };

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
      // let merged = mergeProjects(coreProjectsResponse?.data, myProjectsResponse?.data, user?.projects_users);
      // merged = addTotalOccurrences(merged);

      setCoreProjects(coreProjectsResponse?.data);
      setMyProjects(myProjectsResponse?.data);
  
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user)
      // fetchAndUpdateProjects();
      fetchProjectsData();
  }, [setUser, user]);

  useEffect(() => {
    let merged = mergeProjects(coreProjects, myProjects, user?.projects_users);
      merged = addTotalOccurrences(merged);
      setMergedProjects(merged);
      
  }, [myProjects, coreProjects, user?.projects_users]);

  return (
    <ProjectsContext.Provider value={{ mergedProjects, coreProjects, myProjects, loading, setMyProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
