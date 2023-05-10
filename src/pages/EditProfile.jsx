'use client';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SelectImage from '../components/SelectImage';
import { useEffect } from 'react';
import { memo } from 'react';
import styled from 'styled-components';
import { useUserData } from '../provider/UserDataProvider';
import CommonButton from '../components/CommonButton';
import { useRouter } from 'next/router';
import useUploadImage from '../hooks/useUploadImage';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import SelectPrefecture from '../components/SelectPrefecture';
import useUserFunc from '../hooks/useUserFunc';
import useFetchData from '../hooks/useFetchData';

const EditProfile = memo(() => {
  const router = useRouter();
  const { userData, setUserData } = useUserData();
  const [username, setUsername] = useState(userData.username);
  const [desc, setDesc] = useState(userData.desc);
  const nowDate = new Date();
  const [birthday, setBirthday] = useState(userData.birthday || nowDate);
  const [prefecture, setPrefecture] = useState(userData.prefecture);
  const [iconImage, setIconImage] = useState(userData.icon_image);
  const [homeImage, setHomeImage] = useState(userData.home_image);
  const [isFirst, setIsFirst] = useState(false);
  const { uploadImage } = useUploadImage();
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const [user] = useAuthState(auth);
  const { updateUserFunc } = useUserFunc();
  const { fetchUserByIdFunc } = useFetchData();
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  useEffect(() => {
    setIsFirst(Boolean(router.query.first));
  }, []);
  const changeBirthday = (selectDate) => {
    setBirthday(selectDate);
  };
  const handleChange = (e, setFunc, value) => {
    e.preventDefault();
    if (value) {
      setFunc(value);
    } else {
      setFunc(e.target.value);
    }
  };
  const updateProfile = async (e) => {
    e.preventDefault();
    if (username === '' || !prefecture) {
      setSnackbarInfo({
        text: 'ユーザーネーム、都道府県の入力は必須です。',
        severity: 'error',
      });
      setSnackbarIsShow(true);
      return;
    }

    const option = {
      user_id: userData._id,
      username,
      desc: desc || '',
      birthday,
      prefecture,
      icon_image: iconImage,
      home_image: homeImage,
    };

    if (!!iconImage && iconImage !== userData.icon_image) {
      const imageURL = await uploadImage(iconImage, 'user');
      option.icon_image = imageURL;
    }
    if (!!homeImage && homeImage !== userData.home_image) {
      const imageURL = await uploadImage(homeImage, 'user');
      option.home_image = imageURL;
    }
    await updateUserFunc(option);

    const response = await fetchUserByIdFunc(userData._id);
    setUserData(response);
    router.push('/Home');
  };
  return (
    <SEditProfile>
      <h2>プロフィール情報を編集</h2>
      <TextField
        variant='standard'
        id='username'
        label='ユーザーネームを入力'
        value={username}
        autoFocus
        onChange={(e) => handleChange(e, setUsername)}
      />
      <TextField
        variant='standard'
        id='desc'
        label='紹介文を入力'
        fullWidth
        multiline
        value={desc}
        onChange={(e) => handleChange(e, setDesc)}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          id='birthday'
          label='誕生日を入力'
          inputFormat='yyyy/MM/dd'
          onChange={changeBirthday}
          value={birthday}
          renderInput={(params) => (
            <TextField variant='standard' {...params} fullWidth />
          )}
        />
      </LocalizationProvider>
      <SelectPrefecture prefecture={prefecture} setPrefecture={setPrefecture} />
      <SSelectImageWrap>
        <SelectImage
          id='iconImage'
          fullWidth
          multiple={false}
          accept='.png, .jpeg, .jpg'
          text='アイコン画像を選択'
          icon={<InsertPhotoIcon />}
          setImage={setIconImage}
        />
        {!iconImage && <p>アイコン画像が選択されていません</p>}
      </SSelectImageWrap>
      <SSelectImageWrap>
        <SelectImage
          id='homeImage'
          fullWidth
          multiple={false}
          accept='.png, .jpeg, .jpg'
          text='ホーム画像を選択'
          icon={<InsertPhotoIcon />}
          setImage={setHomeImage}
        />
        {!homeImage && <p>ホーム画像が選択されていません。</p>}
      </SSelectImageWrap>
      <Button
        fullWidth
        color='success'
        variant='contained'
        onClick={(e) => updateProfile(e)}
      >
        プロフィール情報更新
      </Button>
      {isFirst && (
        <CommonButton
          color='secondary'
          variant='contained'
          text='スキップ'
          onClick={(e) => router.push('/Home')}
        ></CommonButton>
      )}
    </SEditProfile>
  );
});

const SEditProfile = styled.form`
  h2 {
    text-align: center;
  }
  width: 90%;
  height: 100vh;
  max-width: 450px;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.6rem;
  margin: 0 auto;
`;

const SSelectImageWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;

  > p {
    color: red;
    font-size: 0.8rem;
  }
`;

export default EditProfile;
EditProfile.displayName = 'EditProfile';
