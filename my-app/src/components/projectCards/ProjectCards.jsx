import React, { useState, useEffect } from 'react';
import { cards_scss, rank_section, projects_section } from './styles.module.scss';
import axios from 'axios';

export default function ProjectCards({ user, projects = [], myXp = 0, myRank = 0 }) {
    
    const [openRanks, setOpenRanks] = useState({});
    const [projectInputs, setProjectInputs] = useState({});
    const [initialized, setInitialized] = useState(false); // Track initialization

    useEffect(() => {
        if (myRank !== undefined) {
            setOpenRanks({ [myRank]: true });
        }
    }, [myRank]);

    useEffect(() => {
        const initialInputs = {};
        projects.forEach(project => {
            initialInputs[project.id] = {
                grade: project.grade || '',
                start_date: project.start_date ? new Date(project.start_date).toISOString().substr(0, 10) : '',
                end_date: project.end_date ? new Date(project.end_date).toISOString().substr(0, 10) : ''
            };
        });
        setProjectInputs(initialInputs);
        setInitialized(true); // Mark initialization as complete
    }, [projects]);

    const projectsByRank = projects.reduce((acc, project) => {
        const { rank } = project;
        if (!acc[rank]) acc[rank] = [];
        acc[rank].push(project);
        return acc;
    }, {});

    const toggleRank = (rank) => {
        setOpenRanks(prevState => ({
            ...prevState,
            [rank]: !prevState[rank]
        }));
    };

    const calculateNextBlackHoleDays = (projectXP) => {
        return (Math.pow((myXp + projectXP) / 49980, 0.45) - Math.pow(myXp / 49980, 0.45)) * 483;
    };

    const handleInputChange = (projectId, field, value) => {
        setProjectInputs(prevState => {
            const updatedProject = {
                ...prevState[projectId],
                [field]: value
            };

            if (field === 'start_date' && value) {
                if (updatedProject.end_date && new Date(value) > new Date(updatedProject.end_date)) {
                    updatedProject.end_date = '';
                }
            }

            return {
                ...prevState,
                [projectId]: updatedProject
            };
        });
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
    
            console.log('Project updated:', response.data);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <section className={cards_scss}>
            {projectsByRank && Object.keys(projectsByRank).map(rank => (
                <div className={rank_section} key={rank}>
                    <h2 onClick={() => toggleRank(rank)}>Rank {rank}</h2>
                    <div className={projects_section} style={{ display: openRanks[rank] ? 'flex' : 'none' }}>
                        {projectsByRank[rank].map(project => {
                            const nextBlackHoleDays = calculateNextBlackHoleDays(project.xp);
                            const { grade = '', start_date = '', end_date = '' } = projectInputs[project.id] || {};
                            return (
                                <article key={project.id}>
                                    <figure>
                                        <span>{project.name}</span>
                                    </figure>
                                    <ul>
                                        <li><span>Project XP: </span> <span>{project.xp}</span></li>
                                        <li><span>Gained BH days: </span> <span>{nextBlackHoleDays.toFixed(2)}</span></li>
                                        <li><span>Project XP: </span> <span>{project.xp}</span></li>
                                    </ul>
                                    <ul>
                                        <li>
                                            <span>Grade</span>
                                            <input
                                                type="number"
                                                value={grade}
                                                min="0"
                                                max={project.maxGrade}
                                                onChange={(e) => handleInputChange(project.id, 'grade', Math.min(Math.max(e.target.value, 0), project.maxGrade))}
                                            />
                                        </li>
                                        <li>
                                            <span>Start Date</span>
                                            <input
                                                type="date"
                                                value={start_date}
                                                onChange={(e) => handleInputChange(project.id, 'start_date', e.target.value)}
                                            />
                                        </li>
                                        <li>
                                            <span>End Date</span>
                                            <input
                                                type="date"
                                                value={end_date}
                                                disabled={!start_date}
                                                min={start_date}
                                                onChange={(e) => handleInputChange(project.id, 'end_date', e.target.value)}
                                            />
                                        </li>
                                    </ul>
                                    <button onClick={() => handleSave(project.id)}>Set Score</button>
                                </article>
                            );
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
}
