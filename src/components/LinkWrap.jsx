import React from 'react';
import Link from 'next/link';

const LinkWrap = ({ children, href }) => {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'black' }}>
      {children}
    </Link>
  );
};

export default LinkWrap;
