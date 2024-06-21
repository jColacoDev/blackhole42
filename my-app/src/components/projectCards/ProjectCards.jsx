"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles.scss";
import { daysBetweenDates, formatToYYYYMMDD } from '../../utils/utils';

export default function ProjectCards({ user, projects = [], setProjects, xp = 0, rank = 0 }) {
  const [processedProjects, setProcessedProjects] = useState([]);
  const [openRanks, setOpenRanks] = useState({});
  const [projectInputs, setProjectInputs] = useState({});
  const [selectedProjects, setSelectedProjects] = useState({});

  useEffect(() => {
    if(projects){
      const initialInputs = {};
      projects?.forEach(project => {
        initialInputs[project?.id] = {
          grade: project?.grade || '',
          end_date: project?.end_date ? new Date(project?.end_date).toISOString().slice(0, 10) : ''
        };
      });
      setProjectInputs(initialInputs);
      setProcessedProjects(processProjectsByRank());
    }

  }, [projects]);

  useEffect(() => {
    if (rank !== undefined) {
      setOpenRanks({ [rank]: true });
    }
  }, [rank]);

  const processProjectsByRank = () => {
    const projectsByRank = {};
  
    projects?.forEach(project => {
      const { id, rank, group } = project;
  
      if (!projectsByRank[rank]) {
        projectsByRank[rank] = {
          rank,
          groups: {},
          totalOccurrences: 0,
          created_at: null,
          marked_at: null,
          status: "unseen"
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
    let allProjectsFinished = true;
    projects?.forEach(project => {
      const { rank, projects_users } = project;
      const totalOccurrences = projects_users.reduce((acc, userProject) => acc + (userProject.occurrence || 0), 0);
      projectsByRank[rank].totalOccurrences += totalOccurrences;
  
      projects_users.forEach(userProject => {
        const { created_at, marked_at, final_mark } = userProject;
  
        // Update created_at
        if (!projectsByRank[rank].created_at || new Date(created_at) < new Date(projectsByRank[rank].created_at)) {
          projectsByRank[rank].created_at = created_at;
        }
  
        // Update marked_at
        if (!projectsByRank[rank].marked_at || new Date(marked_at) > new Date(projectsByRank[rank].marked_at)) {
          projectsByRank[rank].marked_at = marked_at;
        }
        // Determine if this project is finished
        if (!final_mark || final_mark <= 99) {
          allProjectsFinished = false;
        }
      });
      // Set status based on the analysis
      if (allProjectsFinished && projects_users.length > 0) {
        projectsByRank[rank].status = "finished";
      } else if (projects_users.length > 0 && projectsByRank[rank].status !== "finished") {
        projectsByRank[rank].status = "ongoing";
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
    if (project?.grade && project?.end_date) {
      const nextBlackHoleDays = (Math.pow((xp + project?.xp) / 49980, 0.45) - Math.pow(xp / 49980, 0.45)) * 483;
      return nextBlackHoleDays.toFixed(2);
    }
//here
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
    const { grade, end_date } = projectInputs[projectId];

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_NODE_SERVER}/api/project/myproject/${projectId}`,
        {
          grade,
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
          project?.id === projectId ? { ...project, grade, end_date } : project
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
      {Object.values(processedProjects).map(rankInfo => (
        <div className={`rank_section ${rankInfo.status}`} key={rankInfo.rank}>
          <h2 onClick={() => toggleRank(rankInfo?.rank)}>Rank {rankInfo?.rank} <br/>
            {rankInfo?.totalOccurrences > 0 && <>
              {rankInfo?.totalOccurrences && <span>with&nbsp;{rankInfo.totalOccurrences} {rankInfo.totalOccurrences > 1 ? "tries" : "try"}</span>}
              {rankInfo?.created_at && <span>&nbsp;from&nbsp;{formatToYYYYMMDD(rankInfo.created_at, { year: false, separator: '/'})}</span>}
              {rankInfo?.marked_at && <span>&nbsp;to&nbsp;{formatToYYYYMMDD(rankInfo.marked_at, { year: false, separator: '/'})}</span>}
              {rankInfo?.marked_at && rankInfo?.marked_at && <span>&nbsp; it's {daysBetweenDates(rankInfo.created_at, rankInfo.marked_at)} days</span>}
            </>}
          </h2>
          <div className="projects_section" style={{ display: openRanks[rankInfo.rank] ? 'flex' : 'none' }}>
            {Object.values(rankInfo.groups).map(groupInfo => {
              const { group, projects: projectsIds } = groupInfo;
              const renderProjectArticle = (projectId) => {
                const project = projects.find(p => p.id === projectId && p.rank === rankInfo.rank);
                const projectUsers = project ? project?.projects_users : [];
                const projectUser = projectUsers[0];
                const nextBlackHoleDays = calculateNextBlackHoleDays(project);
                const { grade = '', end_date = '' } = projectInputs[projectId] || {};
                return (
                  <article key={projectId} className={ projectValidation(project?.maxGrade, projectUser)}>
                    <header>
                      <span>{project?.name}</span>
                    </header>
                    <ul>
                      <li><span>Retries: </span><span>{projectUser?.occurrence ? projectUser?.occurrence : 0}</span></li>
                      <li><span>Project XP: </span><span>{project?.xp}</span></li>
                      <li><span>Grade: </span><span>{projectUser?.final_mark ? projectUser?.final_mark : 0}</span></li>
                      <li><span>Gained XP: </span><span>{((project?.xp * grade) / 100).toFixed(0)}</span></li>
                      <li><span>Gained BH days: </span><span>{nextBlackHoleDays}</span></li>
                    </ul>

                    {!(projectUser?.final_mark > 99) && <>
                      <ul>
                        <li>
                          <span>Expected Grade</span>
                          <input
                            type="number"
                            value={grade}
                            min="0"
                            max={project?.maxGrade}
                            onChange={(e) => handleInputChange(projectId, 'grade', e.target.value)}
                          />
                        </li>
                        <li>
                          <span>End Date</span>
                          <input
                            type="date"
                            value={end_date}
                            // disabled={false}
                            // min={other_date}
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
                const { grade = '', end_date = '' } = projectInputs[selectedProjectId] || {};
  
                return (
                  <article key={group} className={selectedProject && selectedProject.projects_users.some(user => user.validated) ? 'green' : ''}>
                    <header>
                      {groupProjects.map(proj => (
                        <span
                          key={proj.id}
                          onClick={() => handleSelectProject(group, proj.id)}
                          style={{ cursor: 'pointer', fontWeight: selectedProjectId === proj.id ? 'bold' : 'normal' }}
                        >
                          {proj.name}
                        </span>
                      ))}
                    </header>
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
                        <span>End Date</span>
                        <input
                          type="date"
                          value={end_date}
                          // disabled={!}
                          // min={}
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
