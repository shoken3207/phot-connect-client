'use client';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SelectImage from '../components/SelectImage';
import axios from 'axios';
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
const CreatePlan = () => {
  const { userData } = useUserData();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [place, setPlace] = useState('');
  const [prefecture, setPrefecture] = useState(undefined);
  const [limit, setLimit] = useState(0);
  const [chipText, setChipText] = useState('');
  const [chipTexts, setChipTexts] = useState([]);
  const [images, setImages] = useState([]);
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const nowDate = new Date();
  const [date, setDate] = useState(nowDate);
  const { uploadImages } = useUploadImage();

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
    console.log(title, place, date, prefecture);
    if (
      title === '' ||
      place === '' ||
      date === '' ||
      prefecture === undefined
    ) {
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
      console.log('false');
      setSnackbarInfo({
        text: '限界参加人数は、0以上の整数で入力してください。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);
      return;
    }
    const convertDesc = desc.replace(/\n/g, '<br>');
    const option = {
      title,
      place,
      prefecture,
      date,
      desc: convertDesc,
      limit: convertLimit,
      chipTexts: chipTexts,
      organizerId: userData._id,
      organizerIconImage: userData.iconImage,
    };

    if (images.length > 0) {
      const imageNameArray = await uploadImages(images, 'plan');
      option.images = imageNameArray;
    } else {
      option.images = ['/images/noImage.jpg'];
    }
    const talkRoom = await axios.post(
      'http://localhost:5000/api/talkRoom/create',
      {
        talkRoomIconImage: option.images[0],
        talkRoomName: option.title,
        members: [userData._id],
      }
    );
    option.talkRoomId = talkRoom.data._id;
    await axios.post(`http://localhost:5000/api/plan/create`, option);
    router.push('/Home');
  };
  return (
    <SCreatePlan>
      <h2>プロフィール情報を編集</h2>
      <TextField
        id='title'
        label='タイトルを入力'
        value={title}
        onChange={(e) => handleChange(e, setTitle)}
      />
      <TextField
        id='place'
        label='撮影場所を入力'
        vaule={place}
        onChange={(e) => handleChange(e, setPlace)}
      />
      <TextField
        id='desc'
        label='紹介文を入力'
        fullWidth
        multiline
        value={desc}
        onChange={(e) => handleChange(e, setDesc)}
      />
      <TextField
        id='limit'
        label='制限人数を入力（特になければ0のまま）'
        fullWidth
        value={limit}
        onChange={(e) => handleChange(e, setLimit)}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          id='date'
          label='実施日を入力'
          inputFormat='yyyy/MM/dd'
          onChange={changeDate}
          value={date}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
      <SelectPrefecture prefecture={prefecture} setPrefecture={setPrefecture} />
      <SAddChipText>
        <TextField
          id='desc'
          label='チップテキストを入力'
          fullWidth
          multiline
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
      <SelectImage
        id='iconImage'
        fullWidth
        multiple={true}
        accept='.png, .jpeg, .jpg'
        text='画像を選択'
        icon={<InsertPhotoIcon />}
        setImage={setImages}
      />

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

const SCreatePlan = styled.form`
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

const SAddChipText = styled.div`
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

export default CreatePlan;
