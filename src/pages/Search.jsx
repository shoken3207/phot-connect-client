import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SelectPrefecture from '../components/SelectPrefecture';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CommonList from '../components/CommonList';
import PlanList from '../components/PlanList';
import styled from 'styled-components';
import useFetchData from '../hooks/useFetchData';
import useUserFunc from '../hooks/useUserFunc';
import { useUserData } from '../provider/UserDataProvider';
import { useRouter } from 'next/router';
import { MAX_LOAD_PLAN_COUNT } from '../const';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';

const Search = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const requestSearchCategory = router.query.searchCategory;
  const requestTag = router.query.tag;
  const requestPrefecture = router.query.prefecture;
  const [searchCategory, setSearchCategory] = useState(
    requestSearchCategory || 'users'
  );
  const [username, setUsername] = useState('');
  const [prefecture, setPrefecture] = useState(requestPrefecture || '');
  const [tag, setTag] = useState(requestTag || '');
  const [users, setUsers] = useState([]);
  const [plansByPrefecture, setPlansByPrefecture] = useState([]);
  const [plansByTag, setPlansByTag] = useState([]);
  const [planCountValByPrefecture, setPlanCountValByPrefecture] = useState(0);
  const [currentPageIndexByPrefecture, setCurrentPageIndexByPrefecture] =
    useState(1);
  const [planCountValByTag, setPlanCountValByTag] = useState(0);
  const [currentPageIndexByTag, setCurrentPageIndexByTag] = useState(1);
  const [isUpdateQuery, setIsUpdateQuery] = useState(false);
  const { userData, setUserData } = useUserData();
  const { addFriendFunc } = useUserFunc();
  const {
    fetchPlansByPrefectureFunc,
    fetchPlansByTagFunc,
    fetchUserByIdFunc,
    fetchUsersByNameFunc,
  } = useFetchData();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  useEffect(() => {
    if (requestSearchCategory === undefined) {
      return;
    }
    setSearchCategory(requestSearchCategory);
    if (requestSearchCategory === 'prefecture') {
      setPrefecture(requestPrefecture);
    } else if (requestSearchCategory === 'tag') {
      setTag(requestTag);
    }
    setIsUpdateQuery((prevState) => !prevState);
  }, [router.query]);

  useEffect(() => {
    if (requestSearchCategory === undefined) {
      return;
    }
    search();
    setIsUpdateQuery(false);
  }, [isUpdateQuery, currentPageIndexByPrefecture, currentPageIndexByTag]);

  const addFriend = async (e, friendId) => {
    e.preventDefault();
    const option = { user_id: userData._id, friend_id: friendId };
    const { success } = await addFriendFunc(option);
    if (success) {
      const user = await fetchUserByIdFunc(userData._id);
      setUserData(user);
    }
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
    e && e.preventDefault();
    if (searchCategory === 'users') {
      if (username === '') return;
      const user = await fetchUserByIdFunc(userData._id);
      setUserData(user);
      const response = await fetchUsersByNameFunc(username);
      const userArray = response.map((x) => {
        return {
          primaryText: x.username,
          secondaryText: x.desc,
          iconImage: x.icon_image,
          id: x._id,
        };
      });
      setUsers(userArray);
    } else if (searchCategory === 'prefecture') {
      if (prefecture === '') return;
      const { plans, planCount } = await fetchPlansByPrefectureFunc(
        prefecture,
        MAX_LOAD_PLAN_COUNT * (currentPageIndexByPrefecture - 1),
        MAX_LOAD_PLAN_COUNT
      );
      setPlansByPrefecture(plans);
      setPlanCountValByPrefecture(planCount);
    } else if (searchCategory === 'tag') {
      if (tag === '') return;
      const { plans, planCount } = await fetchPlansByTagFunc(
        tag,
        MAX_LOAD_PLAN_COUNT * (currentPageIndexByTag - 1),
        MAX_LOAD_PLAN_COUNT
      );
      setPlansByTag(plans);
      setPlanCountValByTag(planCount);
    }
  };
  return (
    <SSearch>
      <FormControl>
        <FormLabel>検索したいものを選んでください。</FormLabel>
        <RadioGroup
          value={searchCategory}
          onChange={(e, value) => handleChange(e, setSearchCategory, value)}
        >
          <FormControlLabel
            value='users'
            control={<Radio />}
            label='名前からユーザ'
          />
          <FormControlLabel
            value='prefecture'
            control={<Radio />}
            label='都道府県からプラン'
          />
          <FormControlLabel
            value='tag'
            control={<Radio />}
            label='タグからプラン'
          />
        </RadioGroup>
      </FormControl>
      <form onSubmit={(e) => search(e)}>
        {searchCategory === 'users' ? (
          <TextField
            id='username'
            variant='standard'
            label='ユーザーネームを入力'
            value={username}
            onChange={(e) => handleChange(e, setUsername)}
            autoFocus
            fullWidth
          />
        ) : searchCategory === 'prefecture' ? (
          <SelectPrefecture
            prefecture={prefecture}
            setPrefecture={setPrefecture}
            autoFocus
          />
        ) : (
          <TextField
            id='tag'
            variant='standard'
            label='検索したいワードを入力'
            value={tag}
            onChange={(e) => handleChange(e, setTag)}
            autoFocus
            fullWidth
          ></TextField>
        )}
      </form>

      <Button fullWidth variant='contained' onClick={(e) => search(e)}>
        検索
      </Button>

      {searchCategory === 'users' ? (
        <CommonList
          pagePath='Profile'
          listData={users}
          onClick={(e, userId, friendId) => addFriend(e, userId, friendId)}
          friendAdd
          withActionButton
        />
      ) : searchCategory === 'prefecture' ? (
        <PlanList
          planList={plansByPrefecture}
          setPlans={setPlansByPrefecture}
          planCountVal={planCountValByPrefecture}
          currentPageIndex={currentPageIndexByPrefecture}
          setCurrentPageIndex={setCurrentPageIndexByPrefecture}
        />
      ) : (
        <PlanList
          planList={plansByTag}
          setPlans={setPlansByTag}
          planCountVal={planCountValByTag}
          currentPageIndex={currentPageIndexByTag}
          setCurrentPageIndex={setCurrentPageIndexByTag}
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
