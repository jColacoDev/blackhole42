import React, { useEffect } from 'react'
import { main_header } from './styles.module.scss';

export default function Header({myRank, myCurrentBlackHole, level, myXp, name}) {
  
  return (
    <header className={main_header}>
      <div>
        <section>
          Level: {level} | {myXp} xp | black hole: {myCurrentBlackHole}
        </section>
        <section>
          <span>Rank {myRank} | {name}</span>
          <figure></figure>
        </section>
      </div>
    </header>
  )
}
