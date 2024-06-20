import React, { useEffect } from 'react'
import './styles.scss';

export default function Header({
  rank, 
  myCurrentBlackHole,
  level,
  xp,
  name
}) {
  
  return (
    <header className="main_header">
      <div>
        <section>
          {level && <span>Level:{level}&nbsp;|</span>}
          {xp && <span>Xp:{xp}&nbsp;|</span>}
          {myCurrentBlackHole && <span>blackhole:{myCurrentBlackHole}&nbsp;|</span>}
        </section>
        <section>
          {rank && <span>rank:{rank}&nbsp;|</span>}
          {name && <span>{name}</span>}
          <figure></figure>
        </section>
      </div>
    </header>
  )
}
