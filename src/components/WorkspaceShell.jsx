import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useQuery } from '@tanstack/react-query';
import { getTables, getWorkspaceConnections } from '../utils/api';
import { House, Table, UserCircle, PaperPlaneTilt, CircleNotch, Check, TreeStructure, Database, SignOut, CaretDoubleLeft, Compass, } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react'
import { getWorkspaces } from '@/utils/api';
import { IconLoaderFromSvgString } from '@/components/IconLoaderFromSVGString';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useLocalStorageState } from '@/utils/util';

function AccountPopover() {
  const router = useRouter();
  const handleLogout = () => {
    console.log('logout')
    router.push('/login?lo=true')
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                flex flex-row gap-3 group hover:bg-slate-4 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md w-full`}
          >
            <UserCircle
              size={20}
              weight="fill"
              className="text-slate-10 group-hover:text-slate-11 transition-all duration-100 min-h-[20px] min-w-[20px]"
            />
            <div className="truncate w-full text-left">Account</div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-50"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute mb-[32px] bottom-0 ">
              <div className="overflow-visible rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 bg-slate-2 w-[180px] p-[8px] text-[13px] cursor-pointer">
                <div className="hover:bg-slate-4 px-[8px] py-[4px] flex flex-row items-center gap-2" onClick={handleLogout}>
                  <SignOut size={16} weight="bold" className="text-slate-10" />
                  Log out
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

const KeyCombination = ({ keys }) => {
  const isMac = window.navigator.userAgent.includes('Mac');

  return (
    <div className="flex flex-row gap-1">
      {keys.map((key, index) => {
        let displayKey = key;
        if (key.toLowerCase() === 'cmd' || key.toLowerCase() === 'meta') {
          displayKey = isMac ? '⌘' : 'ctrl';
        }
        return (
          <p key={index} className="min-h-[20px] min-w-[20px] bg-slate-3 flex items-center justify-center rounded-[3px]">{displayKey}</p>
        );
      })}
    </div>
  );
};

function WorkspacePopoverContents({ currentWorkspace, currentUser }) {
  const router = useRouter();

  const {
    data: workspacesForUserData,
    isLoading: isWorkspacesForUserLoading,
    error: workspacesForUserError,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return await getWorkspaces();
    },
  });

  if (isWorkspacesForUserLoading) {
    return <div className="h-screen bg-slate-1 text-slate-12">Loading...</div>;
  }

  if (workspacesForUserError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <>
      <div className="px-[16px] pt-[13px] pb-[4px] text-slate-11 text-[13px]">{currentUser.email}</div>
      <div className="max-h-[60vh] overflow-y-scroll">
        {workspacesForUserData.map((workspace) => (
          <Popover.Button key={workspace.id}>
            <div onClick={(e) => {
              router.push(`/workspace/${workspace.id}`);
            }}>
              <div className="w-[240px] px-[8px] text-[13px] cursor-pointer">
                <div className="hover:bg-slate-4 px-[8px] py-[8px] text-left flex flex-row gap-3 rounded-md items-center">
                  <div
                    className={`h-[24px] w-[24px] flex items-center justify-center text-[18px] rounded-sm`}
                    style={{
                      backgroundImage: `url(${workspace.iconUrl})`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className="text-[10px] text-slate-12">{workspace.name.slice(0, 1)}</div>
                  </div>
                  <div className="max-w-[140px] truncate">{workspace.name}</div>
                  {workspace.id === currentWorkspace.id && (
                    <div className="ml-auto text-slate-12">
                      <Check
                        size={16}
                        weight="bold"
                        className="text-slate-12 group-hover:text-slate-11 transition-all duration-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Popover.Button>
        ))
        }
      </div>
      <div className="flex flex-col px-[8px] py-[13px] mt-[13px] border-t border-slate-4 w-full text-[13px] text-slate-11">
        <Popover.Button>
          <div className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 rounded-md items-center"
            onClick={(e) => {
              router.push(`/workspace/${currentWorkspace.id}/settings`);
            }}>
            Workspace settings
          </div>
        </Popover.Button>
        <Popover.Button>
          <div className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 rounded-md items-center"
            onClick={(e) => {
              router.push(`/create-workspace`);
            }}>
            Create a new workspace
          </div>
        </Popover.Button>
        <Popover.Button>
          <div className="hover:bg-slate-4 px-[8px] py-[6px] text-left flex flex-row gap-3 rounded-md items-center"
            onClick={(e) => {
              router.push(`/join-workspace`);
            }}>
            Join an existing workspace
          </div>
        </Popover.Button>
      </div>
    </>
  );
}

function WorkspacePopover({ currentWorkspace, currentUser }) {

  return (
    <Popover className="flex flex-grow">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? 'bg-slate-3' : 'hover:bg-slate-3 active:bg-slate-4'}
                flex flex-row flex-grow gap-3 items-center mx-[10px] focus:outline-none pl-[8px] pr-[13px] py-[6px] rounded-md`}
          >
            <div
              className={`h-[24px] w-[24px] flex items-center justify-center text-[18px] rounded-sm`}
              style={{
                backgroundImage: `url(${currentWorkspace.iconUrl})`,
                backgroundSize: 'cover',
              }}
            >
              <div className="text-[10px] text-slate-12">{currentWorkspace.name.slice(0, 1)}</div>
            </div>
            <p className="text-slate-12 text-left flex-grow truncate w-0">
              {currentWorkspace.name}
            </p>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute mt-[44px] max-h-[80vh] ml-[13px] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-shrink w-[260px] flex-col items-start justify-start">
              <WorkspacePopoverContents currentUser={currentUser} currentWorkspace={currentWorkspace} />
            </Popover.Panel>
          </Transition>
        </>
      )
      }
    </Popover>
  )
}


