import React, { forwardRef, memo, useState, useEffect } from 'react';
import LinkWrap from './LinkWrap';
import styled from 'styled-components';
import { getChatDate } from '../utils/dateUtils';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonMenu from './CommonMenu';
import { ReactionBarSelector } from '@charkour/react-reactions';
import {
  AVATAR_COLOR,
  MAX_DISP_REACTION_AVATAR_COUNT,
  REACTIONS,
  REACTION_AVATAR_ICONS,
  SMALL_REACTION_AVATAR_ICONS,
} from '../const';
import CommonDialog from './CommonDialog';
import useChatFunc from '../hooks/useChatFunc';
import { useUserData } from '../provider/UserDataProvider';
import PersonList from './CommonList';
import ConfirmDialog from './ConfirmDialog';
import { Avatar, AvatarGroup } from '@mui/material';

const Message = memo(
  forwardRef(
    (
      {
        senderIconImage,
        senderId,
        message,
        image,
        isSender,
        createdAt,
        readCount,
        reactors,
        isGroupTalkRoom,
        chatContainerRef,
        talkId,
        talks,
        setTalks,
      },
      ref
    ) => {
      const [reactionBarIsOpen, setReactionBarIsOpen] = useState(false);
      const [reactorsListIsOpen, setReactorsListIsOpen] = useState(false);
      const [reactorsArray, setReactorsArray] = useState([]);
      const [menuList, setMenuList] = useState([]);
      const [deleteTalkConfirmDialogIsOpen, setDeleteTalkConfirmDialogIsOpen] =
        useState(false);
      const { reactionTalkFunc, deleteTalkFunc, removeTalkReactionFunc } =
        useChatFunc();
      const { userData } = useUserData();
      const isReactioned = (userId) => {
        const reactor = reactors.find((x) => x._id === userId);
        return !!reactor;
      };

      useEffect(() => {
        const menuArray = [
          {
            text: 'リアクションした人を見る',
            icon: <SentimentVerySatisfiedIcon />,
            onClickFunc: (e) => dispReactors(e),
          },
          ,
        ];
        const talkIndex = talks.findIndex((x) => x._id === talkId);
        if (userData._id === senderId) {
          menuArray.push({
            text: 'トークを削除する',
            icon: <DeleteIcon />,
            onClickFunc: () => setDeleteTalkConfirmDialogIsOpen(true),
          });
        }
        if (userData._id !== senderId && !isReactioned(userData._id)) {
          menuArray.unshift({
            text: 'トークにリアクションする',
            icon: <AddReactionIcon />,
            onClickFunc: (e) => setReactionBarIsOpen(true),
          });
        }
        setMenuList(menuArray);
        const result = convertReactors(talks[talkIndex].reactors);
        setReactorsArray(result);
      }, [talks]);

      const convertReactors = (reactors) => {
        const convertResult = reactors.map((x) => {
          return {
            primaryText: x.username || 'unknown',
            secondaryText: (
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  marginLeft: 3,
                  bgcolor: AVATAR_COLOR[x.reaction_type],
                }}
              >
                {REACTION_AVATAR_ICONS[x.reaction_type]}
              </Avatar>
            ),
            iconImage: x.icon_image,
            id: x._id,
          };
        });
        return convertResult;
      };

      const dispReactors = () => {
        const result = convertReactors(reactors);
        setReactorsArray([...result]);
        setReactorsListIsOpen(true);
      };

      const reactionTalk = async (reaction) => {
        const { success } = await reactionTalkFunc({
          talk_id: talkId,
          reactor_id: userData._id,
          reaction_type: reaction,
        });
        if (success) {
          const copyTalks = [...talks];
          const talkIndex = talks.findIndex((x) => x._id === talkId);
          copyTalks[talkIndex].reactors.push({
            _id: userData._id,
            icon_image: userData.iconImage,
            username: userData.username,
            desc: userData.desc,
            reaction_type: reaction,
          });
          setTalks(copyTalks);
        }
        setReactionBarIsOpen(false);
      };

      const removeTalkReaction = async (e, reactorId) => {
        e.preventDefault();

        const { success } = await removeTalkReactionFunc({
          talk_id: talkId,
          reactor_id: reactorId,
          user_id: userData._id,
        });
        if (success) {
          const copyTalks = [...talks];
          const talkIndex = copyTalks.findIndex((x) => x._id === talkId);
          const reactorIndex = copyTalks[talkIndex].reactors.findIndex(
            (x) => x._id === reactorId
          );
          copyTalks[talkIndex].reactors.splice(reactorIndex, 1);
          setTalks(copyTalks);
        }
      };

      const deleteTalk = async () => {
        const { success } = await deleteTalkFunc({
          talk_id: talkId,
          user_id: userData._id,
        });
        if (success) {
          const copyTalks = [...talks];
          const talkIndex = talks.findIndex((x) => x._id === talkId);
          copyTalks.splice(talkIndex, 1);
          setTalks(copyTalks);
        }
      };
      return (
        <SMessageWrap isSender={isSender} ref={ref}>
          <SMessageIcon isSender={isSender} senderIconImage={senderIconImage}>
            <LinkWrap href={`/Profile/${senderId}`}>
              <img
                src={senderIconImage || '/images/noAvatar.png'}
                alt='avatarImage'
              />
            </LinkWrap>
          </SMessageIcon>
          <SMessageContent
            isSender={isSender}
            image={image}
            chatWidth={chatContainerRef.current?.clientWidth}
          >
            <div>
              <SMessage
                message={message}
                isSender={isSender}
                dangerouslySetInnerHTML={{ __html: message }}
              ></SMessage>
              <SImage image={image}>
                <img src={image} />
              </SImage>
              <SSendInfo isSender={isSender}>
                <div>
                  <p>
                    {isGroupTalkRoom
                      ? isSender && readCount > 0 && `既読${readCount}`
                      : isSender && readCount === 1 && '既読'}
                  </p>
                  <p>{getChatDate(createdAt)}</p>
                </div>
                <CommonMenu iconSize='small' menuArray={menuList} />
              </SSendInfo>
            </div>
            <div>
              <AvatarGroup max={MAX_DISP_REACTION_AVATAR_COUNT}>
                {reactors.map((reactor) => (
                  <Avatar
                    key={reactor._id}
                    sx={{
                      width: 22,
                      height: 22,
                      bgcolor: AVATAR_COLOR[reactor.reaction_type],
                    }}
                  >
                    {SMALL_REACTION_AVATAR_ICONS[reactor.reaction_type]}
                  </Avatar>
                ))}
              </AvatarGroup>
            </div>
          </SMessageContent>
          <CommonDialog
            dialogTitle='リアクションを選択'
            isOpen={reactionBarIsOpen}
            setIsOpen={setReactionBarIsOpen}
          >
            <ReactionBarSelector
              iconSize='28px'
              reactions={REACTIONS}
              onSelect={(reaction) => reactionTalk(reaction)}
            />
          </CommonDialog>
          <CommonDialog
            dialogTitle='トークへのリアクションを表示'
            isOpen={reactorsListIsOpen}
            setIsOpen={setReactorsListIsOpen}
          >
            <PersonList
              listData={reactorsArray}
              pagePath='/Profile'
              onClick={(e, reactorId) => removeTalkReaction(e, reactorId)}
              withActionButton
              removeReaction
            />
          </CommonDialog>
          <ConfirmDialog
            isOpen={deleteTalkConfirmDialogIsOpen}
            setIsOpen={setDeleteTalkConfirmDialogIsOpen}
            primaryText='本当にこのトークを削除しますか？'
            secondaryText='削除したトークは元に戻すことが出来ません。'
            onClick={(e) => deleteTalk(e)}
          />
        </SMessageWrap>
      );
    }
  )
);

