import React from 'react'
import { cards_scss, coolText } from './styles.module.scss';
import { projects } from '@/db';

export default function ProjectCards() {
  
  
    return (
    <section className={cards_scss}>

        {projects.map((project)=>
            <article>
                <figure>
                    <span>
                        {project.name}
                    </span>
                </figure>

                <ul>
                    <li><span>Project XP: </span> <span>{project.xp}</span></li>
                    <li><span>Intra expected time: </span> <span>79</span></li>
                    <li><span>Personal expected time: </span> <span>79</span></li>
                    <li><span>Working Days: </span> <span>79</span></li>
                    <li><span>Starting Date: </span> <span>79</span></li>
                    <li><span>Expected Finish Date: </span> <span>79</span></li>
                    <li><span>Real Finish Date: </span> <span>79</span></li>
                    <li><span>Months: </span> <span>79</span></li>
                    <li><span>Gained BH days: </span> <span>79</span></li>
                    <li><span>New BHa date: </span> <span>79</span></li>
                </ul>
            </article>      
        )}
    </section>
  )
}
