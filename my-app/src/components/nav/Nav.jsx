import React from 'react'
import { nav_scss, sticky } from './styles.module.scss';

export default function nav() {
  return (
    <nav className={nav_scss}>
      <div className={sticky}>
        <figure>
          logo
        </figure>
        <ul>
          <li>uno</li>
          <li>dos</li>
          <li>tres</li>
        </ul>
      </div>

    </nav>
  )
}
