import React, { useEffect, useState } from 'react';
import PlanList from '../components/PlanList';
import { useUserData } from '../provider/UserDataProvider';
import useFetchData from '../hooks/useFetchData';

const Home = () => {
  const { userData } = useUserData();
  const [plans, setPlans] = useState([]);
  const { fetchHomePlans } = useFetchData();

  const fetchFunc = async () => {
    const response = await fetchHomePlans(userData._id);
    setPlans(response);
    console.log(await fetchHomePlans(userData._id));
  };
  useEffect(() => {
    fetchFunc();
  }, [userData]);
  return (
    <div>
      <PlanList
        planList={plans}
        setPlans={setPlans}
        fetchType='home'
        fetchWord={userData._id}
      />
    </div>
  );
};

export default Home;
