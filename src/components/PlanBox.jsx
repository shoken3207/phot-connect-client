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
import { useUserData } from '../provider/UserDataProvider';
import { useRouter } from 'next/router';
import useFetchData from '../hooks/useFetchData';
import useUpdatePlan from '../hooks/useUpdatePlan';
import { getPlanDate } from '../utils/dateUtils';

const PlanBox = ({
  planId,
  place,
  images,
  date,
  title,
  desc,
  prefecture,
  organizerId,
  organizerIconImage,
  participants,
  chipTexts,
  talkRoomId,
  setPlans,
  fetchType,
  fetchWord,
}) => {
  const [readMore, setReadMore] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [descHeight, setDescHeight] = useState(null);
  const [planBackHeight, setPlanBackHeight] = useState(null);
  const planDescRef = useRef(null);
  const planBackRef = useRef(null);
  const { userData } = useUserData();
  const { fetchHomePlans, fetchCreatePlans, fetchPrefecturePlans } =
    useFetchData();
  const { participation, except } = useUpdatePlan();
  const router = useRouter();
  useEffect(() => {
    setDescHeight(planDescRef.current.scrollHeight);
  }, []);
  useEffect(() => {
    if (readMore) {
      setPlanBackHeight(planBackRef.current.offsetHeight);
    } else {
      setPlanBackHeight(null);
    }
  }, [readMore]);
  useEffect(() => {
    if (isFront) {
      setPlanBackHeight(null);
      setReadMore(false);
    }
  }, [isFront]);
  const fetchFunc = async () => {
    let response;
    if (fetchType === 'home') {
      response = await fetchHomePlans(fetchWord);
    } else if (fetchType === 'profile') {
      response = await fetchCreatePlans(fetchWord);
    } else if (fetchType === 'prefecture') {
      response = await fetchPrefecturePlans(fetchWord);
    }
    setPlans(response);
  };
  const participationPlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await participation(planId, talkRoomId, userData._id);
    await fetchFunc();
  };
  const exceptPlan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await except(planId, talkRoomId, userData._id);
    await fetchFunc();
  };
  const readMoreDesc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setReadMore((prev) => !prev);
  };
  return (
    <SPlanBox
      isFront={isFront}
      readMore={readMore}
      planBackHeight={planBackHeight}
      onClick={(e) => console.log(e.target.scrollHeight)}
    >
      <SFront>
        <SFrontHeader>
          <LinkWrap href={`/Profile/${organizerId}`}>
            <div>
              <img src={organizerIconImage} alt='' />
            </div>
          </LinkWrap>
          <div>
            <h3>{title}</h3>
            <p>{prefecture}</p>
          </div>
        </SFrontHeader>
        <SFrontMedia>
          <SwiperBox
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
          >
            {images.map((image) => (
              <SwiperItem key={image}>
                <img src={image} />
              </SwiperItem>
            ))}
          </SwiperBox>
        </SFrontMedia>
        <SFrontFooter>
          <div>
            <p>
              撮影場所: <span>{place}</span>
            </p>
            <p>
              日時: <span>{getPlanDate(date)}</span>
            </p>
          </div>
          <div>
            <CommonButton
              onClick={() => setIsFront((prev) => !prev)}
              variant=''
              startIcon={<LoopIcon />}
            />
            <img src='/images/heart.png' alt='' />
          </div>
        </SFrontFooter>
      </SFront>
      <SBack ref={planBackRef} onClick={() => setIsFront((prev) => !prev)}>
        <SBackContents isFront={isFront} chipTexts={chipTexts} desc={desc}>
          <h2>{title}</h2>
          <SPlanDesc readMore={readMore} descHeight={descHeight}>
            <p ref={planDescRef} dangerouslySetInnerHTML={{ __html: desc }}></p>
            <div onClick={(e) => readMoreDesc(e)}>続きを見る</div>
          </SPlanDesc>
          <div>
            {chipTexts.map((chipText) => (
              <Chip key={chipText} label={chipText} />
            ))}
          </div>
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
            ) : participants.includes(userData._id) ? (
              <CommonButton
                startIcon={<GroupRemoveIcon />}
                text='降りる'
                onClick={(e) => exceptPlan(e)}
                color='error'
              />
            ) : (
              <CommonButton
                startIcon={<GroupAddIcon />}
                onClick={(e) => participationPlan(e)}
                text='参加する'
              />
            )}

            <CommonButton
              color='success'
              disabled={
                !participants.includes(userData._id) &&
                organizerId !== userData._id
              }
              startIcon={<ChatIcon />}
              onClick={(e) =>
                router.push({ pathname: `/TalkRoom/${talkRoomId}` })
              }
              text='チャット'
            />
          </div>
          <h3>参加者: {participants.length}人</h3>
        </SBackContents>
      </SBack>
    </SPlanBox>
  );
};

const SPlanBox = styled.div`
  font-family: 'Noto Sans JP', sans-serif;
  font-family: 'Noto Serif JP', serif;
  font-family: 'Poppins', sans-serif;
  margin-top: 10rem;
  width: 90%;
  position: relative;
  max-width: 300px;
  min-height: 340px;
  height: ${(props) =>
    props.readMore ? props.planBackHeight + 'px' : '340px'};
  overflow: hidden;
  > div {
    width: calc(100% - 9px);
    height: calc(100% - 8px);
    background-color: #fff;
    box-shadow: 9px 8px 14px -10px #777777;
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
      height: ${(props) => (props.readMore ? 'auto' : '100%')};
    }
  }
`;

const SwiperBox = styled(Swiper)`
  width: 100%;
  height: 100%;
`;

const SwiperItem = styled(SwiperSlide)`
  img {
    width: 100%;
    height: 100%;
  }
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
    h3 {
      font-size: 0.8rem;
      font-weight: 700;
    }
    p {
      font-size: 0.6rem;
      color: #8f8e8e;
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
      p {
        font-size: 0.8rem;
        span {
          font-weight: 600;
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

const SBackContents = styled.div`
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  transform-style: preserve-3d;
  transition: transform 0.4s, opacity 0.4s;
  transition-delay: 0.4s;
  transform: perspective(2000px)
    ${(props) => (props.isFront ? 'translateZ(-1000px)' : 'none')};
  opacity: ${(props) => (props.isFront ? 0 : 1)};

  > div {
    &:nth-of-type(2) {
      column-gap: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      row-gap: 0.4rem;
      display: ${(props) => props.chipTexts.length === 0 && 'none'};
    }

    &:nth-of-type(3) {
      display: flex;
      align-items: center;
      column-gap: 1rem;
      justify-content: center;
    }
  }

  > h3 {
    text-align: center;
  }
  > h2 {
    font-size: 1.3rem;
  }
`;

const SPlanDesc = styled.div`
  width: 100%;

  > p {
    font-size: 0.8rem;
    color: #373636;
    display: ${(props) => (props.desc === '' ? 'none' : 'block')};
    height: ${(props) => (props.readMore ? 'auto' : '2.8rem')};
    overflow: hidden;
  }

  > div {
    display: ${(props) => (props.descHeight > 48 ? 'block' : 'none')};
    cursor: pointer;
    text-align: right;
    font-size: 0.7rem;
    color: gray;
  }
`;

export default PlanBox;
