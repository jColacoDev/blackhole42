"use client"
import styles from "./styles.module.scss";
import React from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav_scss}>
      <div className={styles.sticky}>
      <Link className={styles.logo} href="/">
          <Image className={`${pathname === '/' ? styles.highlight : ''}`}
            src="/images/logo/42.png"
            alt="42"
            width={44}
            height={32}
          />
        </Link>
        <ul>
          <li><Link href="/profile">
          <Image className={`${pathname === '/profile' ? styles.highlight : ''}`}
                src="/images/logo/profile.png"
                alt="42 profile"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/blackhole">
            <Image className={`${pathname === '/blackhole' ? styles.highlight : ''}`}
                src="/images/logo/blackhole.png"
                alt="42 blackhole"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/projects">
            <Image className={`${pathname === '/projects' ? styles.highlight : ''}`}
                src="/images/logo/projects.png"
                alt="42 projects"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/message">
            <Image className={`${pathname === '/message' ? styles.highlight : ''}`}
                src="/images/logo/message.png"
                alt="42 message"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/case">
            <Image className={`${pathname === '/case' ? styles.highlight : ''}`}
                src="/images/logo/case.png"
                alt="42 case"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/compass">
            <Image className={`${pathname === '/compass' ? styles.highlight : ''}`}
                src="/images/logo/compass.png"
                alt="42 compass"
                width={35}
                height={30}
              />
            </Link></li>
            <li><Link href="/cart">
            <Image className={`${pathname === '/cart' ? styles.highlight : ''}`}
                src="/images/logo/cart.png"
                alt="42 cart"
                width={35}
                height={30}
              />
            </Link></li>
        </ul>
      </div>

    </nav>
  )
}
