import { Command } from 'cmdk'
import React, { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { CircleNotch, TreeStructure, House, Table, Plus, Gear, ChatText } from '@phosphor-icons/react';
import { getTables } from '@/utils/api';
import { useRouter } from 'next/router';
import { IconLoaderFromSvgString } from '@/components/IconLoaderFromSVGString';
import { useAuth } from "@clerk/nextjs";

export const CommandBar = ({ commandBarOpen, setCommandBarOpen }) => {
  const { getToken } = useAuth();
  const router = useRouter();
  // const [commandBarOpen, setCommandBarOpen] = React.useState(false)
  const [value, setValue] = React.useState('homehome')

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && e.metaKey) {
        setCommandBarOpen((open) => !open)
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
    queryKey: ["getTables", currentWorkspace?.id],
    queryFn: async () => {
      const jwt = await getToken({ template: "test" });
      const result = await getTables(currentWorkspace?.id, jwt)
      return result
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 1000
  });

  if (areTablesLoading || isWorkspaceLoading || isUserLoading) {
    return (
      <div className="bg-slate-1 py-[16px] w-[240px] text-[13px] text-slate-12 flex flex-col gap-2 border-r border-slate-6 items-center justify-center">
        <span className="animate-spin">
          <CircleNotch width={20} height={20} />
        </span>
      </div>
    )
  }

  if (tablesError || workspaceError || userError) {
    return <div className="text-slate-12">There was an error loading your tables</div>;
  }

  const navigationItems = [
    {
      name: 'Home',
      description: 'Go back home',
      icon: <House width={20} height={20} weight="fill" />,
      type: 'navigation',
      id: 'home',
      link: `/workspace/${currentWorkspace?.id}/`,
    },
    {
      name: 'Data sources',
      description: 'View and manage your data sources',
      icon: <TreeStructure width={20} height={20} weight="fill" />,
      type: 'navigation',
      id: 'datasources',
      link: `/workspace/${currentWorkspace?.id}/data-source`,
    },
    {
      name: 'New data source',
      description: 'Connect to sources like Snowflake, BigQuery, and Postgres',
      icon: <Plus width={20} height={20} weight="bold" />,
      type: 'navigation',
      id: 'newdatasource',
      link: `/workspace/${currentWorkspace?.id}/data-source/new`,
    },
    {
      name: 'New table',
      description: 'Create a new table from a data source',
      icon: <Plus width={20} height={20} weight="bold" />,
      type: 'navigation',
      id: 'newtable',
      link: `/workspace/${currentWorkspace?.id}/table/new`,
    },
    {
      name: 'Settings',
      description: 'Manage your workspace, billing, members, and more',
      icon: <Gear width={20} height={20} weight="fill" />,
      type: 'navigation',
      id: 'settings',
      link: `/workspace/${currentWorkspace?.id}/settings/general`,
    },
  ];

  const tables = [];

  if (tablesData.length > 0) {
    tablesData.forEach((table) => {
      tables.push({
        name: table.name,
        description: table.fullPath,
        iconSvgBase64Url: table.iconSvgBase64Url,
        type: 'table',
        id: String(table.id),
        link: `/workspace/${currentWorkspace?.id}/table/${table.id}`,
      });
    });
  }

  return (
    <>
      {commandBarOpen && (
        <Command.Dialog
          data-state={commandBarOpen ? 'open' : 'closed'}
          open={commandBarOpen}
          onOpenChange={setCommandBarOpen}
          value={value}
          loop={true}
          onValueChange={(v) => {
            setValue(v)
          }}
          label="Global Command Menu"
          className="absolute inset-0  left-[50%] translate-x-[-50%] top-[25%] translate-y-[-25%]  min-w-[680px] max-w-[50vw] bg-[#101112] text-slate-12 text-[14px] h-fit rounded-xl overflow-clip data-[state=open]:animate-commandBar">
          <div className={`command-dialog-content ${commandBarOpen ? 'open' : ''}`}>
            <div className="flex flex-col border-b border-slate-4 px-[16px] pt-[12px] bg-[#101112]">
              <div cmdk-linear-badge="" className="text-[13px] text-slate-11 px-[6px] py-[3px] rounded-md bg-slate-2 w-fit">Jump to:</div>
              <Command.Input autoFocus placeholder="Type a command or search..."
                className="bg-[#101112] placeholder:text-slate-10 w-full border-none text-[14px] focus:outline-none focus:ring-0 px-[0px]"
              />
            </div>
            <div className="mx-[6px] overflow-y-auto h-[50vh]">
              <Command.List className="py-[6px]"
              >
                <Command.Empty><div className="px-[10px] pt-[8px] text-slate-11">No results found.</div></Command.Empty>
                {tablesData.length > 0 && (

                  <Command.Group heading="Tables" className="mt-2">
                    {tables.map((item) => {
                      const id = item.id;
                      const searchable_id_name = `${item.id} ${item.name} ${item.description}`;
                      return (
                        <Command.Item
                          key={searchable_id_name}
                          value={searchable_id_name}
                          className={`focus:border focus:border-white ${(value === searchable_id_name.toLowerCase()) ? "bg-slate-3" : ""} flex flex-row py-2 px-[10px] rounded-[4px]`}
                          onMouseEnter={() => {
                            setValue(searchable_id_name);
                          }}
                          onSelect={
                            () => {
                              // route to table
                              router.push(item.link)
                              // toggle closed
                              setCommandBarOpen(false);
                            }
                          }
                        >
                          <div className="flex flex-row gap-2 w-full">
                            <div className="min-w-[24px] text-slate-10"><IconLoaderFromSvgString iconSvgBase64Url={item.iconSvgBase64Url} /></div>
                            <div className="w-[240px] truncate">{item.name}</div>
                            <div className="ml-2 font-mono block truncate px-1.5 py-0.5 bg-slate-3 rounded-md text-[12px] text-slate-11">
                              {item.description.replaceAll(".", "/")}
                            </div>
                          </div>
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                )}
                <Command.Group heading="Navigation" className="py-[8px]">
                  {navigationItems.map((item) => {
                    const id = item.id;
                    const searchable_id_name = `${item.id} ${item.name} ${item.description}`;
                    return (
                      <Command.Item
                        key={searchable_id_name}
                        value={searchable_id_name}
                        className={`focus:border focus:border-white ${(value === searchable_id_name.toLowerCase()) ? "bg-slate-3" : ""} flex flex-row py-2 px-[10px] rounded-[4px]`}
                        onMouseEnter={() => {
                          setValue(searchable_id_name);
                        }}
                        onSelect={
                          () => {
                            // route to table
                            router.push(item.link)
                            // toggle closed
                            setCommandBarOpen(false);
                          }
                        }
                      >
                        <div className="flex flex-row gap-2 w-full">
                          <div className="min-w-[24px] text-slate-10">{item.icon}</div>
                          <div className="min-w-[240px]">{item.name}</div>
                          <div className="ml-2 text-slate-11">{item.description}</div>
                        </div>
                      </Command.Item>
                    )
                  })}
                  <Command.Item
                    value="helpsupport"
                    className={`focus:border focus:border-white ${(value === "helpsupport") ? "bg-slate-3" : ""} flex flex-row py-2 px-[10px] rounded-[4px]`}
                    onMouseEnter={() => {
                      setValue("helpsupport");
                    }}
                    onSelect={
                      () => {
                        // get the current url
                        const current_url = window.location.href;
                        const support_body = `Write what you need help with:\n\n\n
                        ---------------------------------------------
                        Report details:
                        - Reporting URL: ${current_url}
                        - User ID: ${currentUser.id}
                        - User email: ${currentUser.email}
                        - Workspace name: ${currentWorkspace.name}
                        - Workspace ID: ${currentWorkspace.id}`
                        // open mailto: link
                        window.open(`mailto:support@dataland.io?subject=Help%20with%20Dataland&body=${encodeURIComponent(support_body)}`)
                        // toggle closed
                        setCommandBarOpen(false);
                      }
                    }
                  >
                    <div className="flex flex-row gap-2 w-full">
                      <div className="min-w-[24px] text-slate-10"><ChatText size={20} className="text-slate-10" weight='fill' /></div>
                      <div className="min-w-[240px]">Contact support</div>
                      <div className="ml-2 text-slate-11">Email us if you need help!</div>
                    </div>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </div>
          </div>
        </Command.Dialog>
      )}
    </>
  )
}

export default CommandBar

