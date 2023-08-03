import '@/styles/global.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { Context, createContext, useState } from 'react';

interface IAuthContext {
  token: string;
  onTokenReceived: (token: string) => void;
}

export const AuthContext: Context<IAuthContext> = createContext({token: '', onTokenReceived: (token)=>{}});

export default function MyApp({ Component, pageProps }: AppProps) {

  const [authToken, setAuthToken] = useState('');
  const tokenReceivedHandler = (token: string) => {
    setAuthToken(token);
  }

  return (
    <AuthContext.Provider value={{token: authToken, onTokenReceived: tokenReceivedHandler}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  );
}
