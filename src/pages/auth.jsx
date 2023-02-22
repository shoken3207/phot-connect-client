import styles from '../styles/Home.module.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/main';
import { useAuthState } from 'react-firebase-hooks/auth';
import CommonButton from '../components/CommonButton';
import SelectImage from '../components/SelectImage';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../provider/UserDataProvider';
import axios from 'axios';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SContainer = styled.div`
  width: 100%;
  height: 100vh;

  div {
    width: 80%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Home = () => {
  const { userData, setUserData } = useUserData();
  const [user, loading] = useAuthState(auth);
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
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
      iconImage: photoURL,
      email: email,
    };
    const response = await axios.post(
      `http://localhost:5000/api/user/register`,
      registerOption
    );
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    setUserData(response.data.user);
    console.log('response', response);
    if (response.data.registered) {
      router.push('/Home');
    } else {
      router.push('/EditProfile', { first: true });
    }
  };

  return (
    <div className={styles.container}>
      <>
        {loading ? (
          <SContainer>Loading・・・</SContainer>
        ) : (
          <>
            <SContainer id='container'>
              <div>
                <h1 id='text'>ページ1</h1>
              </div>
            </SContainer>
            <CommonButton
              text='Googleでサインイン'
              onClick={() => signInWithGoogle()}
              size='large'
            />
            <CommonButton
              text='サインアウト'
              onClick={() => auth.signOut()}
              variant='outlined'
              color='error'
            />
            <SContainer id='contaner'>
              <div>
                <h1 id='text'>ページ2</h1>
              </div>
            </SContainer>
            <SContainer id='container'>
              <div>
                <h1 id='text'>ページ3</h1>
              </div>
            </SContainer>
            <SContainer id='container'>
              <div>
                <h1 id='text'>ページ4</h1>
              </div>
            </SContainer>
          </>
        )}
      </>
    </div>
  );
};

export default Home;
