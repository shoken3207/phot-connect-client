import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PlanList from '../../components/PlanList';
import { MAX_LOAD_PLAN_COUNT } from '../../const';
import useFetchData from '../../hooks/useFetchData';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/main';
import Head from 'next/head';
import { getDispBirthday } from '../../utils/dateUtils';
import { useUserData } from '../../provider/UserDataProvider';
import { Button } from '@mui/material';
import useUserFunc from '../../hooks/useUserFunc';

const Profile = () => {
  const [createPlans, setCreatePlans] = useState([]);
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const { userData, setUserData } = useUserData();
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();
  const profileInfoContainerRef = useRef();
  const profileHeaderRef = useRef();
  const [user] = useAuthState(auth);
  const { addFriendFunc } = useUserFunc();
  const { fetchUserByIdFunc, fetchCreatedPlansFunc } = useFetchData();

  let userId;
  const isFriend = (friends, userId) => {
    const friend = friends?.find((friend) => friend._id === userId);
    return !!friend;
  };

  const fetchPlans = async (userId) => {
    const { plans, planCount } = await fetchCreatedPlansFunc(
      userId,
      MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
      MAX_LOAD_PLAN_COUNT
    );
    setCreatePlans(plans);
    setPlanCountVal(planCount);
  };
  const addFriend = async (e, friendId) => {
    e.preventDefault();
    const option = { user_id: userData._id, friend_id: friendId };
    const { success } = await addFriendFunc(option);
    if (success) {
      const user = await fetchUserByIdFunc(userData._id);
      setUserData(user);
    }
  };

  const fetchUser = async (userId) => {
    const user = await fetchUserByIdFunc(userId);
    setUserInfo(user);
  };
  const fetchLoginUser = async (userId) => {
    const loginUser = await fetchUserByIdFunc(userId);
    setUserData(loginUser);
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);

  useEffect(() => {
    userId = router.query.id;
    fetchUser(userId);
    fetchLoginUser(userData._id);
    fetchPlans(userId);
  }, [currentPageIndex]);

  useEffect(() => {
    userId = router.query.id;
    setCurrentPageIndex(1);
    fetchUser(userId);
    fetchLoginUser(userData._id);
    fetchPlans(userId);
  }, [router.query.id]);
  return (
    <SProfile>
      <Head>
        <title>Profile</title>
      </Head>
      <SProfileHeader
        ref={profileHeaderRef}
        clientWidth={profileHeaderRef.current?.clientWidth}
        homeImage={userInfo.home_image}
      >
        <div>
          <SProfileHeaderIcon
            clientWidth={profileHeaderRef.current?.clientWidth}
          >
            <img
              src={userInfo?.icon_image || '/images/noAvatar.png'}
              alt='プロフィールイメージ'
            />
          </SProfileHeaderIcon>
          <h3>{userInfo?.username || 'unknown'}</h3>
        </div>
      </SProfileHeader>
      <SProfileInfoList
        ref={profileInfoContainerRef}
        clientWidth={profileInfoContainerRef.current?.clientWidth}
      >
        {userInfo?.prefecture && (
          <div>
            <p>在住県</p>
            <p>{userInfo?.prefecture || ''}</p>
          </div>
        )}

        {userInfo?.birthday && (
          <div>
            {' '}
            <p>誕生日</p>
            <p>{getDispBirthday(userInfo?.birthday)}</p>
          </div>
        )}
        {userInfo?.desc && (
          <div>
            <p>自己紹介</p>
            <p>
              {userInfo?.desc &&
                userInfo?.desc.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </p>
          </div>
        )}

        <div>
          {userData._id !== userInfo?._id &&
            !isFriend(userData.friends, userInfo?._id) && (
              <Button
                variant='contained'
                onClick={(e) => addFriend(e, userInfo?._id)}
              >
                友達に追加
              </Button>
            )}
        </div>
      </SProfileInfoList>
      <PlanList
        planList={createPlans}
        setPlans={setCreatePlans}
        planCountVal={planCountVal}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
      />
    </SProfile>
  );
};

export default Profile;

const SProfile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1.4em;
`;

const SProfileHeader = styled.div`
  background-image: ${(props) =>
    props.homeImage ? `url(${props.homeImage})` : 'url(/images/HomeImage.jpg)'};
  background-size: cover;
  background-position: center center;
  min-height: 14rem;
  height: ${(props) => props.clientWidth / 2.4 + 'px'};
  max-height: 18rem;
  position: relative;
  margin-bottom: 4rem;

  > div {
    display: flex;
    align-items: flex-end;
    column-gap: 0.6rem;
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    left: 12%;

    > h3 {
      transform: translateY(-0.6rem);
      @media screen and (min-width: 300px) {
        font-size: 24px;
      }
      @media screen and (min-width: 650px) {
        font-size: 30px;
      }
      @media screen and (min-width: 1120px) {
        font-size: 36px;
      }
    }
  }
`;

const SProfileInfoList = styled.div`
  width: 85%;
  margin: 0 auto;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;
  @media screen and (min-width: 300px) {
    font-size: 16px;
  }
  @media screen and (min-width: 650px) {
    font-size: 20px;
  }
  @media screen and (min-width: 1120px) {
    font-size: 24px;
  }
  > div {
    display: flex;
    width: 100%;
    column-gap: 0.7rem;
    flex-direction: ${({ clientWidth }) =>
      clientWidth < 500 ? 'column' : 'row'};
    word-break: break-word;
    > p {
      &:nth-of-type(1) {
        font-weight: bold;
        white-space: nowrap;
      }
      &:nth-of-type(1) {
      }
    }

    &:nth-of-type(4) {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const SProfileHeaderIcon = styled.div`
  width: ${(props) => props.clientWidth / 4.3 + 'px'};
  height: ${(props) => props.clientWidth / 4.3 + 'px'};
  min-width: 7rem;
  min-height: 7rem;
  max-width: 9.5rem;
  max-height: 9.5rem;
  > img {
    border: 6px solid white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
