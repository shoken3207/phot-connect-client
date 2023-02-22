import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PlanList from '../../components/PlanList';
import { useUserData } from '../../provider/UserDataProvider';

const Profile = () => {
  const [createPlans, setCreatePlans] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const { userData } = useUserData();
  const router = useRouter();
  const fetchUserInfo = async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/user/${userId}`
    );
    setUserInfo(response.data);
  };
  const fetchCreatePlans = async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/plan/${userId}/create`
    );
    setCreatePlans(response.data);
  };
  let userId;
  useEffect(() => {
    userId = router.query.id;
    fetchUserInfo(userId);
    fetchCreatePlans(userId);
  }, []);
  return (
    <SProfile>
      <SProfileHeader homeImage={userInfo.homeImage}>
        <div>
          <SProfileHeaderIcon>
            <img src={userInfo.iconImage} alt='プロフィールイメージ' />
          </SProfileHeaderIcon>
          <h3>{userInfo.username}</h3>
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
        fetchType='profile'
        fetchWord={userId}
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
