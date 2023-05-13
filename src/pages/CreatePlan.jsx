'use client';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SelectImage from '../components/SelectImage';
import styled from 'styled-components';
import { useUserData } from '../provider/UserDataProvider';
import useUploadImage from '../hooks/useUploadImage';
import { useRouter } from 'next/router';
import ChipList from '../components/ChipList';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import SelectPrefecture from '../components/SelectPrefecture';
import usePlanFunc from '../hooks/usePlanFunc';
import { convertToSaveDate } from '../utils/dateUtils';
import Head from 'next/head';
const CreatePlan = () => {
  const { userData } = useUserData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [place, setPlace] = useState('');
  const [prefecture, setPrefecture] = useState(
    userData._id && userData.prefecture
  );
  const [limit, setLimit] = useState(0);
  const [chipText, setChipText] = useState('');
  const [chipTexts, setChipTexts] = useState([]);
  const [images, setImages] = useState([]);
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const nowDate = new Date();
  const [date, setDate] = useState(nowDate);
  const { uploadImages } = useUploadImage();
  const { createPlanFunc } = usePlanFunc();

  const [user] = useAuthState(auth);
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);

  const handleChange = (e, setFunc, value) => {
    e.preventDefault();
    if (value) {
      setFunc(value);
    } else {
      setFunc(e.target.value);
    }
  };

  const changeDate = (selectDate) => {
    setDate(selectDate);
  };

  const addChipText = (e) => {
    e.preventDefault();
    if (chipText === '') return;
    const copyChipTexts = [...chipTexts];
    copyChipTexts.push(chipText);
    setChipTexts(copyChipTexts);
    setChipText('');
  };
  const createPlan = async (e) => {
    e.preventDefault();
    if (title === '' || place === '' || date === '' || !prefecture) {
      setSnackbarInfo({
        text: 'タイトル、撮影場所、実施日、都道府県の入力は必須です。',
        severity: 'error',
      });
      setSnackbarIsShow(true);
      return;
    }
    const convertLimit = Number(limit);
    if (
      isNaN(convertLimit) ||
      Number.isInteger(convertLimit) === false ||
      convertLimit < 0 ||
      limit === ''
    ) {
      setSnackbarInfo({
        text: '限界参加人数は、0以上の整数で入力してください。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }
    const saveDate = convertToSaveDate(date);
    const option = {
      title,
      place,
      prefecture,
      date: saveDate,
      desc,
      limit: convertLimit,
      tags: chipTexts,
      organizer_id: userData._id,
      organizer_icon_image: userData.icon_image,
    };
    if (images.length > 0) {
      const imageNameArray = await uploadImages(images, 'plan');
      option.images = imageNameArray;
    } else {
      option.images = [];
    }
    await createPlanFunc(option);
    router.push('/Home');
  };
  return (
    <SCreatePlan>
      <Head>
        <title>createPlan</title>
      </Head>
      <h2>プロフィール情報を編集</h2>
      <TextField
        id='title'
        label='タイトルを入力'
        value={title}
        variant='standard'
        autoFocus
        onChange={(e) => handleChange(e, setTitle)}
      />
      <TextField
        id='place'
        label='撮影場所を入力'
        vaule={place}
        variant='standard'
        onChange={(e) => handleChange(e, setPlace)}
      />
      <TextField
        id='desc'
        label='紹介文を入力'
        fullWidth
        multiline
        value={desc}
        variant='standard'
        onChange={(e) => handleChange(e, setDesc)}
      />
      <TextField
        id='limit'
        label='制限人数を入力 (特になければ0のまま)'
        fullWidth
        value={limit}
        variant='standard'
        onChange={(e) => handleChange(e, setLimit)}
      />
      <SWarningTextWrap>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            id='date'
            label='実施日を入力'
            inputFormat='yyyy/MM/dd'
            onChange={changeDate}
            value={date}
            renderInput={(params) => (
              <TextField variant='standard' {...params} fullWidth />
            )}
          />
        </LocalizationProvider>
        <SWarningText>
          明日以降の日付を入力してください。
          <br />
          実施日の前日の23時59分59秒に自動で募集が締め切られます。
        </SWarningText>
      </SWarningTextWrap>
      <SelectPrefecture prefecture={prefecture} setPrefecture={setPrefecture} />
      <SAddChipText onSubmit={(e) => addChipText(e)}>
        <TextField
          id='desc'
          label='タグを入力'
          fullWidth
          variant='standard'
          value={chipText}
          onChange={(e) => handleChange(e, setChipText)}
        />
        <Button
          size='small'
          variant='contained'
          onClick={(e) => addChipText(e)}
        >
          追加
        </Button>
      </SAddChipText>
      {chipTexts.length > 0 && (
        <ChipList chipTexts={chipTexts} setChipTexts={setChipTexts} />
      )}
      <SWarningTextWrap>
        <SelectImage
          id='iconImage'
          fullWidth
          multiple={true}
          accept='.png, .jpeg, .jpg'
          text='画像を選択'
          icon={<InsertPhotoIcon />}
          setImage={setImages}
        />
        {images.length === 0 && (
          <SWarningText>画像が選択されていません。</SWarningText>
        )}
      </SWarningTextWrap>

      <Button
        fullWidth
        color='success'
        variant='contained'
        onClick={(e) => createPlan(e)}
      >
        プラン作成
      </Button>
    </SCreatePlan>
  );
};

const SCreatePlan = styled.div`
  h2 {
    text-align: center;
  }
  width: 90%;
  max-width: 450px;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 1.6rem;
  margin: 0 auto;
  margin-bottom: 1rem;
`;

const SAddChipText = styled.form`
  display: flex;
  width: 100%;
  justify-content: space-between;
  &:nth-child(1) {
    width: 65%;
  }
  &:nth-child(1) {
    width: 30%;
  }
`;

const SWarningText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const SWarningTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
`;

export default CreatePlan;
