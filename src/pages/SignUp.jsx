import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

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
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user: ', user);
        router.push('/SignIn');
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        setSnackbarInfo({ text: errorMessage, severity: 'warning' });
        setSnackbarIsShow(true);
        console.log('errorCode: ', errorCode);
        console.log('errorMessage: ', errorMessage);
      });
  };
  return (
    <SWrap>
      <SBox>
        <h3>Sign Up</h3>
        <p>メールアドレス、パスワード、確認用パスワードを入力してください。</p>
        <div>
          <TextField
            onChange={(e) => handleInput(e, setEmail)}
            fullWidth
            variant='standard'
            label='Email'
            autoComplete='email'
            autoFocus
            required
          />
          <TextField
            onChange={(e) => handleInput(e, setPassword)}
            fullWidth
            variant='standard'
            label='Password'
            autoComplete='password'
            type='password'
            required
          />
          <TextField
            onChange={(e) => handleInput(e, setConfirmPassword)}
            fullWidth
            variant='standard'
            label='ConfirmPassword'
            autoComplete='password'
            type='password'
            required
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

const SBox = styled.div`
  max-width: 560px;
  width: 90%;
  padding: 1.8rem 2rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  background-color: white;
  box-shadow: 8px 8px 19px -6px #777777;
  border-radius: 10px;

  > h3 {
    text-align: center;
    font-size: 1.6rem;
    font-weight: 450;
  }

  > p {
    font-size: 0.9rem;
  }

  > div {
    &:nth-of-type(1) {
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
