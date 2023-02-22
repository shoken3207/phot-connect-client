'use client';
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SelectImage from '../components/SelectImage';
import axios from 'axios';
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

const EditPlan = memo(() => {
  const router = useRouter();
  const [plan, setPlan] = useState({});
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
  const [date, setDate] = useState('');
  const { uploadImages } = useUploadImage();
  const fetchPlan = async (planId) => {
    const response = await axios.get(
      `http://localhost:5000/api/plan/${planId}`
    );
    setPlan(response.data);
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
      console.log('plan: ', plan);
      setTitle(plan.title);
      setDesc(plan.desc);
      setPlace(plan.place);
      setPrefecture(plan.prefecture);
      setLimit(plan.limit);
      setChipTexts(plan.chipTexts);
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
    const copyChipTexts = [...chipTexts];
    copyChipTexts.push(chipText);
    setChipTexts(copyChipTexts);
    setChipText('');
  };

  const editPlan = async (e) => {
    e.preventDefault();
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
      chipTexts,
      images,
      organizerId: plan.organizerId,
    };
    console.log(option);

    if (images.length > 0 && images !== plan.images) {
      console.log('images: ', images);
      const imageNameArray = await uploadImages(images, 'plan');
      console.log('imageNameArray', imageNameArray);
      console.log('before: ', option.images);
      option.images = imageNameArray;
      console.log('after: ', option.images);
      debugger;
    }
    await axios.put(
      `http://localhost:5000/api/plan/${plan._id}/update`,
      option
    );
    router.push('/Home');
  };
  return (
    <SEditPlan>
      <h2>プラン情報を編集</h2>
      <TextField
        id='title'
        label='タイトルを入力'
        value={title}
        defaultChecked
        onChange={(e) => handleChange(e, setTitle)}
      />
      <TextField
        id='place'
        label='撮影場所を入力'
        value={place}
        onChange={(e) => handleChange(e, setPlace)}
        defaultChecked
      />

      <TextField
        id='desc'
        label='紹介文を入力'
        fullWidth
        multiline
        value={desc}
        onChange={(e) => handleChange(e, setDesc)}
        defaultChecked
      />
      <TextField
        id='limit'
        label='制限人数を入力'
        fullWidth
        value={limit}
        onChange={(e) => handleChange(e, setLimit)}
        defaultChecked
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
          id='chipText'
          label='チップテキストを入力'
          fullWidth
          multiline
          variant='standard'
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
        onClick={(e) => editPlan(e)}
      >
        プラン更新
      </Button>
    </SEditPlan>
  );
});

const SEditPlan = styled.form`
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

export default EditPlan;
