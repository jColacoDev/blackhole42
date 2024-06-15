import React, { useEffect } from 'react'
import { main_header } from './styles.module.scss';

export default function Header({myCurrentBlackHole, level, level_percentage, myXp, name}) {
  
  return (
    <header className={main_header}>
      <div>
        <section>
          Level: {level}.{level_percentage} | {myXp} xp | black hole: {myCurrentBlackHole}
        </section>
        <section>
          <span>{name}</span>
          <figure></figure>
        </section>
      </div>
    </header>
  )
}
