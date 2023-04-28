import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '../utils/api';
import { House, Table, UserCircle, PaperPlaneTilt, CircleNotch, Check } from '@phosphor-icons/react';
import { stringToVibrantColor, assignColor } from '@/utils/util';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react'
import { getWorkspaces } from '@/utils/api';

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
                flex flex-row gap-2 group hover:bg-slate-4 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md w-full`}
          >
            <UserCircle
              size={20}
              weight="fill"
              className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
            />
            <div className="">Account</div>
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
              <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 bg-slate-2 w-[180px] p-[8px] text-[13px] cursor-pointer">
                <div className="hover:bg-slate-4 px-[8px] py-[4px]" onClick={handleLogout}>Log out</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

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
    return <div>Loading...</div>;
  }

  if (workspacesForUserError) {
    return <div>There was an error loading your table</div>;
  }

  return (
    <>
      <div className="px-[16px] pt-[12px] pb-[4px] text-slate-11 text-[12px]">{currentUser.email}</div>
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
                  <div className="text-[10px] text-white">{workspace.name.slice(0, 1)}</div>
                </div>
                {workspace.name}
                {workspace.id === currentWorkspace.id && (
                  <div className="ml-auto text-white">
                    <Check
                      size={16}
                      weight="bold"
                      className="text-white group-hover:text-slate-11 transition-all duration-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Popover.Button>
      ))
      }

      <div className="flex flex-col px-[8px] py-[12px] mt-[12px] border-t border-slate-4 w-full text-[12px] text-slate-11">
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
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? 'bg-slate-3' : 'hover:bg-slate-3 active:bg-slate-4'}
                flex flex-row gap-3 items-center mx-[10px] focus:outline-none pl-[8px] pr-[12px] py-[6px] rounded-md`}
          >
            <div
              className={`h-[24px] w-[24px] flex items-center justify-center text-[18px] rounded-sm`}
              style={{
                backgroundImage: `url(${currentWorkspace.iconUrl})`,
                backgroundSize: 'cover',
              }}
            >
              <div className="text-[10px] text-white">{currentWorkspace.name.slice(0, 1)}</div>
            </div>
            <p className="text-white flex-grow truncate max-w-[160px]">
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
            <Popover.Panel className="absolute mt-[44px] ml-[12px] top-0 rounded-md bg-slate-2 shadow-2xl border border-slate-4 flex flex-col items-start justify-start">
              <WorkspacePopoverContents currentUser={currentUser} currentWorkspace={currentWorkspace} />
            </Popover.Panel>
          </Transition>
        </>
      )
      }
    </Popover>
  )
}


const WorkspaceShell = () => {
  // Replace the items array with your dynamic data
  const router = useRouter();
  console.log("pathname", router.asPath);
  // console.log("In Workspce Shell id", id)

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

  console.log("currentWorkspace", currentWorkspace)

  const {
    data: tablesData,
    isLoading: areTablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["workspaceTables", currentWorkspace?.id],
    queryFn: async () => {
      return await getTables(currentWorkspace?.id)
    },
    enabled: currentWorkspace?.id !== null,
    staleTime: 1000
  });

  if (areTablesLoading || isWorkspaceLoading || isUserLoading) {
    return (
      <div className="bg-slate-1 py-[16px] w-[240px] text-[13px] text-white flex flex-col gap-2 border-r border-slate-6 items-center justify-center">
        <span className="animate-spin">
          <CircleNotch width={20} height={20} />
        </span>
      </div>
    )
  }

  if (tablesError || workspaceError || userError) {
    return <div className="text-white">There was an error loading your tables</div>;
  }

  console.log(tablesData);

  return (
    <div className="bg-slate-1 py-[10px] w-[240px] text-[13px] text-white flex flex-col border-r border-slate-6">
      <WorkspacePopover currentWorkspace={currentWorkspace} currentUser={currentUser} />
      {/* core */}
      <div className="mt-2 flex flex-col gap-4 px-[9px]">
        <Link href={`/workspace/${currentWorkspace.id}`}>
          <div className={`flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/home` ? "bg-slate-3" : ""}`}>
            <House
              size={20}
              weight="fill"
              className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
            />
            <div className="">Home</div>
          </div>
        </Link>
        <div className="space-y-2">
          <div className="px-[8px] text-slate-11 text-[13px] flex flex-row">
            <div>Tables</div>
            <div className="ml-auto">+ New</div></div>
          <div>
            {tablesData.map((item) => (
              <Link key={item.id} href={`/workspace/${currentWorkspace.id}/table/${item.id}`}>
                <div className={`flex flex-row gap-3 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/table/${item.id}` ? "bg-slate-3" : ""}`}>
                  <Table
                    size={20}
                    weight="fill"
                    className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
                    style={{
                      color: assignColor(item.displayName)
                    }}
                  />
                  <div>{item.displayName}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="mt-auto flex flex-col px-[13px]">
        <div className="flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md">
          <PaperPlaneTilt
            size={20}
            weight="fill"
            className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
          />
          <div className="">Invite people</div>
        </div>
        <AccountPopover />
      </div>
    </div>
  );
};

export default WorkspaceShell;
