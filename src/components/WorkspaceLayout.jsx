// components/Layout.js
import React from 'react';
import WorkspaceShell from './WorkspaceShell';
import CommandBar from './CommandBar';

const Layout = ({ children }) => {
  const [commandBarOpen, setCommandBarOpen] = React.useState(false);

  return (
    <div className="flex h-screen">
      <WorkspaceShell commandBarOpen={commandBarOpen} setCommandBarOpen={setCommandBarOpen} />
      <CommandBar commandBarOpen={commandBarOpen} setCommandBarOpen={setCommandBarOpen} />
      <div className="w-0 flex-grow overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
