// components/Layout.js
import React from 'react';
import WorkspaceShell from './WorkspaceShell';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;

  console.log("id", id)

  return (
    <div className="flex h-screen">
      <WorkspaceShell />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default Layout;
