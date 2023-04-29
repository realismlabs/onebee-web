// components/Layout.js
import React from 'react';
import WorkspaceShell from './WorkspaceShell';
import CommandBar from './CommandBar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <WorkspaceShell />
      <CommandBar />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default Layout;
