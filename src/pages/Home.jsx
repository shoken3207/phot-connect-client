import React, { useEffect, useState } from 'react';
import PlanList from '../components/PlanList';
import { useUserData } from '../provider/UserDataProvider';
import useFetchData from '../hooks/useFetchData';
import { MAX_LOAD_PLAN_COUNT } from '../const';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';

const Home = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { userData } = useUserData();
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [plans, setPlans] = useState([]);
  const { fetchHomePlansFunc } = useFetchData();
  const fetchFunc = async () => {
    const { plans, planCount } = await fetchHomePlansFunc(
      userData._id,
      MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
      MAX_LOAD_PLAN_COUNT
    );
    setPlanCountVal(planCount);
    setPlans(plans);
  };
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  useEffect(() => {
    if (userData._id) {
      fetchFunc();
    }
  }, [userData, currentPageIndex]);

  return (
    <div>
      <PlanList
        planList={plans}
        setPlans={setPlans}
        planCountVal={planCountVal}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
      />
    </div>
  );
};

export default Home;
