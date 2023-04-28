import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '../utils/api';
import { House, Table, UserCircle, PaperPlaneTilt } from '@phosphor-icons/react';
import { stringToVibrantColor, assignColor } from '@/utils/util';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
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
                flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md w-full`}
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
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute mb-[32px] bottom-0 ">
              <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 bg-black w-[180px] p-[8px] text-[13px] cursor-pointer">
                <div className="hover:bg-slate-1 px-[8px] py-[4px]" onClick={handleLogout}>Log out</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}


function WorkspacePopoverContents() {
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
      {workspacesForUserData.map((workspace) => (
        <Link href={`/workspace/${workspace.id}`} key={workspace.id}>
          <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 bg-black w-[180px] p-[8px] text-[13px] cursor-pointer">
            <div className="hover:bg-slate-1 px-[8px] py-[4px]">{workspace.name}</div>
          </div>
        </Link>
      ))}
    </>
  );
}

function WorkspacePopover({ currentWorkspace }) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                flex flex-row gap-3 items-center w-full px-[16px]`}
          >
            <Image
              src={currentWorkspace.iconUrl}
              width="24"
              height="24"
              draggable="false"
              alt="workspace icon"
              className="rounded-sm"
            />
            <p className="text-white">
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
            <Popover.Panel className="absolute mt-[32px] top-0 ">
              <WorkspacePopoverContents />
            </Popover.Panel>
          </Transition>
        </>
      )}
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
    queryKey: ["tables-workspace", currentWorkspace.id],
    queryFn: async () => {
      return await getTables(currentWorkspace.id)
    },
    enabled: currentWorkspace?.id !== null,
    staleTime: 1000
  });

  if (areTablesLoading) {
    return <div>Loading...</div>;
  }

  if (tablesError) {
    return <div>There was an error loading your tables</div>;
  }

  console.log(tablesData);

  return (
    <div className="bg-slate-1 py-[16px] min-w-[240px] text-[13px] text-white flex flex-col gap-2 border-r border-slate-6">
      <WorkspacePopover currentWorkspace={currentWorkspace} />
      {/* core */}
      <div className="mt-2 flex flex-col gap-4 px-[9px]">
        <Link href={`/workspace/${currentWorkspace.id}`}>
          <div className={`flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/home` ? "bg-slate-3" : ""}`}>
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
                <div className={`flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer px-[8px] py-[6px] rounded-md ${router.asPath === `workspace/${currentWorkspace.id}/table/${item.id}` ? "bg-slate-3" : ""}`}>
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
