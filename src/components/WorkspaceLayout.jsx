// components/Layout.js
import React from 'react';
import WorkspaceShell from './WorkspaceShell';
import CommandBar from './CommandBar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <WorkspaceShell />
      <CommandBar />
      <div className="w-0 flex-grow overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
