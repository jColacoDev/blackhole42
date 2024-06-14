import React, { useEffect } from 'react'
import { main_header } from './styles.module.scss';

export default function header({myCurrentBlackHole, myLevel, myLevelPercentage, myXp}) {
  
  return (
    <header className={main_header}>
      <div>
        <section>
          Level: {myLevel}.{myLevelPercentage} | {myXp} xp | black hole: {myCurrentBlackHole}
        </section>
        <section>
          <span>xpto-alu</span>
          <figure></figure>
        </section>
      </div>
    </header>
  )
}
