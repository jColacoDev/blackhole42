import React from 'react';
import { topBanner_scss } from './styles.module.scss';

export default function TopBanner() {
  const data = {
    kickoff: "09/04/2024",
    iBH: "25/07/2024",
    aBH: "25/10/2024",
    DWH: 4,
    WWD: 5,
    EM: 10
  };

  return (
    <section className={topBanner_scss}>
      <article>
        <ul>
          <li><span>KickOff Date:</span> <span>{data.kickoff}</span></li>
          <li><span>Daily Working Hours:</span> <span>{data.DWH}h</span></li>
          <li><span>Weekly Working Days:</span> <span>{data.WWD}d</span></li>
          <li><span>Weekly Working Hours:</span> <span>{data.DWH * data.WWD}h</span></li>
          <li><span>Error Margin:</span> <span>{data.EM}%</span></li>
        </ul>
      </article>
      <article>
        <ul>
          <li><span>Initial BlackHole:</span> <span>{data.iBH}</span></li>
          <li><span>BlackHole Total:</span> <span>670d</span></li>
          <li><span>BlackHole Received:</span> <span>77d</span></li>
          <li><span>BlackHole Remaining:</span> <span>583d</span></li>
          <li><span>BlackHole absorption:</span> <span>{data.aBH}</span></li>
        </ul>
      </article>
    </section>
  );
}
