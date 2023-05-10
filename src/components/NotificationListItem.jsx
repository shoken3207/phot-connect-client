import React, { useState } from 'react';
import styled from 'styled-components';
import { NOTIFICATION_TYPE, NO_AVATAR_IMAGE_PATH } from '../const';
import { useRouter } from 'next/router';
import useFetchData from '../hooks/useFetchData';
import { convertPlanImages } from '../utils/convertData';
import CommonDialog from './CommonDialog';
import PlanList from './PlanList';
import useChatFunc from '../hooks/useChatFunc';
import { useUserData } from '../provider/UserDataProvider';
import { getChatDate } from '../utils/dateUtils';

const NotificationListItem = ({
  actorId,
  actorName,
  actorImage,
  actionType,
  contentId,
  contentImage,
  isPlanOrganizer,
  createdAt,
}) => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { fetchPlanFunc } = useFetchData();
  const { readTalksFunc } = useChatFunc();
  const { userData } = useUserData();
  const transitionContent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    switch (actionType) {
      case NOTIFICATION_TYPE.PARTICIPATION_PLAN:
      case NOTIFICATION_TYPE.LEAVE_PLAN:
      case NOTIFICATION_TYPE.EXCEPT_PLAN:
      case NOTIFICATION_TYPE.ACCEPT_PLAN:
      case NOTIFICATION_TYPE.LIKE_PLAN:
      case NOTIFICATION_TYPE.INVITATION_PLAN:
        const plan = await fetchPlanFunc(contentId);
        const convertPlans = await convertPlanImages([plan]);
        setPlans(convertPlans);
        setDialogIsOpen(true);
        break;

      case NOTIFICATION_TYPE.RECEIVE_TALK:
      case NOTIFICATION_TYPE.REACTION_TALK:
        await readTalksFunc({
          talk_room_id: contentId,
          reader_id: userData._id,
        });
        router.push(`/TalkRoom/${contentId}`);
        break;

      case NOTIFICATION_TYPE.ADD_FRIEND:
      case NOTIFICATION_TYPE.LEAVE_FRIEND:
        router.push('/Chat');
        break;

      default:
        break;
    }
  };
  const transitionProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/Profile/${actorId}`);
  };

  let notificationText;
  switch (actionType) {
    case NOTIFICATION_TYPE.ADD_FRIEND:
      notificationText = 'さんがあなたを友達に追加しました。';
      break;
    case NOTIFICATION_TYPE.LEAVE_FRIEND:
      notificationText = 'さんがあなたを友達から外しました。';
      break;
    case NOTIFICATION_TYPE.PARTICIPATION_PLAN:
      if (isPlanOrganizer) {
        notificationText = 'さんがあなたが作成したプランに参加しました。';
      } else {
        notificationText = 'さんがあなたが参加したプランに参加しました。';
      }
      break;
    case NOTIFICATION_TYPE.LEAVE_PLAN:
      if (isPlanOrganizer) {
        notificationText = 'さんがあなたが作成したプランから抜けました。';
      } else {
        notificationText = 'さんがあなたが参加したプランから抜けました。';
      }
      break;
    case NOTIFICATION_TYPE.EXCEPT_PLAN:
      notificationText =
        'さんによって、あなたは参加したプランから外されました。';
      break;
    case NOTIFICATION_TYPE.ACCEPT_PLAN:
      notificationText =
        'さんによって、あなたはプランに参加できるようになりました。';
      break;
    case NOTIFICATION_TYPE.REMOVE_PLAN:
      notificationText =
        'さんによって、あなたが参加しているプランが削除されました。';
      break;
    case NOTIFICATION_TYPE.LIKE_PLAN:
      notificationText =
        'さんがあなたが作成したプランに「いいね！」をしました。';
      break;
    case NOTIFICATION_TYPE.RECEIVE_TALK:
      notificationText = 'さんからトークを受信しました。';
      break;
    case NOTIFICATION_TYPE.REACTION_TALK:
      notificationText = 'さんがあなたのトークにリアクションしました。';
      break;
    case NOTIFICATION_TYPE.INVITATION_PLAN:
      notificationText = 'さんがあなたをプランへ招待しました。';
      break;
    default:
      break;
  }
  return (
    <>
      <SNotificationListItem onClick={(e) => transitionContent(e)}>
        <SActorImage onClick={(e) => transitionProfile(e)}>
          <img src={actorImage || NO_AVATAR_IMAGE_PATH} alt='' />
        </SActorImage>
        <SNotificationText>
          <span>{actorName}</span>
          {notificationText}
          <span>{getChatDate(createdAt)}</span>
        </SNotificationText>
        <SContentImage contentImage={contentImage}>
          <img src={contentImage} alt='' />
        </SContentImage>
      </SNotificationListItem>
      <CommonDialog
        dialogTitle='通知プラン'
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      >
        <PlanList planList={plans} setPlans={setPlans} />
      </CommonDialog>
    </>
  );
};

export default NotificationListItem;

const SNotificationListItem = styled.div`
  padding: 0.4rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #e8e7e6;
  }
`;

const SActorImage = styled.div`
  width: 2.5rem;
  height: 2.5rem;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const SNotificationText = styled.div`
  width: 70%;
  word-break: break-all;

  > span {
    :nth-of-type(1) {
      font-weight: bold;
      font-size: 1.1rem;
    }
    :nth-of-type(2) {
      font-size: 0.8rem;
      color: #a6a4a4;
      display: inline-block;
      margin-left: 0.2rem;
    }
  }
`;

const SContentImage = styled.div`
  width: 3rem;
  height: 3rem;
  opacity: ${(props) => (props.contentImage ? 1 : 0)};
  > img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
`;
