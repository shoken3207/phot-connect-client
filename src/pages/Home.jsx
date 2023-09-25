import React, { useEffect, useState } from 'react';
import PlanList from '../components/PlanList';
import { useUserData } from '../provider/UserDataProvider';
import useFetchData from '../hooks/useFetchData';
import {
  FULL_SCREEN_POPUP_TYPE,
  MAX_LOAD_NOTIFICATION_COUNT,
  MAX_LOAD_PLAN_COUNT,
} from '../const';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import { useIsOpenFullScreenDialog } from '../provider/IsOpenFullScreenDialogProvider';
import CommonFullScreenDialog from '../components/CommonFullScreenDialog';
import NotificationList from '../components/NotificationList';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Head from 'next/head';

const Home = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { userData } = useUserData();
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [plans, setPlans] = useState([]);
  const { isOpenFullScreenDialog, setIsOpenFullScreenDialog } =
    useIsOpenFullScreenDialog();
  const {
    fetchHomePlansFunc,
    fetchNotificationsFunc,
    fetchNotificationCountFunc,
  } = useFetchData();
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

  useEffect(() => {
    if (isOpenFullScreenDialog) {
      fetchNotifications();
      fetchNotificationCount();
    } else {
      setNotifications([]);
    }
  }, [isOpenFullScreenDialog]);

  const fetchNotifications = async () => {
    const { notifications: loadNotifications } = await fetchNotificationsFunc(
      userData._id,
      notifications.length,
      MAX_LOAD_NOTIFICATION_COUNT
    );
    setNotifications([...notifications, ...loadNotifications]);
  };
  const fetchNotificationCount = async () => {
    const { notificationCount } = await fetchNotificationCountFunc(
      userData._id
    );
    setNotificationCount(notificationCount);
  };

  return (
    <div>
      <Head>
        <title>home</title>
      </Head>
      <PlanList
        planList={plans}
        setPlans={setPlans}
        planCountVal={planCountVal}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
      />
      <CommonFullScreenDialog
        isOpenFullScreenDialog={
          isOpenFullScreenDialog === FULL_SCREEN_POPUP_TYPE.NOTIFICATION
        }
        setIsOpenFullScreenDialog={setIsOpenFullScreenDialog}
        title='通知'
        icon={<NotificationsIcon />}
      >
        <InfiniteScroll
          height='88vh'
          dataLength={notifications.length}
          next={fetchNotifications}
          hasMore={notificationCount !== notifications.length}
        >
          <NotificationList notifications={notifications} />
        </InfiniteScroll>
      </CommonFullScreenDialog>
    </div>
  );
};

export default Home;
