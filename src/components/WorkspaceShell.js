import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { useQuery } from '@tanstack/react-query';
import { getTables } from '../utils/api';
import { House, Table, UserCircle, PaperPlaneTilt } from '@phosphor-icons/react';
import { stringToVibrantColor, assignColor } from '@/utils/util';

const WorkspaceShell = () => {
  // Replace the items array with your dynamic data

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
    <div className="bg-slate-1 py-[20px] min-w-[240px] text-[14px] text-white flex flex-col gap-2 border-r border-slate-6">
      {/* workspace header */}
      <div className="flex flex-row gap-3 items-center w-full px-[20px]">
        <Image
          src={currentWorkspace.iconUrl}
          width="28"
          height="28"
          draggable="false"
          alt="workspace icon"
          className="rounded-sm"
        />
        <p className="text-white">
          {currentWorkspace.name}
        </p>
      </div>
      {/* core */}
      <div className="mt-2 flex flex-col gap-4 px-[14px]">
        <div className="flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer p-[8px] rounded-md">
          <House
            size={20}
            weight="fill"
            className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
          />
          <Link href={`/home`}>
            <div className="">Home</div>
          </Link>
        </div>
        <div className="space-y-2">
          <div className="px-[8px] text-slate-11 text-[13px] flex flex-row">
            <div>Tables</div>
            <div className="ml-auto">+ New</div></div>
          <div>
            {tablesData.map((item) => (
              <Link key={item.id} href={`/table/${item.id}`}>
                <div className="flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer p-[8px] rounded-md cursor-pointer">
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
      <div className="mt-auto flex flex-col px-[14px]">
        <div className="flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer p-[8px] rounded-md">
          <PaperPlaneTilt
            size={20}
            weight="fill"
            className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
          />
          <div className="">Invite people</div>
        </div>
        <div className="flex flex-row gap-2 group hover:bg-slate-3 transition-all duration-100 cursor-pointer p-[8px] rounded-md">
          <UserCircle
            size={20}
            weight="fill"
            className="text-slate-10 group-hover:text-slate-11 transition-all duration-100"
          />
          <div className="">Account</div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceShell;
