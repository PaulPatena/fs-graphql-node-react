// pages/404.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/pages/_app';

export default function Custom404() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.authToken.length > 0) {
      router.push('/events');
    } else {
      router.push('/login');
    }
  }, []);

  return null; // The component doesn't need to render anything
}