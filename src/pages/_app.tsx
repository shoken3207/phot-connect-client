import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarInfoProvider } from '../provider/SnackbarInfoProvider';
import { SnackbarShowFlgProvider } from '../provider/SnackbarShowFlgProvider';
import { IsLoadingFlgProvider } from '../provider/IsLoadingFlgProvider';
import { PageHistoryDataProvider } from '../provider/PageHistoryData';
import { PanelValueProvider } from '../provider/PanelValue';
import { UserDataProvider } from '../provider/UserDataProvider';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { auth } from '../firebase/main';
import Layout from '../layout/Layout';
import { SocketProvider } from '../provider/SocketProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  return (
    <SocketProvider>
      <SnackbarShowFlgProvider>
        <IsLoadingFlgProvider>
          <PageHistoryDataProvider>
            <PanelValueProvider>
              <UserDataProvider>
                <SnackbarInfoProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarInfoProvider>
              </UserDataProvider>
            </PanelValueProvider>
          </PageHistoryDataProvider>
        </IsLoadingFlgProvider>
      </SnackbarShowFlgProvider>
    </SocketProvider>
  );
}

export default MyApp;
