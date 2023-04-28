// components/Layout.js
import React from 'react';
import WorkspaceShell from './WorkspaceShell';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <WorkspaceShell />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default Layout;
