import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ChatIcon from '@mui/icons-material/Chat';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Chip from '@mui/material/Chip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useUserData } from '../provider/UserDataProvider';
import { useRouter } from 'next/router';
import usePlanFunc from '../hooks/usePlanFunc';
import { convertToSaveDate, getPlanDate } from '../utils/dateUtils';
import {
  Button,
  Collapse,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import useChatFunc from '../hooks/useChatFunc';
import CommonMenu from './CommonMenu';
import CommonDialog from './CommonDialog';
import PersonList from './CommonList';
import ConfirmDialog from './ConfirmDialog';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import DeleteIcon from '@mui/icons-material/Delete';
import { CLOSED_PLAN_IMAGE_PATH } from '../const';
import { convertList } from '../utils/convertData';
import { useIsLoadingFlg } from '../provider/IsLoadingFlgProvider';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import {
  isClosedPlanByDeadLine,
  isClosedPlanByDefaultDeadLine,
} from '../utils/planUtils';
import useFetchData from '../hooks/useFetchData';
import { convertToDispDesc } from '../utils/commonUtils';
import { useIsOpenFullScreenDialog } from '../provider/IsOpenFullScreenDialogProvider';

const PlanBox = ({
  planId,
  place,
  images,
  date,
  deadLine,
  title,
  limit,
  desc,
  prefecture,
  organizerId,
  organizerIconImage,
  participants,
  likers,
  blackUsers,
  chipTexts,
  talkRoomId,
  setPlans,
  plans,
  invitees,
}) => {
  const router = useRouter();
  const [likersListIsOpen, setLikersListIsOpen] = useState(false);
  const [participantsListIsOpen, setParticipantsIsOpen] = useState(false);
  const [selectFriendsListIsOpen, setSelectFriendsListIsOpen] = useState(false);
  const [selectInviteesListIsOpen, setSelectInviteesListIsOpen] =
    useState(false);
  const [participantsExceptListIsOpen, setParticipantsExceptIsOpen] =
    useState(false);
  const [participantsAcceptListIsOpen, setParticipantsAcceptIsOpen] =
    useState(false);
  const [closeConfirmDialogIsOpen, setCloseConfirmDialogIsOpen] =
    useState(false);
  const [exceptConfirmDialogIsOpen, setExceptConfirmDialogIsOpen] =
    useState(false);
  const [acceptConfirmDialogIsOpen, setAcceptConfirmDialogIsOpen] =
    useState(false);
  const [deleteConfirmDialogIsOpen, setDeleteConfirmDialogIsOpen] =
    useState(false);
  const [personsArray, setPersonsArray] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectUsers, setSelectUsers] = useState([]);
  const { userData } = useUserData();
  const { readTalksFunc } = useChatFunc();
  const { isLoading } = useIsLoadingFlg();
  const { fetchPlanFunc, fetchUserByIdFunc } = useFetchData();
  const { isOpenFullScreenDialog, setIsOpenFullScreenDialog } =
    useIsOpenFullScreenDialog();
  const {
    participationPlanFunc,
    leavePlanFunc,
    exceptPlanFunc,
    acceptPlanFunc,
    likePlanFunc,
    closePlanFunc,
    deletePlanFunc,
    resumePlanFunc,
    invitationPlanFunc,
    cancelInvitationPlanFunc,
  } = usePlanFunc();
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const isLiked = () => {
    const liker = likers.find((x) => x._id === userData._id);
    return !!liker;
  };
  const isParticipated = (participants) => {
    const participation = participants.find((x) => x._id === userData._id);
    return !!participation;
  };

  useEffect(() => {
    const menuArray = [
      {
        text: 'いいねした人を表示',
        icon: <FavoriteIcon />,
        onClickFunc: (e) => dispLikers(e),
      },
      {
        text: '参加者を表示',
        icon: <EmojiPeopleIcon />,
        onClickFunc: (e) => dispParticipants(e),
      },
    ];

    if (organizerId === userData._id) {
      menuArray.unshift({
        text: 'プランを削除する',
        icon: <DeleteIcon />,
        onClickFunc: (e) => setDeleteConfirmDialogIsOpen(true),
      });
    }

    if (
      organizerId === userData._id &&
      deadLine === '' &&
      isClosedPlanByDefaultDeadLine(date) === false &&
      (limit === 0 || (limit > 0 && limit > participants.length))
    ) {
      menuArray.push({
        text: '募集を締め切る',
        icon: <TimerOffIcon />,
        onClickFunc: (e) => setCloseConfirmDialogIsOpen(true),
      });
    } else if (
      organizerId === userData._id &&
      deadLine !== '' &&
      isClosedPlanByDefaultDeadLine(date) === false &&
      (limit === 0 || (limit > 0 && limit > participants.length))
    ) {
      menuArray.push({
        text: '募集を再開する',
        icon: <MoreTimeIcon />,
        onClickFunc: (e) => resumePlan(e),
      });
    }

    if (organizerId === userData._id && participants.length > 0) {
      menuArray.push({
        text: '参加者を除外する',
        icon: <GroupRemoveIcon />,
        onClickFunc: (e) => dispExceptParticipants(e),
      });
    }
    if (organizerId === userData._id && blackUsers.length > 0) {
      menuArray.push({
        text: 'プランへの参加を許可する',
        icon: <GroupRemoveIcon />,
        onClickFunc: (e) => dispAcceptParticipants(e),
      });
    }
    if (
      organizerId === userData._id &&
      userData.friends.length > 0 &&
      deadLine === '' &&
      isClosedPlanByDefaultDeadLine(date) === false &&
      (limit === 0 || (limit > 0 && limit > participants.length))
    ) {
      menuArray.push({
        text: '友達をプランに招待する',
        icon: <GroupAddIcon />,
        onClickFunc: (e) => dispFriends(e),
      });
    }
    if (organizerId === userData._id && invitees.length > 0) {
      menuArray.push({
        text: 'プランへの招待を取り消す',
        icon: <GroupRemoveIcon />,
        onClickFunc: (e) => dispInvitees(e),
      });
    }
    setMenuList(menuArray);
    if (likersListIsOpen) {
      setPersonsArray(convertList(likers));
    } else if (participantsListIsOpen || participantsExceptListIsOpen) {
      setPersonsArray(convertList(participants));
    } else if (participantsAcceptListIsOpen) {
      setPersonsArray(convertList(blackUsers));
    }
  }, [plans]);

  const dispLikers = () => {
    const convertLikers = convertList(likers);
    setPersonsArray([...convertLikers]);
    setLikersListIsOpen(true);
  };
  const dispParticipants = () => {
    const convertParticipants = convertList(participants);
    setPersonsArray([...convertParticipants]);
    setParticipantsIsOpen(true);
  };
  const dispExceptParticipants = () => {
    const convertParticipants = convertList(participants);
    setPersonsArray([...convertParticipants]);
    setParticipantsExceptIsOpen(true);
  };
  const dispAcceptParticipants = () => {
    const convertBlackUsers = convertList(blackUsers);
    setPersonsArray([...convertBlackUsers]);
    setParticipantsAcceptIsOpen(true);
  };

  const dispFriends = () => {
    const convertFriends = convertList(userData.friends);
    setPersonsArray([...convertFriends]);
    setSelectFriendsListIsOpen(true);
  };

  const dispInvitees = () => {
    const convertInvitees = convertList(invitees);
    setPersonsArray([...convertInvitees]);
    setSelectInviteesListIsOpen(true);
  };

  const invitationPlan = async (e) => {
    e.preventDefault();
    const { success } = await invitationPlanFunc({
      invitee_ids: selectUsers,
      user_id: userData._id,
      plan_id: planId,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      await Promise.all(
        selectUsers.map(async (selectFriend) => {
          const friend = await fetchUserByIdFunc(selectFriend);
          copyPlans[planIndex].invitees.push({
            desc: friend.desc,
            icon_image: friend.icon_image,
            username: friend.username,
            _id: friend._id,
          });
        })
      );
      setPlans(copyPlans);
      closeSelectUserDialog();
    }
  };

  const cancelInvitationPlan = async (e) => {
    e.preventDefault();
    const { success } = await cancelInvitationPlanFunc({
      invitee_ids: selectUsers,
      user_id: userData._id,
      plan_id: planId,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      selectUsers.map((selectFriend) => {
        const inviteeIndex = copyPlans[planIndex].invitees.findIndex(
          (invitee) => invitee._id === selectFriend
        );
        copyPlans[planIndex].invitees.splice(inviteeIndex, 1);
      });
      setPlans(copyPlans);
      closeSelectUserDialog();
    }
  };

  const closeSelectUserDialog = () => {
    setSelectUsers([]);
    setSelectFriendsListIsOpen(false);
    setSelectInviteesListIsOpen(false);
  };

  const deletePlan = async (e) => {
    e.preventDefault();
    const { success } = await deletePlanFunc({
      plan_id: planId,
      user_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      copyPlans.splice(planIndex, 1);
      setPlans(copyPlans);
    }
  };

  const closePlan = async (e) => {
    e.preventDefault();
    const { success } = await closePlanFunc({
      plan_id: planId,
      user_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      const nowDate = new Date();
      copyPlans[planIndex].dead_line = convertToSaveDate(nowDate);
      copyPlans[planIndex].images.unshift(CLOSED_PLAN_IMAGE_PATH);
      setPlans(copyPlans);
    }
  };

  const resumePlan = async (e) => {
    e.preventDefault();
    const { success } = await resumePlanFunc({
      plan_id: planId,
      user_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      copyPlans[planIndex].dead_line = '';
      copyPlans[planIndex].images.splice(0, 1);
      setPlans(copyPlans);
    }
  };

  const likePlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { success } = await likePlanFunc({
      plan_id: planId,
      liker_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      const likerIndex = copyPlans[planIndex].likers.findIndex(
        (liker) => liker._id === userData._id
      );
      if (likerIndex === -1) {
        copyPlans[planIndex].likers.push({
          desc: userData.desc,
          icon_image: userData.icon_image,
          username: userData.username,
          _id: userData._id,
        });
      } else {
        copyPlans[planIndex].likers.splice(likerIndex, 1);
      }
      setPlans(copyPlans);
    }
  };

  const participationPlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { success } = await participationPlanFunc({
      plan_id: planId,
      user_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      copyPlans[planIndex].participants.push({
        desc: userData.desc,
        icon_image: userData.icon_image,
        username: userData.username,
        _id: userData._id,
      });
      if (
        copyPlans[planIndex].limit > 0 &&
        copyPlans[planIndex].limit === copyPlans[planIndex].participants.length
      ) {
        copyPlans[planIndex].images.unshift(CLOSED_PLAN_IMAGE_PATH);
      }
      setPlans(copyPlans);
    }
  };

  const leavePlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { success } = await leavePlanFunc({
      plan_id: planId,
      user_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      const participantIndex = copyPlans[planIndex].participants.findIndex(
        (participant) => participant._id === userData._id
      );
      copyPlans[planIndex].participants.splice(participantIndex, 1);
      if (
        copyPlans[planIndex].limit > 0 &&
        copyPlans[planIndex].limit ===
          copyPlans[planIndex].participants.length + 1
      ) {
        copyPlans[planIndex].images.splice(0, 1);
      }
      setPlans(copyPlans);
    }
  };

  const selectExceptUser = (e, participantId) => {
    e.preventDefault();
    setSelectUserId(participantId);
    setExceptConfirmDialogIsOpen(true);
  };

  const selectAcceptUser = (e, blackUserId) => {
    e.preventDefault();
    setSelectUserId(blackUserId);
    setAcceptConfirmDialogIsOpen(true);
  };
  const selectUser = (user) => {
    const selectUserIndex = selectUsers.findIndex((x) => x === user);
    if (selectUserIndex === -1) {
      setSelectUsers((prev) => [...prev, user]);
    } else {
      const copySelectUsers = [...selectUsers];
      copySelectUsers.splice(selectUserIndex, 1);
      setSelectUsers(copySelectUsers);
    }
  };

  const exceptPlan = async (e, participantId) => {
    e.preventDefault();
    e.stopPropagation();
    const { success } = await exceptPlanFunc({
      plan_id: planId,
      user_id: participantId,
      organizer_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      const participantIndex = copyPlans[planIndex].participants.findIndex(
        (participant) => participant._id === participantId
      );
      const user = copyPlans[planIndex].participants.splice(
        participantIndex,
        1
      )[0];
      const { desc, icon_image, username, _id } = user;
      copyPlans[planIndex].blackUsers.push({
        _id,
        username,
        icon_image,
        desc,
      });
      if (
        copyPlans[planIndex].limit > 0 &&
        copyPlans[planIndex].limit ===
          copyPlans[planIndex].participants.length + 1
      ) {
        copyPlans[planIndex].images.splice(0, 1);
      }
      setPlans(copyPlans);
      setSelectUserId(null);
    }
  };

  const acceptPlan = async (e, blackUserId) => {
    e.preventDefault();
    e.stopPropagation();
    const { success } = await acceptPlanFunc({
      plan_id: planId,
      user_id: blackUserId,
      organizer_id: userData._id,
    });
    if (success) {
      const copyPlans = [...plans];
      const planIndex = copyPlans.findIndex((plan) => plan._id === planId);
      const blackUserIndex = copyPlans[planIndex].blackUsers.findIndex(
        (blackUser) => blackUser._id === blackUserId
      );
      copyPlans[planIndex].blackUsers.splice(blackUserIndex, 1);
      setPlans(copyPlans);
      setSelectUserId(null);
    }
  };

  const tagClick = (e, chipText) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('isOpenFullScreenDialog: ', isOpenFullScreenDialog);
    if (isOpenFullScreenDialog) {
      setIsOpenFullScreenDialog(null);
    }
    router.push({
      pathname: '/Search',
      query: { searchCategory: 'tag', tag: chipText },
    });
  };

  const prefectureClick = (e, prefecture) => {
    e.preventDefault();
    e.stopPropagation();
    router.push({
      pathname: '/Search',
      query: { searchCategory: 'prefecture', prefecture: prefecture },
    });
  };

  const transitionTalkRoom = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const plan = await fetchPlanFunc(planId);
    if (
      plan.organizer_id !== userData._id &&
      !isParticipated(plan.participants)
    ) {
      setSnackbarInfo({
        text: 'あなたは、プランの作成者に追放されました。',
        severity: 'warning',
      });
      setSnackbarIsShow(true);

      return;
    }

    await readTalksFunc({ talk_room_id: talkRoomId, reader_id: userData._id });
    router.push({ pathname: `/TalkRoom/${talkRoomId}` });
  };

  return (
    <>
      <SPlanBox isLoading={isLoading} isExpanded={isExpanded}>
        <SPlanBoxHeader>
          <div>
            <div onClick={() => router.push(`/Profile/${organizerId}`)}>
              <img src={organizerIconImage || '/images/noAvatar.png'} alt='' />
            </div>
            <div>
              <h3>{title}</h3>
              <Tooltip title='県で検索'>
                <h4 onClick={(e) => prefectureClick(e, prefecture)}>
                  {prefecture}
                </h4>
              </Tooltip>
            </div>
          </div>
          <CommonMenu menuArray={menuList} />
        </SPlanBoxHeader>
        <SwiperBox
          grabCursor={true}
          spaceBetween={0}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <img style={{ width: '100%', height: '100%' }} src={image} />
            </SwiperSlide>
          ))}
        </SwiperBox>
        <SPlanBoxFooter isExpanded={isExpanded}>
          <div>
            <p>
              <span>撮影場所:</span>
              <span>{place}</span>
            </p>
            <p>
              <span>日時:</span> <span>{getPlanDate(date)}</span>
            </p>

            {limit === 0 ? (
              <p>
                <span>参加者:</span>
                <span>{`${participants.length}人`}</span>
              </p>
            ) : participants.length === limit ? (
              <p>
                <span>参加人数が上限に達しました</span>
              </p>
            ) : (
              <p>
                <span>{`募集人数は、残り${
                  limit - participants.length
                }人です`}</span>
              </p>
            )}
          </div>
          <div>
            <div>
              {(isParticipated(participants) ||
                organizerId === userData._id) && (
                <Tooltip title='チャットに遷移'>
                  <IconButton
                    style={{ padding: '0' }}
                    onClick={(e) => transitionTalkRoom(e)}
                  >
                    <ChatIcon color='success' style={{ fontSize: '2rem' }} />
                  </IconButton>
                </Tooltip>
              )}

              {organizerId === userData._id ? (
                <Tooltip title='プランを編集'>
                  <span>
                    <IconButton
                      style={{ padding: '0' }}
                      disabled={
                        (limit > 0 && limit <= participants.length) ||
                        deadLine === ''
                          ? isClosedPlanByDefaultDeadLine(date)
                          : isClosedPlanByDeadLine(deadLine)
                      }
                      onClick={() =>
                        router.push({
                          pathname: '/EditPlan',
                          query: { planId },
                        })
                      }
                    >
                      <ModeEditIcon
                        color='secondary'
                        style={{ fontSize: '2rem' }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : isParticipated(participants) ? (
                <Tooltip title='プランから抜ける'>
                  <IconButton
                    style={{ padding: '0' }}
                    onClick={(e) => leavePlan(e)}
                  >
                    <GroupRemoveIcon
                      color='error'
                      style={{ fontSize: '2rem' }}
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title='プランに参加'>
                  <span>
                    <IconButton
                      color='primary'
                      style={{ padding: '0' }}
                      disabled={
                        (limit > 0 && limit <= participants.length) ||
                        deadLine === ''
                          ? isClosedPlanByDefaultDeadLine(date)
                          : isClosedPlanByDeadLine(deadLine)
                      }
                      onClick={(e) => participationPlan(e)}
                    >
                      <GroupAddIcon style={{ fontSize: '2rem' }} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {isLiked() ? (
                <IconButton
                  style={{ padding: '0' }}
                  color='error'
                  onClick={(e) => likePlan(e)}
                >
                  <FavoriteIcon style={{ fontSize: '2rem' }} />
                </IconButton>
              ) : (
                <IconButton
                  style={{ padding: '0' }}
                  color='error'
                  onClick={(e) => likePlan(e)}
                >
                  <FavoriteBorderIcon style={{ fontSize: '2rem' }} />
                </IconButton>
              )}
            </div>
            {(desc || chipTexts.length > 0) && (
              <div>
                <Tooltip title='もっと見る'>
                  <IconButton
                    style={{ padding: '0' }}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <ExpandMoreIcon style={{ fontSize: '36px' }} />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </SPlanBoxFooter>
        {(desc || chipTexts.length > 0) && (
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <SExpandContainer isExpanded={isExpanded}>
              <p
                dangerouslySetInnerHTML={{
                  __html: desc && convertToDispDesc(desc),
                }}
              ></p>
              <SChipTexts chipTexts={chipTexts}>
                {chipTexts.map((chipText) => (
                  <Tooltip key={chipText} title='タグで検索'>
                    <Chip
                      label={chipText}
                      onClick={(e) => tagClick(e, chipText)}
                    />
                  </Tooltip>
                ))}
              </SChipTexts>
            </SExpandContainer>
          </Collapse>
        )}
      </SPlanBox>
      <CommonDialog
        dialogTitle='いいねした人を表示'
        isOpen={likersListIsOpen}
        setIsOpen={setLikersListIsOpen}
      >
        <PersonList listData={personsArray} pagePath='/Profile' />
      </CommonDialog>
      <CommonDialog
        dialogTitle='プランの参加者を表示'
        isOpen={participantsListIsOpen}
        setIsOpen={setParticipantsIsOpen}
      >
        <PersonList listData={personsArray} pagePath='/Profile' />
      </CommonDialog>
      <CommonDialog
        dialogTitle='参加者をプランから除外'
        isOpen={participantsExceptListIsOpen}
        setIsOpen={setParticipantsExceptIsOpen}
      >
        <PersonList
          listData={personsArray}
          pagePath='/Profile'
          participants={participants}
          onClick={(e, participantId) => selectExceptUser(e, participantId)}
          withActionButton
          except
        />
      </CommonDialog>
      <CommonDialog
        dialogTitle='ブラックリストから除去'
        isOpen={participantsAcceptListIsOpen}
        setIsOpen={setParticipantsAcceptIsOpen}
      >
        <PersonList
          listData={personsArray}
          pagePath='/Profile'
          participants={participants}
          onClick={(e, blackUserId) => selectAcceptUser(e, blackUserId)}
          withActionButton
          accept
        />
      </CommonDialog>
      <CommonDialog
        dialogTitle='招待する友達を選択'
        isOpen={selectFriendsListIsOpen}
        setIsOpen={setSelectFriendsListIsOpen}
        setList={setSelectUsers}
      >
        <PersonList
          listData={personsArray}
          pagePath='/Profile'
          onChange={(friend) => selectUser(friend)}
          withActionButton
          selectUsers={selectUsers}
          invitees={invitees}
          blackUsers={blackUsers}
          participants={participants}
        />
        <DialogActions>
          <Button color='error' onClick={() => closeSelectUserDialog()}>
            キャンセル
          </Button>
          <Button color='primary' onClick={(e) => invitationPlan(e)} autoFocus>
            招待する
          </Button>
        </DialogActions>
      </CommonDialog>
      <CommonDialog
        dialogTitle='招待をキャンセルするユーザを選択'
        isOpen={selectInviteesListIsOpen}
        setIsOpen={setSelectInviteesListIsOpen}
        setList={setSelectUsers}
      >
        <PersonList
          listData={personsArray}
          pagePath='/Profile'
          onChange={(invitee) => selectUser(invitee)}
          withActionButton
          selectUsers={selectUsers}
        />
        <DialogActions>
          <Button color='error' onClick={() => closeSelectUserDialog()}>
            キャンセル
          </Button>
          <Button
            color='primary'
            onClick={(e) => cancelInvitationPlan(e)}
            autoFocus
          >
            招待を取り消す
          </Button>
        </DialogActions>
      </CommonDialog>
      <ConfirmDialog
        isOpen={closeConfirmDialogIsOpen}
        setIsOpen={setCloseConfirmDialogIsOpen}
        primaryText='本当にプランの参加者募集を締め切りますか？'
        secondaryText='募集を締め切ると、他の人はこのプランに参加できなくなります。'
        onClick={(e) => closePlan(e)}
      />
      <ConfirmDialog
        isOpen={exceptConfirmDialogIsOpen}
        setIsOpen={setExceptConfirmDialogIsOpen}
        primaryText='本当にこのユーザーをプランから除外しますか？'
        secondaryText='除外すると、このユーザーの意思でプランに参加できなくなります。'
        onClick={(e) => exceptPlan(e, selectUserId)}
      />
      <ConfirmDialog
        isOpen={acceptConfirmDialogIsOpen}
        setIsOpen={setAcceptConfirmDialogIsOpen}
        primaryText='本当にこのユーザーがプランに参加するのを許可しますか？'
        secondaryText='除外したユーザーが自分の意志でプランに参加できるようになります。'
        onClick={(e) => acceptPlan(e, selectUserId)}
      />
      <ConfirmDialog
        isOpen={deleteConfirmDialogIsOpen}
        setIsOpen={setDeleteConfirmDialogIsOpen}
        primaryText='本当にこのプランを削除しますか？'
        secondaryText='このプランを削除すると、チャット履歴も削除されます。'
        onClick={(e) => deletePlan(e)}
      />
    </>
  );
};

const SPlanBox = styled.div`
  opacity: ${(props) => (props.isLoading ? 0 : 1)};
  transform: ${(props) => (props.isLoading ? 'translateY(30px)' : 'none')};
  overflow: hidden;
  width: 95%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 9px 8px 14px -10px #777777;
`;
const SwiperBox = styled(Swiper)`
  width: 100%;
  aspect-ratio: 1.4/1;
`;

const SPlanBoxHeader = styled.div`
  padding: 0.35rem 0.4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      column-gap: 0.9rem;
      width: 88%;

      > div {
        &:nth-of-type(1) {
          width: 14%;
          aspect-ratio: 1/1;
          cursor: pointer;

          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }

        &:nth-of-type(2) {
          width: 78%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          column-gap: 0.2rem;

          > h3 {
            font-size: 1rem;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          > h4 {
            font-size: 0.8rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #bfbcbc;
            cursor: pointer;
          }
        }
      }
    }
  }
`;

const SPlanBoxFooter = styled.div`
  width: 100%;
  padding: 0.3rem 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  > div {
    &:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      row-gap: 0.2rem;
      width: 65%;

      > p {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        column-gap: 0.25rem;
        width: 100%;
        white-space: nowrap;
        font-size: 0.95rem;
        > span {
          &:nth-of-type(1) {
            font-weight: bold;
          }
          &:nth-of-type(2) {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    &:nth-of-type(2) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      row-gap: 0.2rem;

      > div {
        &:nth-of-type(1) {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          column-gap: 0.6rem;
        }
        &:nth-of-type(2) {
          margin-right: -0.4rem;
          transform: ${(props) =>
            props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
          transition: transform 0.3s;
        }
      }
    }
  }
`;

const SExpandContainer = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem 0.6rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.8rem;
  transition: transform 0.2s;
  transform: ${(props) =>
    props.isExpanded === 'translateY(0)' && 'translateY(-100%)'};
`;

const SChipTexts = styled.div`
  column-gap: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.4rem;
  display: ${(props) => props.chipTexts.length === 0 && 'none'};
`;

export default PlanBox;
