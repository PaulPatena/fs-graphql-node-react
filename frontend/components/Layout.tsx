import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from './Layout.module.css';
import Cx from 'classnames';
import { usePathname } from 'next/navigation';

type Props = {
  children: JSX.Element
}

const Layout: React.FC<Props> = ({ children }) => {

  const pathName = usePathname();
  const paths = [
    {url: '/', name: 'Home'},
    {url: '/events', name: 'Events'},
    {url: '/bookings', name: 'Bookings'},
    {url: '/login', name: 'Login'},
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>Events</title>
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <nav className={styles.nav}>
        {paths.map(path => {
          return (
            <Link key={path.url} href={path.url} className={styles.navItemMR}>
              <button className={Cx(styles.navButton, {[styles.navButtonActive]: pathName === path.url})}>
                {path.name}
              </button>
            </Link>
          )
        })}
      </nav>

      <main>
        {children}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
            </span>
        </a>
      </footer>
    </div>
  );
};

export default Layout;