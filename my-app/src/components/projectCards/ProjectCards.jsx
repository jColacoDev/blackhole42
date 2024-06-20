"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles.scss";

export default function ProjectCards({ user, projects = [], myXp = 0, myRank = 0, setProjects }) {
  const [openRanks, setOpenRanks] = useState({});
  const [projectInputs, setProjectInputs] = useState({});
  const [selectedProjects, setSelectedProjects] = useState({});

  useEffect(() => {
    const initialInputs = {};
    projects.forEach(project => {
      initialInputs[project?.id] = {
        grade: project?.grade || '',
        start_date: project?.start_date ? new Date(project?.start_date).toISOString().substr(0, 10) : '',
        end_date: project?.end_date ? new Date(project?.end_date).toISOString().substr(0, 10) : ''
      };
    });
    setProjectInputs(initialInputs);
  }, [projects]);

  useEffect(() => {
    if (myRank !== undefined) {
      setOpenRanks({ [myRank]: true });
    }
  }, [myRank]);

  const processProjects = () => {
    const projectsByRank = {};
    projects.forEach(project => {
      const { id, rank, group } = project;
      if (!projectsByRank[rank]) {
        projectsByRank[rank] = {
          rank,
          groups: {}
        };
      }
      if (!group || group === 0) {
        if (!projectsByRank[rank].groups[0]) {
          projectsByRank[rank].groups[0] = {
            group: 0,
            projects: []
          };
        }
        projectsByRank[rank].groups[0].projects.push(id);
      } else {
        if (!projectsByRank[rank].groups[group]) {
          projectsByRank[rank].groups[group] = {
            group,
            projects: []
          };
        }
        projectsByRank[rank].groups[group].projects.push(id);
      }
    });
    return projectsByRank;
  };

  const toggleRank = (rank) => {
    setOpenRanks(prevState => ({
      ...prevState,
      [rank]: !prevState[rank]
    }));
  };

  const calculateNextBlackHoleDays = (project) => {

    if (project?.grade && project?.start_date && project?.end_date) {
      const nextBlackHoleDays = (Math.pow((myXp + project?.xp) / 49980, 0.45) - Math.pow(myXp / 49980, 0.45)) * 483;
      return nextBlackHoleDays.toFixed(2);
    }

    return 0;
  };

  const handleInputChange = (projectId, field, value) => {
    setProjectInputs(prevState => ({
      ...prevState,
      [projectId]: {
        ...prevState[projectId],
        [field]: value
      }
    }));
  };

  const handleSave = async (projectId) => {
    const { grade, start_date, end_date } = projectInputs[projectId];

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/myproject/${projectId}`,
        {
          grade,
          start_date,
          end_date,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      );

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project?.id === projectId ? { ...project, grade, start_date, end_date } : project
        )
      );

    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleSelectProject = (group, projectId) => {
    setSelectedProjects(prevState => ({
      ...prevState,
      [group]: projectId,
    }));
  };

  const projectsExistsInGroup = (groupProjects) => {
    const selectedProjects = projects.filter(project => groupProjects?.includes(project.id));
    return selectedProjects || [];
  };

  const projectValidation = (maxGrade, projectUser) => {
    if(projectUser){
      if (projectUser.status == "in_progress")
        return "in_progress";
      if(projectUser?.marked){
        if (projectUser.final_mark == maxGrade)
          return "maxGrade";
        else if (projectUser?.final_mark > 120)
          return "topGrade";
        else if (projectUser?.final_mark > 99)
          return "passed";
        else
          return "failed";
      } else
        return "toDo"
    }
  }

  return (
    <section className="cards_scss">
      {Object.values(processProjects()).map(rankInfo => (
        <div className="rank_section" key={rankInfo.rank}>
          <h2 onClick={() => toggleRank(rankInfo.rank)}>Rank {rankInfo.rank}</h2>
          <div className="projects_section" style={{ display: openRanks[rankInfo.rank] ? 'flex' : 'none' }}>
            {Object.values(rankInfo.groups).map(groupInfo => {
              const { group, projects: projectsIds } = groupInfo;
              console.log(projects)
  
              const renderProjectArticle = (projectId) => {
                const project = projects.find(p => p.id === projectId && p.rank === rankInfo.rank);
                const projectUsers = project ? project?.projects_users : [];
                const projectUser = projectUsers[0];
                const nextBlackHoleDays = calculateNextBlackHoleDays(project);
                const { grade = '', start_date = '', end_date = '' } = projectInputs[projectId] || {};
                return (
                  <article key={projectId} className={ projectValidation(project?.maxGrade, projectUser)}>
                    <figure>
                      <span>{project?.name}</span>
                    </figure>
                    <ul>
                      <li><span>Project XP: </span><span>{project?.xp}</span></li>
                      <li><span>Gained XP: </span><span>{((project?.xp * grade) / 100).toFixed(0)}</span></li>
                      <li><span>Gained BH days: </span><span>{nextBlackHoleDays}</span></li>
                    </ul>

                    {!(projectUser?.final_mark > 99) && <>
                      <ul>
                        <li>
                          <span>Grade</span>
                          <input
                            type="number"
                            value={grade}
                            min="0"
                            max={project?.maxGrade}
                            onChange={(e) => handleInputChange(projectId, 'grade', e.target.value)}
                          />
                        </li>
                        <li>
                          <span>Start Date</span>
                          <input
                            type="date"
                            value={start_date}
                            onChange={(e) => handleInputChange(projectId, 'start_date', e.target.value)}
                          />
                        </li>
                        <li>
                          <span>End Date</span>
                          <input
                            type="date"
                            value={end_date}
                            disabled={!start_date}
                            min={start_date}
                            onChange={(e) => handleInputChange(projectId, 'end_date', e.target.value)}
                          />
                        </li>
                      </ul>
                      <button onClick={() => handleSave(projectId)}>Project Done</button>
                    </>}
                  </article>
                );
              };
  
              if (group === 0) {
                return projectsIds.map(projectId => renderProjectArticle(projectId));
              } else {
                const groupProjects = projectsExistsInGroup(groupInfo.projects);
                const selectedProjectId = selectedProjects[group] || (groupProjects.length > 0 ? groupProjects[0].id : null);
                const selectedProject = groupProjects.find(p => p.id === selectedProjectId);
                const nextBlackHoleDays = calculateNextBlackHoleDays(selectedProject);
                const { grade = '', start_date = '', end_date = '' } = projectInputs[selectedProjectId] || {};
  
                return (
                  <article key={group} className={selectedProject && selectedProject.projects_users.some(user => user.validated) ? 'green' : ''}>
                    <figure>
                      {groupProjects.map(proj => (
                        <span
                          key={proj.id}
                          onClick={() => handleSelectProject(group, proj.id)}
                          style={{ cursor: 'pointer', fontWeight: selectedProjectId === proj.id ? 'bold' : 'normal' }}
                        >
                          {proj.name}
                        </span>
                      ))}
                    </figure>
                    <ul>
                      <li><span>Project XP: </span><span>{selectedProject?.xp}</span></li>
                      <li><span>Gained XP: </span><span>{((selectedProject?.xp * grade) / 100).toFixed(0)}</span></li>
                      <li><span>Gained BH days: </span><span>{nextBlackHoleDays}</span></li>
                    </ul>
                    <ul>
                      <li>
                        <span>Grade</span>
                        <input
                          type="number"
                          value={grade}
                          min="0"
                          max={selectedProject?.maxGrade}
                          onChange={(e) => handleInputChange(selectedProjectId, 'grade', e.target.value)}
                        />
                      </li>
                      <li>
                        <span>Start Date</span>
                        <input
                          type="date"
                          value={start_date}
                          onChange={(e) => handleInputChange(selectedProjectId, 'start_date', e.target.value)}
                        />
                      </li>
                      <li>
                        <span>End Date</span>
                        <input
                          type="date"
                          value={end_date}
                          disabled={!start_date}
                          min={start_date}
                          onChange={(e) => handleInputChange(selectedProjectId, 'end_date', e.target.value)}
                        />
                      </li>
                    </ul>
                    <button onClick={() => handleSave(selectedProjectId)}>Project Done</button>
                  </article>
                );
              }
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
