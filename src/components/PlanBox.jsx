import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CommonButton from './CommonButton';
import LinkWrap from './LinkWrap';
import LoopIcon from '@mui/icons-material/Loop';
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
import { Button, DialogActions, IconButton, Tooltip } from '@mui/material';
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
  const [readMore, setReadMore] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [contentsHeight, setContentsHeight] = useState(null);
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
  const [menuList, setMenuList] = useState([]);
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectUsers, setSelectUsers] = useState([]);
  const planBackContentsRef = useRef(null);
  const planBackRef = useRef(null);
  const { userData } = useUserData();
  const { readTalksFunc } = useChatFunc();
  const { isLoading } = useIsLoadingFlg();
  const { fetchPlanFunc, fetchUserByIdFunc } = useFetchData();
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
      menuArray.push({
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
    setContentsHeight(planBackContentsRef.current.scrollHeight);
  }, [plans]);

  useEffect(() => {
    if (isFront) {
      setReadMore(false);
    }
  }, [isFront]);

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

  const readMoreContents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setReadMore((prev) => !prev);
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
    <SPlanBox
      isFront={isFront}
      readMore={readMore}
      contentsHeight={contentsHeight}
      isLoading={isLoading}
    >
      <SFront>
        <SFrontHeader>
          <div>
            <LinkWrap href={`/Profile/${organizerId}`}>
              <div>
                <img
                  src={organizerIconImage || '/images/noAvatar.png'}
                  alt=''
                />
              </div>
            </LinkWrap>
            <div>
              <h3>{title}</h3>
              <Tooltip title='県で検索'>
                <p onClick={(e) => prefectureClick(e, prefecture)}>
                  {prefecture}
                </p>
              </Tooltip>
            </div>
          </div>
          <CommonMenu menuArray={menuList} />
        </SFrontHeader>
        <SFrontMedia>
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
        </SFrontMedia>
        <SFrontFooter>
          <div>
            <p>
              <span>撮影場所:</span> <span>{place}</span>
            </p>
            <p>
              <span>日時:</span> <span>{getPlanDate(date)}</span>
            </p>
          </div>
          <div>
            <Tooltip title='詳細をみる'>
              <IconButton
                color='inherit'
                onClick={() => setIsFront((prev) => !prev)}
              >
                <LoopIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
            {isLiked() ? (
              <IconButton color='error' onClick={(e) => likePlan(e)}>
                <FavoriteIcon fontSize='large' />
              </IconButton>
            ) : (
              <IconButton color='error' onClick={(e) => likePlan(e)}>
                <FavoriteBorderIcon fontSize='large' />
              </IconButton>
            )}
          </div>
        </SFrontFooter>
      </SFront>
      <SBack ref={planBackRef} onClick={() => setIsFront((prev) => !prev)}>
        <SBackWrapper
          isFront={isFront}
          chipTexts={chipTexts}
          desc={desc}
          limit={limit}
          participants={participants}
        >
          <SBackContents
            chipTexts={chipTexts}
            desc={desc}
            readMore={readMore}
            contentsHeight={contentsHeight}
            ref={planBackContentsRef}
          >
            <div>
              <h2>{title}</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: desc && convertToDispDesc(desc),
                }}
              ></p>
              <div>
                {chipTexts.map((chipText) => (
                  <Tooltip key={chipText} title='タグで検索'>
                    <Chip
                      label={chipText}
                      onClick={(e) => tagClick(e, chipText)}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
            <div onClick={(e) => readMoreContents(e)}>
              <Tooltip title='もっと見る'>
                <IconButton>
                  <ExpandMoreIcon fontSize='large' />
                </IconButton>
              </Tooltip>
            </div>
          </SBackContents>
          <div>
            {organizerId === userData._id ? (
              <CommonButton
                color='secondary'
                startIcon={<ModeEditIcon />}
                text='編集'
                onClick={() =>
                  router.push({ pathname: '/EditPlan', query: { planId } })
                }
              />
            ) : isParticipated(participants) ? (
              <CommonButton
                startIcon={<GroupRemoveIcon />}
                text='降りる'
                onClick={(e) => leavePlan(e)}
                color='error'
              />
            ) : (
              <CommonButton
                startIcon={<GroupAddIcon />}
                onClick={(e) => participationPlan(e)}
                text='参加する'
                disabled={
                  (limit > 0 && limit <= participants.length) || deadLine === ''
                    ? isClosedPlanByDefaultDeadLine(date)
                    : isClosedPlanByDeadLine(deadLine)
                }
              />
            )}
            <CommonButton
              color='success'
              disabled={
                !isParticipated(participants) && organizerId !== userData._id
              }
              startIcon={<ChatIcon />}
              onClick={(e) => transitionTalkRoom(e)}
              text='チャット'
            />
          </div>
          <h3>
            {limit === 0
              ? `参加者: ${participants.length}人`
              : participants.length === limit
              ? '参加人数が上限に達しました'
              : `募集人数は、残り${limit - participants.length}人です`}
          </h3>
        </SBackWrapper>
      </SBack>
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
    </SPlanBox>
  );
};

const SPlanBox = styled.div`
  --box-shadow-right: 9px;
  --box-shadow-bottom: 8px;
  opacity: ${(props) => (props.isLoading ? 0 : 1)};
  transform: ${(props) => (props.isLoading ? 'translateY(30px)' : 'none')};
  font-family: 'Noto Sans JP', sans-serif;
  font-family: 'Noto Serif JP', serif;
  font-family: 'Poppins', sans-serif;
  margin-top: 2rem;
  position: relative;
  width: 300px;
  height: ${(props) =>
    !props.isFront && props.readMore
      ? `calc(152px + ${props.contentsHeight}px)`
      : '340px'};
  transition: height 0.3s ease-in-out, opacity 0.5s, transform 0.5s;
  overflow: hidden;

  > div {
    box-shadow: 9px 8px 14px -10px #777777;
    width: calc(100% - var(--box-shadow-right));
    height: calc(100% - var(--box-shadow-bottom));
    background-color: #fff;
    border-radius: 10px;
    transition: all 0.4s cubic-bezier(0.12, 0, 0.39, 0);
    position: absolute;
    top: 0;
    left: 0;
    &:nth-of-type(1) {
    }
    &:nth-of-type(2) {
      z-index: 2;
      transform: ${(props) => (props.isFront ? 'translateY(-110%)' : 'none')};
      pointer-events: ${(props) => (props.isFront ? 'none' : 'auto')};
      height: ${(props) => props.readMore && 'auto'};
    }
  }
`;

const SwiperBox = styled(Swiper)`
  width: 100%;
  height: 100%;
`;

const SFront = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SFrontHeader = styled.div`
  padding: 0.3rem 0.4rem;
  height: 13%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    height: 100%;
    &:nth-of-type(1) {
      width: 100%;
      display: flex;
      align-items: center;
      column-gap: 1.2rem;
      > a div {
        width: 2.4rem;
        height: 2.4rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 75%;
        overflow-x: hidden;
        h3 {
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }
        p {
          cursor: pointer;
          font-size: 0.6rem;
          color: #8f8e8e;
        }
      }
    }
    &:nth-of-type(2) {
    }
  }
`;

const SFrontMedia = styled.div`
  height: 70%;
  > img {
    width: 100%;
    height: 100%;
  }
`;

const SFrontFooter = styled.div`
  height: 13%;
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & div {
    &:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 70%;
      p {
        width: 100%;
        font-size: 0.8rem;
        display: flex;
        column-gap: 0.4rem;
        align-items: center;
        span {
          &:nth-of-type(1) {
            font-weight: 600;
          }
          &:nth-of-type(2) {
            overflow-x: hidden;
            white-space: nowrap;
            width: 65%;
          }
        }
      }
    }
    &:nth-of-type(2) {
      display: flex;
      align-items: center;
    }
  }
`;

const SBack = styled.div`
  border: 3px solid skyblue;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SBackWrapper = styled.div`
  width: 100%;
  padding: 1.2rem 1rem 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  row-gap: 1.4rem;
  transform-style: preserve-3d;
  transition: transform 0.4s, opacity 0.4s;
  transition-delay: 0.4s;
  transform: perspective(2000px)
    ${(props) => (props.isFront ? 'translateZ(-1000px)' : 'none')};
  opacity: ${(props) => (props.isFront ? 0 : 1)};

  > div {
    &:nth-of-type(1) {
    }

    &:nth-of-type(2) {
      display: flex;
      align-items: center;
      column-gap: 1rem;
      justify-content: center;
    }
  }

  > h3 {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 550;
    color: ${(props) =>
      props.limit > 0 && props.limit <= props.participants.length
        ? 'red'
        : 'black'};
  }
`;

const SBackContents = styled.div`
  width: 100%;
  min-height: 11rem;
  overflow: hidden;
  height: ${(props) =>
    props.readMore ? `${props.contentsHeight}px` : '11rem'};
  transition: height 0.3s ease-in-out;
  position: relative;

  > div {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    &:nth-of-type(1) {
      opacity: ${(props) =>
        props.contentsHeight > 176 && !props.readMore ? '.6' : '1'};
      > h2 {
        font-size: 1.3rem;
        word-break: break-all;
      }

      > p {
        font-size: 0.8rem;
        word-break: break-all;
        color: #373636;
        display: ${(props) => (props.desc === '' ? 'none' : 'block')};
      }
      > div {
        column-gap: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        row-gap: 0.4rem;
        display: ${(props) => props.chipTexts.length === 0 && 'none'};
      }
    }
    &:nth-of-type(2) {
      position: absolute;
      right: 0;
      bottom: -15px;
      display: ${(props) => (props.contentsHeight > 176 ? 'block' : 'none')};
      transform: ${(props) => (props.readMore ? 'rotate(180deg)' : 'none')};
      transition: transform 0.3s;
    }
  }
`;

export default PlanBox;
