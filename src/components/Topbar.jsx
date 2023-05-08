import * as React from 'react';
import { memo, useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Badge, Tooltip } from '@mui/material';
import { useUserData } from '../provider/UserDataProvider';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from 'styled-components';
import LinkWrap from './LinkWrap';
import { useRouter } from 'next/router';
import CommonMenu from './CommonMenu';
import { auth } from '../firebase/main';
import PlanList from './PlanList';
import useFetchData from '../hooks/useFetchData';
import { MAX_LOAD_PLAN_COUNT } from '../const';
import { useIsOpenFullScreenDialog } from '../provider/IsOpenFullScreenDialogProvider';
import CommonFullScreenDialog from './CommonFullScreenDialog';
const TopBar = memo(({ setIsOpen }) => {
  const router = useRouter();
  const topBarRef = useRef();
  const [fullScreenDialogTitle, setFullScreenDialogTitle] = useState('');
  const [topBarHeight, setTopBarHeight] = useState(0);
  const { userData, setUserData } = useUserData();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [menuList, setMenuList] = useState([]);
  const { isOpenFullScreenDialog, setIsOpenFullScreenDialog } =
    useIsOpenFullScreenDialog();
  const {
    fetchLikedPlansFunc,
    fetchParticipatedPlansFunc,
    fetchNotificationCountFunc,
  } = useFetchData();
  const basePath = router.pathname.split('/')[1];

  useEffect(() => {
    const menuArray = [
      {
        text: 'プロフィール画面',
        icon: <AccountCircleIcon />,
        onClickFunc: (e) => transitionProfilePage(e),
      },
      {
        text: 'いいねしたプラン',
        icon: <FavoriteBorderIcon />,
        onClickFunc: (e) => dispLikedPlan(e),
      },
      {
        text: '参加したプラン',
        icon: <GroupIcon />,
        onClickFunc: (e) => dispParticipationedPlan(e),
      },

      {
        text: 'ログアウト',
        icon: <LogoutIcon />,
        onClickFunc: (e) => logout(e),
      },
    ];
    setMenuList(menuArray);
  }, [userData]);

  useEffect(() => {
    if (basePath === 'Home') {
      fetchNotificationCount();
    }
  }, [router.pathname, isOpenFullScreenDialog]);

  useEffect(() => {
    if (!dialogIsOpen) {
      setCurrentPageIndex(1);
    }
  }, [dialogIsOpen]);

  useEffect(() => {
    setTopBarHeight(topBarRef.current?.clientHeight);
  }, [router.pathname]);

  const transitionProfilePage = (e) => {
    e.preventDefault();
    router.push(`/Profile/${userData._id}`);
  };

  const fetchNotificationCount = async () => {
    if (userData._id) {
      const { notificationCount } = await fetchNotificationCountFunc(
        userData._id
      );
      setNotificationCount(notificationCount);
    }
  };

  const dispLikedPlan = async (e) => {
    e.preventDefault();
    const { plans: likedPlans, planCount } = await fetchLikedPlansFunc(
      userData._id,
      MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
      MAX_LOAD_PLAN_COUNT
    );
    if (likedPlans.length > 0) {
      setFullScreenDialogTitle('「いいね！」したプラン');
      setPlans(likedPlans);
      setPlanCountVal(planCount);
      setDialogIsOpen(true);
    }
  };

  const dispParticipationedPlan = async (e) => {
    e.preventDefault();
    const { plans: participatedPlans, planCount } =
      await fetchParticipatedPlansFunc(
        userData._id,
        MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
        MAX_LOAD_PLAN_COUNT
      );
    if (participatedPlans.length > 0) {
      setFullScreenDialogTitle('参加したプラン');
      setPlans(participatedPlans);
      setPlanCountVal(planCount);
      setDialogIsOpen(true);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    auth.signOut();
    setUserData('');
    sessionStorage.removeItem('user');
    router.push('/auth');
  };

  const appBarStyle = { bottom: 'auto', top: 0 };
  if (!userData._id) {
    appBarStyle.height = 85;
  }

  return (
    <div style={{ paddingTop: topBarHeight }}>
      <AppBar ref={topBarRef} color='inherit' position='fixed' sx={appBarStyle}>
        <Toolbar>
          <>
            {!!userData._id &&
            (basePath === 'TalkRoom' ||
              basePath === 'Profile' ||
              (isOpenFullScreenDialog && basePath === 'Chat')) ? (
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
                onClick={() => router.back()}
              >
                <ArrowBackIosIcon />
              </IconButton>
            ) : (
              !!userData._id && (
                <IconButton
                  size='large'
                  edge='start'
                  color='inherit'
                  aria-label='menu'
                  sx={{ mr: 2 }}
                  onClick={() => setIsOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              )
            )}
            {!!userData._id ? (
              <>
                {' '}
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                  {userData.username || 'unknown'}
                </Typography>
                {basePath === 'Home' && (
                  <Tooltip title='通知'>
                    <IconButton onClick={() => setIsOpenFullScreenDialog(true)}>
                      {notificationCount > 0 ? (
                        <Badge
                          badgeContent={notificationCount}
                          color='secondary'
                        >
                          <NotificationsIcon fontSize='large' />
                        </Badge>
                      ) : (
                        <NotificationsIcon fontSize='large' />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                <CommonMenu menuArray={menuList}>
                  <Avatar src={userData.icon_image} />
                </CommonMenu>
              </>
            ) : (
              <LinkWrap href='/auth'>
                <SImage src='/images/logo.png' alt='' />
              </LinkWrap>
            )}
          </>
        </Toolbar>

        <CommonFullScreenDialog
          isOpenFullScreenDialog={dialogIsOpen}
          setIsOpenFullScreenDialog={setDialogIsOpen}
          title={fullScreenDialogTitle}
        >
          <PlanList
            planList={plans}
            setPlans={setPlans}
            planCountVal={planCountVal}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
          />
        </CommonFullScreenDialog>
      </AppBar>
    </div>
  );
});

export default TopBar;

const SImage = styled.img`
  width: 200px;
  height: 75px;
  cursor: pointer;
`;
