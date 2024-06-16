import React, { useState, useEffect } from 'react';
import { cards_scss, rank_section, projects_section } from './styles.module.scss';

export default function ProjectCards({ projects, myXp, myRank }) {
    
    const [openRanks, setOpenRanks] = useState({});

    useEffect(() => {
    if (myRank !== undefined) {
        setOpenRanks({ [myRank]: true });
    }
    }, [myRank]);

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

  return (
    <section className={cards_scss}>
      {Object.keys(projectsByRank).map(rank => (
        <div className={rank_section} key={rank}>
          <h2 onClick={() => toggleRank(rank)}>Rank {rank}</h2>
          <div className={projects_section} style={{ display: openRanks[rank] ? 'flex' : 'none' }}>
            {projectsByRank[rank].map(project => {
              const nextBlackHoleDays = calculateNextBlackHoleDays(project.xp);
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
                    <p>Grade</p>
                  <div>
                      <input />
                    <button>set Score</button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
