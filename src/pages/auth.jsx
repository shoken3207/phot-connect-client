import styles from '../styles/Home.module.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/main';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../provider/UserDataProvider';
import useUserFunc from '../hooks/useUserFunc';
import EmailIcon from '@mui/icons-material/Email';
import Head from 'next/head';

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
        <Head>
          <title>auth</title>
        </Head>
        <SBox>
          <SLogo>
            <img src='/images/logo2.png' alt='' />
          </SLogo>
          <SDesc>
            <h2>撮影を通じて繋がろう</h2>
            <p>
              <span>
                このアプリでは、自分の興味のある撮影プランに参加することが出来ます。
              </span>

              <span>
                趣味仲間を見つけ、撮影趣味をより、充実させましょう！！
              </span>
            </p>
          </SDesc>
          <SButtonGroup>
            <SGoogleButton onClick={() => signInWithGoogle()}>
              <img src='/images/google_button.png' alt='' />
            </SGoogleButton>
            <SLoginButton onClick={() => router.push('/SignIn')}>
              <div>
                <EmailIcon sx={{ color: '#00c6b8' }} />
              </div>
              <span>Sign in with Email</span>
            </SLoginButton>
          </SButtonGroup>
        </SBox>
      </SContainer>
    </div>
  );
};

export default Home;

const SContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: repeat;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SBox = styled.div`
  width: 85%;
  max-width: 800px;
  padding: 1.4rem 1.5rem;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  row-gap: 0.6rem;
`;

const SDesc = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.6rem;

  > h2 {
    color: #6a3d00;
    font-size: 1.5rem;
    font-weight: 550;
    text-align: center;
  }

  > p {
    display: flex;
    flex-direction: column;
    row-gap: 0.7rem;
    font-size: 1rem;
    text-align: center;
    color: #8c98aa;
  }
`;

const SButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  align-items: center;
  margin-top: 1.4rem;
`;

const SLoginButton = styled.div`
  width: 70%;
  max-width: 240px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 0.6rem;
  padding: 0.15rem;
  background-color: #00c6b8;
  box-shadow: 4px 4px 14px -6px #777777;
  font-size: 0.9rem;
  transition: all 0.3s;
  &:hover {
    opacity: 0.7;
  }
  > div {
    width: 20%;
    aspect-ratio: 1 / 1;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > span {
    font-weight: bold;
    color: white;
  }
`;

const SGoogleButton = styled.div`
  width: 70%;
  max-width: 240px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 0.7;
  }
  > img {
    width: 100%;
    height: 100%;
  }
`;

const SLogo = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  > img {
    width: 40%;
    max-width: 180px;
    aspect-ratio: 1 / 1;
  }
`;
