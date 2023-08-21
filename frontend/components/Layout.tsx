import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React, { useMemo } from 'react';
import styles from './Layout.module.css';
import Cx from 'classnames';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/pages/_app';
import { useRouter } from 'next/router';

type Props = {
  children: JSX.Element
}

const paths = [
  // {url: '/', name: 'Home'},
  {url: '/events', name: 'Events'},
  {url: '/bookings', name: 'Bookings'},
  {url: '/login', name: 'Login'},
]

const Layout: React.FC<Props> = ({ children }) => {

  const pathName = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const pathsToRender = useMemo(()=> {
    return paths.filter(p => auth.authToken.length > 0 ? p.name !== 'Login' : p.name === 'Login')
  }, [auth.authToken])

  return (
    <div className={styles.container}>
      <Head>
        <title>Events</title>
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <nav className={styles.nav}>
        {pathsToRender.map((path: {url: string, name: string}) => {
          return (
            <Link key={path.url} href={path.url} className={styles.navItemMR}>
              <button className={Cx(styles.navButton, {[styles.navButtonActive]: pathName === path.url})}>
                {path.name}
              </button>
            </Link>
          )
        })}
        <div className="horizontalSpacer"/>
        {auth.authToken.length > 0 &&
          <button onClick={(e)=> {
            e.preventDefault();
            auth.setAuthToken('');
            router.push('/login')
          }}>
            Logout
          </button>
        }
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
          ©2023 Paul Patena
          {/*<span className={styles.logo}>*/}
          {/*    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>*/}
          {/*  </span>*/}
        </a>
      </footer>
    </div>
  );
};

export default Layout;