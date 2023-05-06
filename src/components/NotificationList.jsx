import React from 'react';
import NotificationListItem from './NotificationListItem';
import styled from 'styled-components';
import { getChatCompereDate, getChatDispDate } from '../utils/dateUtils';

const NotificationList = ({ notifications }) => {
  return (
    <SNotificationList>
      {notifications.map((notification, index) => (
        <div>
          {index === 0 && (
            <SDispDate>{getChatDispDate(notification.createdAt)}</SDispDate>
          )}

          <NotificationListItem
            key={notification._id}
            actorId={notification.actor_id}
            actorName={notification.actor_name}
            actorImage={notification.actor_image}
            actionType={notification.action_type}
            contentId={notification.content_id}
            contentImage={notification.content_image}
            isPlanOrganizer={notification.is_plan_organizer}
            createdAt={notification.createdAt}
          />
          {index === notifications.length - 1 ||
            (notification.readed !== notifications[index + 1].readed && (
              <SUnreadText>ここから上が未読 ↑</SUnreadText>
            ))}
          {index === notifications.length - 1 ||
            (Number(getChatCompereDate(notification.createdAt)) >
              Number(
                getChatCompereDate(notifications[index + 1].createdAt)
              ) && (
              <>
                <SDispDate>
                  {getChatDispDate(notifications[index + 1].createdAt)}
                </SDispDate>
              </>
            ))}
        </div>
      ))}
    </SNotificationList>
  );
};

const SNotificationList = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 0 auto;
  row-gap: 0.2rem;
  padding: 0.5rem;
`;

const SDispDate = styled.div`
  font-size: 1.1rem;
  font-weight: 550;
  padding: 0 0 0.2rem 0.3rem;
  border-bottom: 1px solid #ccc;
  margin: 1rem 0;
`;

const SUnreadText = styled.div`
  text-align: end;
  padding-right: 1rem;
  margin: 0.3rem 0;
  font-size: 0.7rem;
  color: red;
  border-bottom: red 1px solid;
`;

export default NotificationList;
