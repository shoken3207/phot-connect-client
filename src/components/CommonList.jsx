import React, { memo } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import CommonListItem from '../../src/components/CommonListItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TwoColumnBox from '../../src/components/TwoColumnBox';
import { useUserData } from '../provider/UserDataProvider';
import styled from 'styled-components';
import { Button } from '@mui/material';
const PersonList = memo(({ listData, pagePath, onClick, friendAdd }) => {
  const { userData } = useUserData();
  return (
    <SCommonList>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <List>
          {listData.map((itemData) =>
            friendAdd ? (
              <TwoColumnBox
                key={itemData.id}
                isDisabled={
                  userData.friends.includes(itemData.id) ||
                  itemData.id === userData._id
                    ? true
                    : false
                }
              >
                <CommonListItem
                  id={itemData.id}
                  iconImage={itemData.iconImage}
                  primaryText={itemData.primaryText}
                  secondaryText={itemData.secondaryText}
                  href={`${pagePath}/${itemData.id}`}
                  key={itemData.id}
                />
                <Button onClick={(e) => onClick(e, userData._id, itemData.id)}>
                  <PersonAddIcon />
                </Button>
              </TwoColumnBox>
            ) : (
              <CommonListItem
                id={itemData.id}
                iconImage={itemData.iconImage}
                primaryText={itemData.primaryText}
                secondaryText={itemData.secondaryText}
                href={`${pagePath}/${itemData.id}`}
                key={itemData.id}
              />
            )
          )}
        </List>
      </Box>
    </SCommonList>
  );
});

const SCommonList = styled.div`
  max-height: 70vh;
  height: auto;
  overflow-y: scroll;
`;

export default PersonList;
