import { Pagination } from '@mui/material';
import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import { MAX_LOAD_PLAN_COUNT } from '../const';
import PlanBox from './PlanBox';
const GridList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 95%;
  margin: 0 auto;
`;

const PlanList = memo(
  ({
    planList,
    setPlans,
    planCountVal = 1,
    currentPageIndex,
    setCurrentPageIndex,
  }) => {
    useEffect(() => {
      window.scroll({ top: 0 });
      // window.scroll({ top: 0, behavior: 'smooth' });
    }, [currentPageIndex]);
    return (
      <div>
        <GridList>
          {planList.map((planItem) => (
            <PlanBox
              key={planItem._id}
              planId={planItem._id}
              organizerIconImage={planItem.organizer_icon_image}
              place={planItem.place}
              prefecture={planItem.prefecture}
              images={planItem.images}
              date={planItem.date}
              deadLine={planItem.dead_line}
              title={planItem.title}
              limit={planItem.limit}
              desc={planItem.desc}
              chipTexts={planItem.tags}
              organizerId={planItem.organizer_id}
              participants={planItem.participants}
              likers={planItem.likers}
              talkRoomId={planItem.talk_room_id}
              blackUsers={planItem.blackUsers}
              invitees={planItem.invitees}
              plans={planList}
              setPlans={setPlans}
            />
          ))}
        </GridList>
        {planCountVal > MAX_LOAD_PLAN_COUNT && (
          <SPaginatonWrapper>
            <Pagination
              count={Math.ceil(planCountVal / MAX_LOAD_PLAN_COUNT)}
              variant='outlined'
              size='large'
              color='primary'
              page={currentPageIndex}
              onChange={(e, value) => setCurrentPageIndex(value)}
            />
          </SPaginatonWrapper>
        )}
      </div>
    );
  }
);

export default PlanList;

const SPaginatonWrapper = styled.div`
  margin: 2rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;
