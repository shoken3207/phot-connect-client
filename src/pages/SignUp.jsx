import { Avatar, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Head from 'next/head';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const router = useRouter();
  const auth = getAuth();
  const handleInput = (e, setFunc) => {
    setFunc(e.target.value);
  };
  const signUp = (e) => {
    e.preventDefault();
    if (email === '' || password === '' || confirmPassword === '') {
      setSnackbarInfo({
        text: '入力されていない箇所があります。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarInfo({
        text: 'パスワードと確認用パスワードが異なります。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        router.push('/SignIn');
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        setSnackbarInfo({ text: errorMessage, severity: 'warning' });
        setSnackbarIsShow(true);
      });
  };
  return (
    <SWrap>
      <Head>
        <title>signUp</title>
      </Head>
      <SBox onSubmit={(e) => signUp(e)}>
        <div>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <h3>Sign Up</h3>
        </div>
        <div>
          <TextField
            onChange={(e) => handleInput(e, setEmail)}
            fullWidth
            variant='standard'
            label='Email'
            autoComplete='email'
            autoFocus
            required
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                signUp(event);
              }
            }}
          />
          <TextField
            onChange={(e) => handleInput(e, setPassword)}
            fullWidth
            variant='standard'
            label='Password'
            autoComplete='password'
            type='password'
            required
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                signUp(event);
              }
            }}
          />
          <TextField
            onChange={(e) => handleInput(e, setConfirmPassword)}
            fullWidth
            variant='standard'
            label='ConfirmPassword'
            autoComplete='password'
            type='password'
            required
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                signUp(event);
              }
            }}
          />
        </div>
        <SButtonGroup>
          <Button
            onClick={(e) => router.push('/SignIn')}
            variant='contained'
            color='secondary'
          >
            Sign In
          </Button>
          <Button
            onClick={(e) => signUp(e)}
            variant='contained'
            color='success'
          >
            Sign Up
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

export default SignUp;
