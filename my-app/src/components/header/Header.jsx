import React, { useEffect } from 'react'
import './styles.scss';
import { daysBetweenDates } from '@/utils/utils';

export default function Header({
  rank, 
  currentBlackHole,
  level,
  xp,
  name
}) {
  return (
    <header className="main_header">
      <div>
        <section>
          {level ? <span>Level:{level}&nbsp;|</span>: ""}
          {xp ? <span>Xp:{xp}&nbsp;|</span> : ""}
          {currentBlackHole ? <span>blackhole:{currentBlackHole}, {daysBetweenDates(currentBlackHole)} days left&nbsp;|</span> : ""}
        </section>
        <section>
          {rank ? <span>rank:{rank}&nbsp;|</span> : ""}
          {name ? <span>{name}</span> : ""}
          <figure></figure>
        </section>
      </div>
    </header>
  )
}
