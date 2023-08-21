import { useRouter } from 'next/router';
import { useAuth } from '@/pages/_app';
import { useEffect } from 'react';

export default function Bookings() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.authToken.length === 0) {
      router.push('/login');
    }
  }, []);

  return <>
    <h1>Bookings</h1>
  </>
}