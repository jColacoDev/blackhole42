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
            src="/images/logo/42_logo.png"
            alt="42"
            width={60}
            height={50}
          />
        </Link>
        <ul>
          <li><Link href="/profile">
          <Image className={`${pathname === '/profile' ? styles.highlight : ''}`}
                src="/images/logo/profile_logo.png"
                alt="42 profile"
                width={50}
                height={40}
              />
            </Link></li>
            <li><Link href="/blackhole">
            <Image className={`${pathname === '/blackhole' ? styles.highlight : ''}`}
                src="/images/logo/bh_logo.png"
                alt="42 blackhole"
                width={50}
                height={40}
              />
            </Link></li>
        </ul>
      </div>

    </nav>
  )
}
