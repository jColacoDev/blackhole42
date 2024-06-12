"use client"

import TopBanner from "@/components/topBanner/TopBanner";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import ProjectCards from "@/components/projectCards/ProjectCards";

export default function Home() {

  const [level, setLevel] = useState(3);
  const [levelPercentage, setLevelPercentage] = useState(84);
  const [projectXP, setProjectXP] = useState(3000);
  const [currentXP, setCurrentXP] = useState(10834);
  const [bh, setBH] = useState(0);


  useEffect(()=>{
    setBH((Math.pow((currentXP + projectXP)/49980, 0.45)-Math.pow(currentXP/49980, 0.45))*483);
  }, [currentXP, projectXP])

  return (
    <section className={styles.Home}>
      <TopBanner />
      <ProjectCards />

      BlackHole: {bh.toFixed(2)}d
    </section>
  );
}
