import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import MobileMenu from '../components/MobileMenu';
import CommonSnackbar from '../components/CommonSnackbar';
import LoadingProgress from '../components/LoadingProgress';
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <LoadingProgress />
      <Topbar setIsOpen={setIsOpen} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <CommonSnackbar />
      {children}
    </div>
  );
};

export default Layout;
