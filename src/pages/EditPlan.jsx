'use client';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SelectImage from '../components/SelectImage';
import { memo } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import useUploadImage from '../hooks/useUploadImage';
import ChipList from '../components/ChipList';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import SelectPrefecture from '../components/SelectPrefecture';
import useFetchData from '../hooks/useFetchData';
import usePlanFunc from '../hooks/usePlanFunc';
import { useUserData } from '../provider/UserDataProvider';
import { convertToSaveDate } from '../utils/dateUtils';
import Head from 'next/head';

const EditPlan = memo(() => {
  const router = useRouter();
  const [plan, setPlan] = useState({});
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [place, setPlace] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [limit, setLimit] = useState(0);
  const [chipText, setChipText] = useState('');
  const [chipTexts, setChipTexts] = useState([]);
  const [images, setImages] = useState([]);
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const { userData } = useUserData();
  const [date, setDate] = useState('');
  const { uploadImages } = useUploadImage();
  const { fetchPlanFunc } = useFetchData();
  const { updatePlanFunc } = usePlanFunc();
  const fetchPlan = async (planId) => {
    const response = await fetchPlanFunc(planId);
    setPlan(response);
  };
  let planId;
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  useEffect(() => {
    planId = router.query.planId;
    fetchPlan(planId);
  }, []);

  useEffect(() => {
    if (plan._id) {
      setTitle(plan.title);
      setDesc(plan.desc);
      setPlace(plan.place);
      setPrefecture(plan.prefecture);
      setLimit(plan.limit);
      setChipTexts(plan.tags);
      setImages(plan.images);
      setDate(plan.date);
    }
  }, [plan]);

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
    setChipTexts([...chipTexts, chipText]);
    setChipText('');
  };

  const editPlan = async (e) => {
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
    const saveDate = plan.date === plan.date ? date : convertToSaveDate(date);
    const option = {
      user_id: userData._id,
      plan_id: plan._id,
      title,
      place,
      prefecture,
      date: saveDate,
      desc,
      limit: convertLimit,
      tags: chipTexts,
      images,
    };

    if (images.length > 0 && images !== plan.images) {
      const imageNameArray = await uploadImages(images, 'plan');
      option.images = imageNameArray;
    }
    await updatePlanFunc(option);
    router.push('/Home');
  };
  return (
    <SEditPlan>
      <Head>
        <title>editPlan</title>
      </Head>
      <h2>プラン情報を編集</h2>
      <TextField
        variant='standard'
        id='title'
        label='タイトルを入力'
        value={title}
        autoFocus
        defaultChecked
        onChange={(e) => handleChange(e, setTitle)}
      />
      <TextField
        variant='standard'
        id='place'
        label='撮影場所を入力'
        value={place}
        onChange={(e) => handleChange(e, setPlace)}
        defaultChecked
      />

      <TextField
        variant='standard'
        id='desc'
        label='紹介文を入力'
        fullWidth
        multiline
        value={desc}
        onChange={(e) => handleChange(e, setDesc)}
        defaultChecked
      />
      <TextField
        variant='standard'
        id='limit'
        label='制限人数を入力'
        fullWidth
        value={limit}
        onChange={(e) => handleChange(e, setLimit)}
        defaultChecked
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
          variant='standard'
          id='chipText'
          label='タグを入力'
          fullWidth
          onChange={(e) => handleChange(e, setChipText)}
          value={chipText}
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
          <SWarningText>画像を選択していません。</SWarningText>
        )}
      </SWarningTextWrap>

      <Button
        fullWidth
        color='success'
        variant='contained'
        onClick={(e) => editPlan(e)}
      >
        プラン更新
      </Button>
    </SEditPlan>
  );
});

const SEditPlan = styled.div`
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

export default EditPlan;
EditPlan.displayName = 'EditPlan';
