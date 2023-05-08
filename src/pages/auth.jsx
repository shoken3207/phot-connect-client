import styles from '../styles/Home.module.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/main';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../provider/UserDataProvider';
import useUserFunc from '../hooks/useUserFunc';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';

const Home = () => {
  const { setUserData } = useUserData();
  const [user] = useAuthState(auth);
  const { registerUserFunc } = useUserFunc();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((err) => console.log('err: ', err));
  };

  const router = useRouter();

  useEffect(() => {
    if (user) {
      login();
    }
  }, [user]);

  const login = async () => {
    const { displayName, photoURL, email } = user;
    const registerOption = {
      username: displayName,
      icon_image: photoURL,
      email: email,
    };
    const response = await registerUserFunc(registerOption);
    sessionStorage.setItem('user', JSON.stringify(response.user));
    setUserData(response.user);
    if (response.registered) {
      router.push('/Home');
    } else {
      router.push({ pathname: '/EditProfile', query: { first: true } });
    }
  };

  return (
    <div className={styles.container}>
      <SContainer>
        <SLoginButtonGroup>
          <Button
            style={{ textTransform: 'none' }}
            variant='contained'
            color='success'
            onClick={() => signInWithGoogle()}
            startIcon={<GoogleIcon fontSize='large' />}
            fullWidth
          >
            Sign in with Google
          </Button>
          <Button
            style={{ textTransform: 'none' }}
            variant='contained'
            color='secondary'
            startIcon={<EmailIcon fontSize='large' />}
            onClick={() => router.push('/SignUp')}
            fullWidth
          >
            Sign up with Email
          </Button>
          <Button
            style={{ textTransform: 'none' }}
            variant='contained'
            color='primary'
            startIcon={<EmailIcon fontSize='large' />}
            onClick={() => router.push('/SignIn')}
            fullWidth
          >
            Sign in with Email
          </Button>
        </SLoginButtonGroup>
      </SContainer>
    </div>
  );
};

export default Home;

const SContainer = styled.div`
  width: 100%;
  height: calc(100vh - 90px);
  background-image: linear-gradient(
    90deg,
    rgba(226, 207, 255, 1),
    rgba(251, 253, 191, 1)
  );
  position: relative;

  div {
    position: absolute;
    top: 4rem;
    right: 1.5rem;
  }
`;

const SLoginButtonGroup = styled.div`
  width: 80%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;
