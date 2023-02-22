import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import MobileMenu from '../components/MobileMenu';
import styled from 'styled-components';
import CommonSnackbar from '../components/CommonSnackbar';
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Topbar setIsOpen={setIsOpen} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <CommonSnackbar />
      <SDiv>{children}</SDiv>
    </div>
  );
};

const SDiv = styled.div`
  margin-top: 4.5rem;
`;

export default Layout;
