import React from 'react';
import './style.scss';

export default function TopBanner({kickoff_date, weekly_days, daily_hours}) {
  const data = {
    aBH: "25/10/2024",
    blackhole_total: 670
  };

  return (
    <section className="topBanner_scss">
      <article>
        <ul>
          {kickoff_date && <li><span>Kickoff Date:</span> <span>{kickoff_date}</span></li>}
          {weekly_days && <li><span>Weekly Days:</span> <span>{weekly_days}d</span></li>}
          {daily_hours && <li><span>Daily Hours:</span> <span>{daily_hours}h</span></li>}
        </ul>
      </article>
      <article>
        <ul>
          {kickoff_date && <li><span>BlackHole Total:</span> <span>{data.blackhole_total}d</span></li>}
          {kickoff_date && <li><span>BlackHole Received:</span> <span>77d</span></li>}
          {kickoff_date && <li><span>BlackHole Remaining:</span> <span>583d</span></li>}
        </ul>
      </article>
    </section>
  );
}
