import React from 'react';
import styled from 'styled-components';
const TwoColumnBox = ({ children, isDisabled }) => {
  return (
    <STwoColumn isDisabled={isDisabled}>
      {children[0]}
      {children[1]}
    </STwoColumn>
  );
};

export default TwoColumnBox;

const STwoColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'auto')};
  opacity: ${(props) => (props.isDisabled ? 0.7 : 1)};

  &:first-child {
    flex: 7;
  }
  &:last-child {
    flex: 2.5;
  }
`;
