import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import MobileMenu from '../components/MobileMenu';
import CommonSnackbar from '../components/CommonSnackbar';
import LoadingProgress from '../components/LoadingProgress';
import { useRouter } from 'next/router';
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div>
      {router.pathname.split('/')[1] !== 'auth' && (
        <Topbar setIsOpen={setIsOpen} />
      )}
      <LoadingProgress />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <CommonSnackbar />
      {children}
    </div>
  );
};

export default Layout;
