import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SelectPrefecture from '../components/SelectPrefecture';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button/Button';
import axios from 'axios';
import CommonList from '../components/CommonList';
import PlanList from '../components/PlanList';
import styled from 'styled-components';
import useFetchData from '../hooks/useFetchData';
import useUpdateUser from '../hooks/useUpdateUser';
import { useUserData } from '../provider/UserDataProvider';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

const Search = () => {
  const [searchCategory, setSearchCategory] = useState('users');
  const [prefecture, setPrefecture] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const { fetchUserData } = useFetchData();
  const { setUserData } = useUserData();
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const { addFriendFunc } = useUpdateUser();
  const addFriend = async (e, userId, friendId) => {
    e.preventDefault();
    const friend = await fetchUserData(friendId);
    await addFriendFunc(userId, friend);
    // await axios.put(`http://localhost:5000/api/user/${friendId}/add`, {
    //   userId,
    // });
    // await axios.post('http://localhost:5000/api/talkRoom/create', {
    //   talkRoomIconImage: friend.iconImage,
    //   talkRoomName: friend.username,
    //   members: [userId, friendId],
    // });
    const user = await fetchUserData(userId);
    setUserData(user);
  };
  const handleChange = (e, setFunc, value) => {
    e.preventDefault();
    if (value) {
      setFunc(value);
    } else {
      setFunc(e.target.value);
    }
  };

  const search = async (e) => {
    e.preventDefault();
    try {
      if (searchCategory === 'users') {
        const response = await axios.get(
          `http://localhost:5000/api/user/${username}/search`
        );
        const userArray = response.data.map((x) => {
          return {
            primaryText: x.username,
            secondaryText: x.desc,
            iconImage: x.iconImage,
            id: x._id,
          };
        });
        console.log(userArray);
        setUsers(userArray);
      } else if (searchCategory === 'plans') {
        console.log('prefecture: ', prefecture);
        const response = await axios.get(
          `http://localhost:5000/api/plan/${prefecture}/prefecture`
        );
        setPlans(response.data);
        console.log('response: ', response.data);
      }
    } catch (err) {
      const { response } = err;
      console.log('response', response.data);
      setSnackbarInfo({ text: response.data, severity: 'warning' });
      setSnackbarIsShow(true);
    }
  };
  return (
    <SSearch>
      <FormControl>
        <FormLabel>検索したいものを選んでください。</FormLabel>
        <RadioGroup
          defaultValue='users'
          name='radio-buttons-group'
          onChange={(e, value) => handleChange(e, setSearchCategory, value)}
        >
          <FormControlLabel value='users' control={<Radio />} label='users' />
          <FormControlLabel value='plans' control={<Radio />} label='plans' />
        </RadioGroup>
      </FormControl>
      {searchCategory === 'users' ? (
        <TextField
          id='username'
          label='ユーザーネームを入力'
          value={username}
          onChange={(e) => handleChange(e, setUsername)}
          fullWidth
        />
      ) : (
        <SelectPrefecture
          prefecture={prefecture}
          setPrefecture={setPrefecture}
        />
      )}

      <Button fullWidth variant='contained' onClick={(e) => search(e)}>
        検索
      </Button>

      {searchCategory === 'users' ? (
        <CommonList
          listData={users}
          onClick={(e, userId, friendId) => addFriend(e, userId, friendId)}
          friendAdd
        />
      ) : (
        <PlanList
          planList={plans}
          setPlans={setPlans}
          fetchType='prefecture'
          fetchWord={prefecture}
        />
      )}
    </SSearch>
  );
};

export default Search;

const SSearch = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  width: 85%;
  max-width: 550px;
  margin: 5rem auto 0 auto;
`;
