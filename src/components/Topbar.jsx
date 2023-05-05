import * as React from 'react';
import { memo, useState, useEffect } from 'react';
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
import CommonDialog from './CommonDialog';
import PlanList from './PlanList';
import useFetchData from '../hooks/useFetchData';
import { MAX_LOAD_PLAN_COUNT } from '../const';
const TopBar = memo(({ setIsOpen }) => {
  const router = useRouter();
  const { userData, setUserData } = useUserData();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [planCountVal, setPlanCountVal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [menuList, setMenuList] = useState([]);
  const { fetchLikedPlansFunc, fetchParticipatedPlansFunc } = useFetchData();
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
    if (!dialogIsOpen) {
      setCurrentPageIndex(1);
    }
  }, [dialogIsOpen]);

  const transitionProfilePage = (e) => {
    e.preventDefault();
    router.push(`/Profile/${userData._id}`);
  };

  const dispLikedPlan = async (e) => {
    e.preventDefault();
    const { plans: likedPlans, planCount } = await fetchLikedPlansFunc(
      userData._id,
      MAX_LOAD_PLAN_COUNT * (currentPageIndex - 1),
      MAX_LOAD_PLAN_COUNT
    );
    if (likedPlans.length > 0) {
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
    <AppBar color='inherit' position='fixed' sx={appBarStyle}>
      <Toolbar>
        <>
          {!!userData._id &&
          (basePath === 'TalkRoom' || basePath === 'Profile') ? (
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
              <Tooltip title='通知'>
                <IconButton>
                  <Badge badgeContent={17} color='secondary'>
                    <NotificationsIcon fontSize='large' />
                  </Badge>
                </IconButton>
              </Tooltip>
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

      <CommonDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        dialogTitle='あなたが「いいね！」したプランです。'
      >
        <PlanList
          planList={plans}
          setPlans={setPlans}
          planCountVal={planCountVal}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
        />
      </CommonDialog>
    </AppBar>
  );
});

export default TopBar;

const SImage = styled.img`
  width: 200px;
  height: 75px;
  cursor: pointer;
`;
