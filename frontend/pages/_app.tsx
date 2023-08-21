import '@/styles/global.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { Context, createContext, useContext, useState } from 'react';

interface IAuthContext {
  authToken: string;
  setAuthToken: (token: string) => void;
}

const AuthContext: Context<IAuthContext> = createContext({authToken: '', setAuthToken: (token)=>{}});

export function useAuth() {
  return useContext(AuthContext);
}

export default function MyApp({ Component, pageProps }: AppProps) {

  const [authToken, setAuthToken] = useState('');

  return (
    <AuthContext.Provider value={{authToken: authToken, setAuthToken}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  );
}
