import React, { memo } from 'react';
import styled from 'styled-components';
import PlanBox from './PlanBox';
const GridList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  width: 95%;
  margin: 0 auto;
  background-color: #e3d7a339;
  justify-content: center;
`;

const PlanList = memo(({ planList, setPlans, fetchType, fetchWord }) => {
  return (
    <GridList>
      {planList.map((planItem) => (
        <PlanBox
          key={planItem._id}
          planId={planItem._id}
          organizerIconImage={planItem.organizerIconImage}
          place={planItem.place}
          prefecture={planItem.prefecture}
          images={planItem.images}
          date={planItem.date}
          title={planItem.title}
          desc={planItem.desc}
          chipTexts={planItem.chipTexts}
          organizerId={planItem.organizerId}
          participants={planItem.participants}
          talkRoomId={planItem.talkRoomId}
          setPlans={setPlans}
          fetchType={fetchType}
          fetchWord={fetchWord}
        />
      ))}
    </GridList>
  );
});

export default PlanList;