export default Message;

const SMessageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  height: auto;
  column-gap: 1rem;
  flex-direction: ${(props) => (props.isSender ? 'row-reverse' : 'row')};
  justify-content: flex-start;
`;

const SMessageIcon = styled.div`
  display: ${(props) => (props.isSender ? 'none' : 'block')};
  opacity: ${(props) => (props.senderIconImage === '' ? '0' : '1')};
  > a img {
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const SMessageContent = styled.div`
  width: ${(props) => (props.image === '' ? 'fit-content' : '55%')};
  max-width: ${({ chatWidth }) =>
    chatWidth * 0.8 < 450 ? chatWidth * 0.8 + 'px' : '450px'};
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
  > div {
    width: 100%;
    &:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;
      position: relative;
      align-items: ${(props) => (props.isSender ? 'flex-end' : 'flex-start')};
    }
    &:nth-of-type(2) {
      display: flex;
      justify-content: flex-start;
    }
  }
`;

const SMessage = styled.div`
  width: fit-content;
  min-width: 3.5rem;
  font-size: 0.9rem;
  border-radius: 15px;
  padding: 0.5rem 0.8rem;
  height: auto;
  word-break: break-word;
  display: ${(props) => (props.message ? 'block' : 'none')};
  background-color: ${(props) => (props.isSender ? '#9a979c' : '#ad45de')};
  color: ${(props) => (props.isSender ? 'black' : 'white')};
`;

const SImage = styled.div`
  display: ${(props) => (props.image ? 'block' : 'none')};
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
`;

const SSendInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: ${(props) => props.isSender && 0};
  right: ${(props) => !props.isSender && 0};
  transform: ${(props) =>
    props.isSender ? 'translateX(-120%)' : 'translateX(120%)'};
  display: flex;
  align-items: flex-end;
  flex-direction: ${(props) => (props.isSender ? 'row-reverse' : 'row')};
  column-gap: 0.3rem;
  > div {
    display: flex;
    flex-direction: column;
    row-gap: 0.1rem;
    > p {
      font-size: 0.6rem;
      color: gray;
      white-space: nowrap;
    }
  }
`;
Message.displayName = 'Message';