const WorkspaceShell = ({ commandBarOpen, setCommandBarOpen }) => {
  // Replace the items array with your dynamic data
  const router = useRouter();
  console.log("pathname", router.asPath);

  // console.log("In Workspce Shell id", id)
  const [shellExpanded, setShellExpanded] = useLocalStorageState("shellExpanded", true);
  const controls = useAnimation();

  const toggleShell = useCallback(async () => {
    await controls.start({
      width: shellExpanded ? "56px" : "240px",
      transition: { duration: 0.15, ease: "easeOut" },
    });
    setShellExpanded(prevShellExpanded => !prevShellExpanded);
  }, [shellExpanded, controls, setShellExpanded]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === '.') {
        toggleShell(); // toggle shellExpanded when the key combination is pressed
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleShell]); // add toggleShell to the dependency array

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();

  const {
    data: currentWorkspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
  } = useCurrentWorkspace();


  const {
    data: tablesData,
    isLoading: areTablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["getTables", currentWorkspace?.id],
    queryFn: async () => {
      return await getTables(currentWorkspace?.id)
    },
    enabled: currentWorkspace?.id !== null,
    staleTime: 1000
  });

  const {
    data: connectionsData,
    isLoading: isConnectionsLoading,
    error: connectionsError,
  } = useQuery({
    queryKey: ["getConnections", currentWorkspace?.id],
    queryFn: async () => {
      const response = await getWorkspaceConnections(currentWorkspace?.id);
      return response;
    },
    enabled: currentWorkspace?.id !== null,
  });

  if (areTablesLoading || isWorkspaceLoading || isUserLoading || isConnectionsLoading) {
    return (
      <></>
    )
  }

  if (tablesError || workspaceError || userError || connectionsError) {
    return <div className="text-slate-12">There was an error loading your tables</div>;
  }

  console.log(tablesData);

  return (
    <motion.div className="bg-slate-1 py-[10px] text-[13px] text-slate-12 flex flex-col border-r border-slate-4"
      animate={controls}
      initial={{
        width: shellExpanded ? "240px" : "56px",
      }}>
      <div className="flex flex-row w-full items-center justify-start h-[36px]">
        {shellExpanded && (<WorkspacePopover currentWorkspace={currentWorkspace} currentUser={currentUser} />)}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                className={`${shellExpanded ? "ml-auto mr-[12px] h-[32px] w-[32px]" : "w-[37px] h-[32px] ml-[8px]"} flex items-center justify-center hover:bg-slate-3 rounded-md`}
                onClick={toggleShell}
              >
                <motion.div
                  animate={{ rotateY: shellExpanded ? 0 : 180 }}
                  transition={{ duration: 0.15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <CaretDoubleLeft className="text-slate-11" size={18} />
                </motion.div>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                sideOffset={12}
                side="right"
              >
                <div className="flex flex-row gap-2">
                  <p>Toggle sidebar</p>
                  <KeyCombination keys={['cmd', '.']} />
                </div>
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
      {/* core */}
      <div className="mt-2 flex flex-col px-[9px]">
        <Link href={`/workspace/${currentWorkspace.id}`}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className={`flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/home` ? "bg-slate-3" : ""}`}>
                  <House
                    size={20}
                    weight="fill"
                    className="text-slate-10 group-hover:text-slate-11 transition-all duration-100 min-h-[20px] min-w-[20px]"
                  />
                  <div className="truncate w-full">Home</div>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                  sideOffset={12}
                  side="left"
                >
                  <div className="flex flex-row gap-2">
                    <p>Home</p>
                  </div>
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Link>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                className={`flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/home` ? "bg-slate-3" : ""}`}
                onClick={() => {
                  console.log("awu: current", commandBarOpen, "set to:", !commandBarOpen)
                  setCommandBarOpen(!commandBarOpen)
                }}>
                <Compass
                  size={20}
                  weight="fill"
                  className="text-slate-10 group-hover:text-slate-11 transition-all duration-100 min-h-[20px] min-w-[20px]"
                />
                <div className="truncate w-full">Jump to..</div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                sideOffset={12}
                side="left"
              >
                <div className="flex flex-row gap-2">
                  <p>Launch quick switcher</p>
                  <KeyCombination keys={['cmd', 'K']} />
                </div>
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <div className="space-y-2 mt-4">
          {connectionsData?.length > 0 && (
            <>
              <div className="pl-[8px] text-slate-11 text-[13px] flex flex-row items-center h-[28px]">
                {shellExpanded && (<>
                  <div>Tables</div>
                  <Link className="ml-auto hover:bg-slate-3 hover:text-white duration-100 transition-all py-[4px] pl-[8px] pr-[12px] rounded-md" href={`/workspace/${currentWorkspace?.id}/table/new`}><div className="text-right whitespace-nowrap">+ New</div></Link>
                </>)}
                {!shellExpanded && (<>
                  <hr className="border border-slate-5 w-full mr-[8px]"></hr>
                </>)}
              </div>
              <div>
                {tablesData.length === 0 && (
                  <div className="w-full flex flex-col gap-2 mt-4 items-center justify-center py-6 rounded-lg">
                    <Image src="/images/table-splash-zero-state.svg"
                      width={48}
                      height={48}
                      alt="Splash icon for tables zero state" />
                    <p className="text-slate-11 px-[16px] text-center text-[13px] mt-2">No tables created yet</p>
                    <p className="text-slate-10 px-[16px] text-center text-[12px]">Create a table by clicking the <br />+ New button in the top-right</p>
                  </div>
                )}
                {tablesData.length > 0 && tablesData.map((item) => (
                  <Link key={item.id} href={`/workspace/${currentWorkspace.id}/table/${item.id}`}>
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className={`flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/table/${item.id}` ? "bg-slate-3" : ""}`}>
                            <IconLoaderFromSvgString iconSvgString={item.iconSvgString} tableName={item.displayName} />
                            <div className="truncate w-full">{item.displayName}</div>
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                            sideOffset={12}
                            side="left"
                          >
                            {item.displayName}
                            <Tooltip.Arrow className="fill-black" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* footer */}
      <div className="mt-auto flex flex-col px-[9px]">
        <Link href={`/workspace/${currentWorkspace.id}/connection`}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md">
                  <TreeStructure
                    size={20}
                    weight="fill"
                    className="text-slate-10 group-hover:text-slate-11 transition-all duration-100 min-h-[20px] min-w-[20px]"
                  />
                  <div className="truncate w-full">Data connections</div>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                  sideOffset={12}
                  side="left"
                >
                  Data connections
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Link>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md">
                <PaperPlaneTilt
                  size={20}
                  weight="fill"
                  className="text-slate-10 group-hover:text-slate-11 transition-all duration-100 min-h-[20px] min-w-[20px]"
                />
                <div className="truncate w-full">Invite people</div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="text-slate-12 text-[13px] rounded-[4px] bg-black px-[12px] py-[8px] z-20 shadow-2xl"
                sideOffset={12}
                side="left"
              >
                Invite people
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <AccountPopover />
      </div>
    </motion.div>
  );
};

export default WorkspaceShell;
