import { useAuth } from '@/pages/_app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Events() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.authToken.length === 0) {
      router.push('/login');
    }
  }, []);

  return <>
    <h1>Events</h1>
  </>
}