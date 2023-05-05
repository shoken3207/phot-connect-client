import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PlanList from '../../components/PlanList';
import { MAX_LOAD_PLAN_COUNT } from '../../const';
import useFetchData from '../../hooks/useFetchData';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/main';

const Profile = () => {
  const [createPlans, setCreatePlans] = useState([]);
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { fetchUserByIdFunc, fetchCreatedPlansFunc } = useFetchData();

  let userId;

  const fetchPlans = async (userId) => {
    const { plans, planCount } = await fetchCreatedPlansFunc(
      userId,
      MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
      MAX_LOAD_PLAN_COUNT
    );
    setCreatePlans(plans);
    setPlanCountVal(planCount);
  };

  const fetchUser = async (userId) => {
    const user = await fetchUserByIdFunc(userId);
    setUserInfo(user);
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);

  useEffect(() => {
    userId = router.query.id;
    fetchUser(userId);
    fetchPlans(userId);
  }, [currentPageIndex]);

  useEffect(() => {
    userId = router.query.id;
    setCurrentPageIndex(1);
    fetchUser(userId);
    fetchPlans(userId);
  }, [router.query.id]);
  return (
    <SProfile>
      <SProfileHeader homeImage={userInfo.home_image}>
        <div>
          <SProfileHeaderIcon>
            <img
              src={userInfo.icon_image || '/images/noAvatar.png'}
              alt='プロフィールイメージ'
            />
          </SProfileHeaderIcon>
          <h3>{userInfo.username || 'unknown'}</h3>
        </div>
      </SProfileHeader>
      <SProfileInfo>
        <tr>
          <th>在住県</th>
          <td>{userInfo.prefecture}</td>
        </tr>
        <tr>
          <th>🎂</th>
          <td>{userInfo.birthday}</td>
        </tr>
        <tr>
          <td>{userInfo.desc}</td>
        </tr>
      </SProfileInfo>
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
  max-width: 600px;
  margin: 0 auto;
  row-gap: 0.6rem;
`;

const SProfileHeader = styled.div`
  background-image: ${(props) =>
    props.homeImage ? `url(${props.homeImage})` : 'url(/images/HomeImage.jpg)'};
  background-size: cover;
  background-position: center center;
  min-height: 14rem;
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
    }
  }
`;

const SProfileInfo = styled.table`
  > tr {
  }
`;

const SProfileHeaderInfo = styled.ul`
  li {
    padding: 0.4rem;
  }
`;
const SProfileHeaderIcon = styled.div`
  width: 7rem;
  height: 7rem;
  > img {
    border: 6px solid white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
