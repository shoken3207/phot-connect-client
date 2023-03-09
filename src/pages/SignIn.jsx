import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import axios from 'axios';
import { useUserData } from '../provider/UserDataProvider';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useUserData();
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const router = useRouter();
  const auth = getAuth();
  const handleInput = (e, setFunc) => {
    setFunc(e.target.value);
  };
  const signIn = () => {
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
        console.log(user);
        const response = await axios.post(
          `http://localhost:5000/api/user/register`,
          { email: user.email }
        );
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        setUserData(response.data.user);
        console.log('response', response);
        if (response.data.registered) {
          router.push('/Home');
        } else {
          router.push('/EditProfile', { first: true });
        }
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
        <h3>Sign In</h3>
        <p>メールアドレス、パスワードを入力してください。</p>
        <div>
          <TextField
            onChange={(e) => handleInput(e, setEmail)}
            fullWidth
            variant='standard'
            label='Email'
            required
            autoFocus
            autoComplete='email'
          />
          <TextField
            onChange={(e) => handleInput(e, setPassword)}
            fullWidth
            variant='standard'
            label='Password'
            required
            autoComplete='password'
            type='password'
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

export default SignIn;
