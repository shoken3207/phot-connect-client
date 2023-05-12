import { Avatar, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { useUserData } from '../provider/UserDataProvider';
import useUserFunc from '../hooks/useUserFunc';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Head from 'next/head';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useUserData();
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const { registerUserFunc } = useUserFunc();
  const router = useRouter();
  const auth = getAuth();
  const handleInput = (e, setFunc) => {
    setFunc(e.target.value);
  };
  const signIn = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setSnackbarInfo({
        text: '入力されていない箇所があります。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const response = await registerUserFunc({ email: user.email });

        sessionStorage.setItem('user', JSON.stringify(response.user));
        setUserData(response.user);
        if (response.registered) {
          router.push('/Home');
        } else {
          router.push({ pathname: '/EditProfile', query: { first: true } });
        }
      })
      .catch((err) => {
        const errorMessage = err.message;
        setSnackbarInfo({ text: errorMessage, severity: 'warning' });
        setSnackbarIsShow(true);
      });
  };
  return (
    <SWrap>
      <Head>
        <title>signIn</title>
      </Head>
      <SBox onSubmit={(e) => signIn(e)}>
        <div>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOpenIcon />
          </Avatar>
          <h3>Sign In</h3>
        </div>
        <div>
          <TextField
            onChange={(e) => handleInput(e, setEmail)}
            fullWidth
            variant='standard'
            label='Email'
            required
            autoFocus
            autoComplete='email'
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                signIn(event);
              }
            }}
          />
          <TextField
            onChange={(e) => handleInput(e, setPassword)}
            fullWidth
            variant='standard'
            label='Password'
            required
            autoComplete='password'
            type='password'
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                signIn(event);
              }
            }}
          />
        </div>
        <SButtonGroup>
          <Button
            onClick={() => router.push('/SignUp')}
            variant='contained'
            color='secondary'
          >
            Sign Up
          </Button>
          <Button
            onClick={(e) => signIn(e)}
            variant='contained'
            color='success'
          >
            Sign In
          </Button>
        </SButtonGroup>
      </SBox>
    </SWrap>
  );
};

const SWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SBox = styled.form`
  max-width: 460px;
  width: 90%;
  padding: 1.8rem 2rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  background-color: white;
  box-shadow: 8px 8px 19px -6px #777777;
  border-radius: 10px;

  > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
      flex-direction: column;
      row-gap: 0.2rem;

      > h3 {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 450;
      }
    }
    &:nth-of-type(2) {
      display: flex;
      flex-direction: column;
      row-gap: 0.7rem;
    }
  }
`;

const SButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 1.5rem;
  align-items: center;
`;

export default SignIn;
