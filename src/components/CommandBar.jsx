import { Command } from 'cmdk'
import React, { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { CircleNotch, TreeStructure, House, Table } from '@phosphor-icons/react';
import { getTables } from '@/utils/api';
import { useRouter } from 'next/router';


export const CommandBar = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('connections')


  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])


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

  const allItems = [
    {
      name: 'Connections',
      description: 'View and manage your connections',
      icon: <TreeStructure width={20} height={20} weight="fill" />,
      type: 'navigation',
      id: 'connections',
      link: `/workspace/${currentWorkspace?.id}/connection`,
    },
    {
      name: 'Home',
      description: 'Go back home',
      icon: <House width={20} height={20} weight="fill" />,
      type: 'navigation',
      id: 'home',
      link: `/workspace/${currentWorkspace?.id}/`,
    }
  ];

  if (tablesData.length > 0) {
    tablesData.forEach((table) => {
      allItems.push({
        name: table.displayName,
        description: table.fullName,
        icon: table.iconUrl ?? <Table width={20} height={20} weight="fill" />,
        type: 'table',
        id: String(table.id),
        link: `/workspace/${currentWorkspace?.id}/table/${table.id}`,
      });
    });
    console.log('allItems', allItems)
  }

  return (
    <>
      {open && (
        <Command.Dialog
          data-state={open ? 'open' : 'closed'}
          open={open}
          onOpenChange={setOpen}
          value={value}
          loop={true}
          onValueChange={(v) => {
            console.log('value', v)
            setValue(v)
          }}
          label="Global Command Menu"
          className="absolute inset-0  left-[50%] translate-x-[-50%] top-[25%] translate-y-[-25%] max-h-[40vh] overflow-y-auto bg-[#101112] text-white text-[14px] rounded-xl data-[state=open]:animate-commandBar">
          <div className={`command-dialog-content ${open ? 'open' : ''}`}>
            <div className="sticky top-0 flex flex-col border-b border-slate-4 px-[16px] pt-[12px] bg-[#101112]">
              <div cmdk-linear-badge="" className="text-[13px] text-slate-11 px-[6px] py-[3px] rounded-md bg-slate-2 w-fit">Jump to:</div>
              <Command.Input autoFocus placeholder="Type a command or search..."
                className="bg-[#101112] placeholder:text-slate-10 w-full border-none text-[14px] focus:outline-none focus:ring-0 px-[0px]"
              />
            </div>
            <div className="mx-[6px]">
              <Command.List className="py-[6px]">
                <Command.Empty><div className="px-[10px] pt-[8px] text-slate-11">No results found.</div></Command.Empty>
                {allItems.map((item) => {
                  const id = item.id;
                  const searchable_id_name = `${item.id}${item.name}`;
                  return (
                    <Command.Item
                      key={searchable_id_name}
                      value={searchable_id_name}
                      className={`focus:border focus:border-white ${(value === searchable_id_name.toLowerCase()) ? "bg-slate-2" : ""} flex flex-row py-2 px-[10px] rounded-[4px]`}
                      onMouseEnter={() => {
                        console.log("hovering", searchable_id_name);
                        setValue(searchable_id_name);
                        console.log("value", value);
                      }}
                      onSelect={
                        () => {
                          // route to table
                          router.push(item.link)
                          // toggle closed
                          setOpen(false);
                        }
                      }
                    >
                      <div className="flex flex-row gap-2 w-full">
                        <div className="w-[24px] text-slate-10">{item.icon}</div>
                        <div className="w-[240px]">{item.name}</div>
                        <div className="text-slate-11">{item.description}</div>
                      </div>
                    </Command.Item>
                  )
                })}
              </Command.List>
            </div>
          </div>
        </Command.Dialog>
      )}
    </>
  )
}

export default CommandBar

